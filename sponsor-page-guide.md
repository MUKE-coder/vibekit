# Add a Sponsor / "Buy Me a Coffee" Page (Stripe Checkout)

A drop-in, self-contained guide to add a working sponsorship page to **any Next.js
(App Router) site**. Visitors can send a one-time tip or start a monthly
sponsorship; they're taken to Stripe's hosted checkout and back to a thank-you
page.

**The only thing you need is a Stripe secret key.** No publishable key, no
webhook, no pre-created products — the page builds the price on the fly.

Everything below is copy-paste. Nothing here depends on a design system, a UI
library, or any specific components — just React, Tailwind (for styling), and the
`stripe` package.

---

## What you get

- A `/sponsor` page with a **One-time** tab ($5 / $25 / $100 + custom) and a
  **Monthly** tab (tiered plans).
- A `/api/checkout` route that creates a Stripe Checkout Session
  (`payment` for one-time, `subscription` for monthly).
- A `/sponsor/success` thank-you page.
- Client-side + server-side validation, loading state, and graceful errors.

---

## Prerequisites

- A **Next.js 14/15/16 project using the App Router** (`app/` directory).
- **Tailwind CSS** (the snippets use Tailwind classes; if you don't use Tailwind,
  swap them for your own CSS).
- A **Stripe account** (free): <https://dashboard.stripe.com/register>.
- Optional: `lucide-react` for the icons. If you don't want it, delete the icon
  imports and the `<Icon />` usages — the page works fine without them.

---

## Step 1 — Get your Stripe secret key

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/apikeys) →
   **Developers → API keys**.
2. Copy the **Secret key**:
   - **Test mode** key starts with `sk_test_…` — use this while developing.
   - **Live mode** key starts with `sk_live_…` — use this in production.
3. That's the *only* key you need. The **publishable key is not required** — Stripe
   Checkout is hosted and redirect-based, so no card details ever touch your site.

> ⚠️ The secret key is **server-only**. Never put it in client code, never prefix
> it with `NEXT_PUBLIC_`, never commit it.

---

## Step 2 — Install Stripe

```bash
npm install stripe
# or: pnpm add stripe   /   yarn add stripe
```

Optional icons:

```bash
npm install lucide-react
```

---

## Step 3 — Add the environment variable

Create or edit `.env.local` in your project root:

```ini
# Stripe — server-only. Use sk_test_… locally, sk_live_… in production.
STRIPE_SECRET_KEY="sk_test_your_key_here"
```

Add it to `.env.example` (with a placeholder, no real value) so your team knows
it's required, and make sure `.env.local` is in `.gitignore` (Next.js ignores it
by default).

In production (e.g. **Vercel** → Project → Settings → Environment Variables), add
`STRIPE_SECRET_KEY` with your `sk_live_…` value, then redeploy.

---

## Step 4 — The config (tiers + amounts)

This is the single source of truth for your plans. Edit the names, prices, and
perks to fit your project. Create **`config/sponsors.ts`**:

```ts
// config/sponsors.ts
//
// The single source of truth for sponsorship — the tier ladder and the one-time
// amounts. Both the page and the API route read from here, so a price is never
// hardcoded twice.
//
// Perks are PROMISES — only list ones you'll actually honour.

export type SponsorTierId = "supporter" | "backer" | "sponsor" | "partner";
export type SponsorInterval = "month" | "once";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** USD per month. Also the Stripe unit_amount (×100) for the monthly plan. */
  price: number;
  blurb: string;
  perks: string[];
  /** The tier the UI visually leads with. */
  featured?: boolean;
}

/** The ladder, cheapest → dearest. The UI relies on this order. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    price: 5,
    blurb: "Buy me a coffee every month and keep the project moving.",
    perks: ["A heartfelt thank-you", "Your name in the SPONSORS list"],
  },
  {
    id: "backer",
    name: "Backer",
    price: 25,
    blurb: "For developers and small teams.",
    perks: ["Everything in Supporter", "Your name + link in the README", "Early access to updates"],
  },
  {
    id: "sponsor",
    name: "Sponsor",
    price: 100,
    blurb: "Top billing — the sweet spot for companies.",
    perks: ["Everything in Backer", "Your logo on the site", "Priority support"],
    featured: true,
  },
  {
    id: "partner",
    name: "Partner",
    price: 500,
    blurb: "You want everyone to know you back this project.",
    perks: ["Everything in Sponsor", "Hero logo placement", "A direct line to the maintainer"],
  },
];

/** One-time "buy me a coffee" amounts. `custom` is handled separately. */
export const ONE_TIME_AMOUNTS = [5, 25, 100] as const;

export const SPONSOR_MIN_USD = 1;
/** Mirrors the cap enforced in app/api/checkout/route.ts. */
export const SPONSOR_MAX_USD = 999;
```

> Using a `@/` import alias? Then `@/config/sponsors` maps to this file. If your
> project doesn't use the alias, change the imports below to a relative path like
> `../../config/sponsors`.

---

## Step 5 — The checkout API route

This is the whole backend. It reads `STRIPE_SECRET_KEY` **at request time** and
builds the price inline, so you never touch the Stripe dashboard and a missing key
never breaks your build. Create **`app/api/checkout/route.ts`**:

```ts
// app/api/checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Never statically render this route.
export const dynamic = "force-dynamic";

const MIN_AMOUNT = 100; // $1.00 in cents
const MAX_AMOUNT = 99900; // $999.00 — keep in sync with SPONSOR_MAX_USD

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 500 });
  }

  // Instantiate INSIDE the handler so a missing key can't break the build.
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json();
    const amount: unknown = body.amount; // integer cents
    const interval: unknown = body.interval ?? "once";
    const tierName: unknown = body.tier;

    if (interval !== "once" && interval !== "month") {
      return NextResponse.json({ error: "Invalid interval." }, { status: 400 });
    }
    if (!amount || typeof amount !== "number" || !Number.isInteger(amount) || amount < MIN_AMOUNT) {
      return NextResponse.json({ error: "Invalid amount. Minimum is $1.00." }, { status: 400 });
    }
    if (amount > MAX_AMOUNT) {
      return NextResponse.json({ error: "Maximum is $999." }, { status: 400 });
    }

    const recurring = interval === "month";

    // 👇 Change these two strings to your project's name.
    const label =
      typeof tierName === "string" && tierName.trim()
        ? `My Project — ${tierName.trim()} Sponsor`
        : recurring
          ? "My Project — Monthly Sponsor"
          : "Support My Project";

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "usd", // 👈 change currency here (e.g. "eur", "gbp")
            product_data: {
              name: label,
              description: recurring
                ? "Recurring sponsorship — cancel any time."
                : "Thank you for your support ☕",
            },
            unit_amount: amount,
            ...(recurring ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      // 👇 change these paths if your page lives somewhere else
      success_url: `${req.nextUrl.origin}/sponsor/success`,
      cancel_url: `${req.nextUrl.origin}/sponsor`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
```

**Why inline `price_data`?** Stripe lets you build a price on the fly instead of
creating Products/Prices in the dashboard. So changing a tier in
`config/sponsors.ts` needs zero dashboard work — the amount is passed straight
through.

---

## Step 6 — The page

The full interactive page. It's plain Tailwind with an **indigo** accent — do a
find-and-replace on `indigo` to use your brand color. Create
**`app/sponsor/page.tsx`**:

```tsx
// app/sponsor/page.tsx
"use client";

import { useState } from "react";
// Optional icons — delete this line and the <Icon /> tags if you skip lucide-react.
import { Check, Coffee, Heart, Loader2, Star } from "lucide-react";
import {
  SPONSOR_TIERS,
  ONE_TIME_AMOUNTS,
  SPONSOR_MAX_USD,
  type SponsorTierId,
  type SponsorInterval,
} from "@/config/sponsors";

// tiny classnames helper so there are no extra dependencies
const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

export default function SponsorPage() {
  const [interval, setInterval] = useState<SponsorInterval>("once");
  const [tierId, setTierId] = useState<SponsorTierId>("sponsor");
  const [oneTime, setOneTime] = useState<number>(5);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedTier = SPONSOR_TIERS.find((t) => t.id === tierId)!;
  const amountUsd =
    interval === "month" ? selectedTier.price : isCustom ? parseFloat(customAmount) : oneTime;

  async function checkout() {
    setError("");

    if (interval === "once" && isCustom) {
      const parsed = parseFloat(customAmount);
      if (!customAmount || isNaN(parsed) || parsed < 1) {
        setError("Please enter a valid amount ($1 minimum).");
        return;
      }
      if (parsed > SPONSOR_MAX_USD) {
        setError(`Maximum is $${SPONSOR_MAX_USD}.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(amountUsd * 100), // dollars → cents
          interval,
          tier: interval === "month" ? selectedTier.name : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }
      window.location.href = data.url; // redirect to Stripe
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const cardBase = "rounded-xl border p-5 text-left transition-all";
  const cardSel = "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500";
  const cardIdle = "border-gray-200 bg-white hover:border-gray-300";

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-gray-500">
          <Coffee className="h-3.5 w-3.5 text-indigo-600" />
          Support the project
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Buy me a coffee.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">
          A one-time tip or a monthly sponsorship keeps this project alive and free
          for everyone. Thank you 🙏
        </p>
      </div>

      {/* Interval toggle */}
      <div className="mt-12 flex justify-center">
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
          {([
            { id: "once", label: "One-time" },
            { id: "month", label: "Monthly" },
          ] as const).map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setInterval(opt.id);
                setError("");
              }}
              className={cx(
                "rounded-full px-6 py-2 text-sm font-semibold transition-all",
                interval === opt.id ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="mt-10">
        {interval === "month" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {SPONSOR_TIERS.map((tier) => {
              const selected = tierId === tier.id;
              return (
                <button
                  key={tier.id}
                  onClick={() => {
                    setTierId(tier.id as SponsorTierId);
                    setError("");
                  }}
                  className={cx(cardBase, "relative flex flex-col", selected ? cardSel : cardIdle)}
                >
                  {tier.featured && (
                    <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700">
                      <Star className="h-2.5 w-2.5 fill-current" /> Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">${tier.price}</span>
                    <span className="text-sm text-gray-500">/month</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-gray-500">{tier.blurb}</p>
                  <ul className="mt-4 flex-1 space-y-2 border-t border-gray-100 pt-4">
                    {tier.perks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-600" />
                        <span className="text-xs text-gray-600">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <span
                    className={cx(
                      "mt-5 block rounded-full py-2 text-center text-sm font-semibold",
                      selected ? "bg-indigo-600 text-white" : "border border-gray-300 text-gray-900",
                    )}
                  >
                    {selected ? "Selected" : "Select"}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-xl">
            <div className="mb-4 grid grid-cols-3 gap-3">
              {ONE_TIME_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setOneTime(amount);
                    setIsCustom(false);
                    setError("");
                  }}
                  className={cx(cardBase, "text-center", !isCustom && oneTime === amount ? cardSel : cardIdle)}
                >
                  <Coffee className="mx-auto mb-1.5 h-4 w-4 text-indigo-600" />
                  <span className="text-2xl font-bold text-gray-900">${amount}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setIsCustom(true);
                setError("");
              }}
              className={cx(cardBase, "w-full", isCustom ? cardSel : cardIdle)}
            >
              <span className="text-sm font-semibold text-gray-900">Custom amount</span>
              {isCustom && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-400">$</span>
                  <input
                    type="number"
                    min="1"
                    max={SPONSOR_MAX_USD}
                    step="1"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                    className="h-10 w-full rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Checkout */}
      <div className="mx-auto mt-10 max-w-xl">
        {error && <p className="mb-4 text-center text-sm text-red-600">{error}</p>}
        <button
          onClick={checkout}
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-indigo-600 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to Stripe…
            </>
          ) : (
            <>
              <Heart className="h-4 w-4" />
              {interval === "month"
                ? `Sponsor $${selectedTier.price}/month`
                : `Send $${isCustom && customAmount ? customAmount : oneTime}`}
            </>
          )}
        </button>
        <p className="mt-4 text-center text-xs text-gray-400">
          Payments processed securely by Stripe — no card details touch this site.
        </p>
      </div>
    </main>
  );
}
```

---

## Step 7 — The success page

Where Stripe redirects after a successful payment. Create
**`app/sponsor/success/page.tsx`**:

```tsx
// app/sponsor/success/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Thank you!",
  robots: { index: false, follow: false },
};

export default function SponsorSuccessPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 grid h-16 w-16 place-items-center rounded-full bg-indigo-100 text-3xl">
        ❤️
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Thank you!</h1>
      <p className="mt-4 text-lg leading-relaxed text-gray-600">
        Your support means a lot. A receipt is on its way to your email from Stripe.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-indigo-600 px-7 font-semibold text-white transition hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </main>
  );
}
```

---

## Step 8 — Link to the page

Add a link wherever you want it — nav, footer, a "Support" button:

```tsx
<Link href="/sponsor">Buy me a coffee ☕</Link>
```

---

## Step 9 — Test it (no real money)

1. Make sure `STRIPE_SECRET_KEY` is your **test** key (`sk_test_…`).
2. Run your app and open `/sponsor`.
3. Pick an amount and click the button — you'll land on Stripe Checkout.
4. Pay with a **Stripe test card**:
   - Card number: `4242 4242 4242 4242`
   - Expiry: any future date · CVC: any 3 digits · ZIP: any
5. You should be redirected to `/sponsor/success`, and the payment appears in your
   [Stripe test dashboard](https://dashboard.stripe.com/test/payments).

More test cards (declines, 3D-Secure, etc.):
<https://stripe.com/docs/testing>.

---

## Step 10 — Go live

1. In the Stripe dashboard, toggle to **live mode** and copy the `sk_live_…` key.
2. Set `STRIPE_SECRET_KEY` to the live key in your host's env vars
   (Vercel → Settings → Environment Variables → Production), then **redeploy**.
3. Do one small **real** payment ($1) to confirm, then refund it from the
   dashboard if you like.

That's it — no other setup. Stripe emails receipts automatically and handles
subscription management on its side.

---

## Customization

| Want to… | Do this |
|---|---|
| **Change the accent color** | Find-and-replace `indigo` in the page/success snippets with your Tailwind color (e.g. `emerald`, `rose`). |
| **Change tiers / prices / perks** | Edit `SPONSOR_TIERS` in `config/sponsors.ts`. |
| **Change one-time amounts** | Edit `ONE_TIME_AMOUNTS`. |
| **One-time only (no monthly)** | Remove the interval toggle and the `interval === "month"` branch in the page; the API route already handles one-time. |
| **Different currency** | Change `currency: "usd"` in the API route (e.g. `"eur"`). Update the `$` signs in the page. |
| **Raise the max** | Change `SPONSOR_MAX_USD` (config) **and** `MAX_AMOUNT` (API route) together. |
| **Collect a message from the sponsor** | Add `custom_fields` to `stripe.checkout.sessions.create`. See Stripe docs. |

---

## How it works (behind the scenes)

1. The visitor picks an amount → the page POSTs `{ amount, interval, tier }` to
   `/api/checkout`.
2. The route validates the input and asks Stripe to create a **Checkout Session**
   with an inline price. Stripe returns a hosted URL.
3. The page redirects the browser to that URL. The visitor pays on **Stripe's**
   page (PCI-compliant — no card data touches your server).
4. Stripe redirects back to `success_url` on success, or `cancel_url` if they back
   out. Stripe emails the receipt.

For **monthly** plans, Stripe creates a subscription the sponsor can cancel from
their receipt/portal. You don't manage any of that.

---

## Optional — record who sponsored you (webhook)

The steps above are complete for taking payments. If you also want to **store**
each sponsor (e.g. to show a sponsors list), add a webhook. This needs a second
env var, `STRIPE_WEBHOOK_SECRET`.

Create **`app/api/stripe-webhook/route.ts`**:

```ts
// app/api/stripe-webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!secret || !key) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const stripe = new Stripe(key);
  const sig = req.headers.get("stripe-signature");
  const body = await req.text(); // RAW body — required for signature verification

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, secret);
  } catch (err) {
    return NextResponse.json({ error: `Bad signature: ${(err as Error).message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // 👉 record the sponsor: session.customer_details?.email, session.amount_total, etc.
    console.log("New sponsor:", session.customer_details?.email, session.amount_total);
  }

  return NextResponse.json({ received: true });
}
```

Then:

1. In the Stripe dashboard → **Developers → Webhooks → Add endpoint**, point it at
   `https://yourdomain.com/api/stripe-webhook` and subscribe to
   `checkout.session.completed`.
2. Copy the endpoint's **Signing secret** (`whsec_…`) into
   `STRIPE_WEBHOOK_SECRET`.
3. Test locally with the Stripe CLI:
   `stripe listen --forward-to localhost:3000/api/stripe-webhook`.

> The webhook is **optional**. Skip this whole section if you just want to take
> payments.

---

## Troubleshooting

- **`/api/checkout` returns 500 "Payments aren't configured yet."** →
  `STRIPE_SECRET_KEY` isn't set in that environment. Add it and restart / redeploy.
- **Button does nothing / network error** → open the browser dev-tools Network
  tab, click the button, inspect the `/api/checkout` response for the error message.
- **"No such price" or product errors** → you shouldn't hit these; this guide uses
  inline `price_data`, not dashboard Prices.
- **Subscription mode fails** → make sure your Stripe account has completed
  activation; brand-new accounts can take a few minutes.
- **Amounts look wrong** → Stripe works in the **smallest currency unit** (cents).
  The page multiplies dollars by 100 before sending; don't double-convert.

---

## Security checklist

- ✅ `STRIPE_SECRET_KEY` is server-only (in the route, never in client code, never
  `NEXT_PUBLIC_`).
- ✅ The amount is validated **server-side** (min/max), not just in the browser.
- ✅ Stripe is created **inside** the handler, so a missing key never breaks the
  build — only a live request returns a clean 500.
- ✅ `.env.local` is git-ignored; only placeholders live in `.env.example`.
- ✅ No card data ever touches your server — Stripe's hosted checkout handles it.

---

*A single Stripe secret key is all you need. Copy these five files, set the key,
and you have a working sponsorship page on any Next.js App Router site.*
