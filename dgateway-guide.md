# DGateway Guide — Mobile Money + Card Checkout for African Markets

> Stripe is unavailable to most African buyers; mobile money (MTN, Airtel, M-Pesa) is the default payment method across East and West Africa. **DGateway** ([dgateway.desispay.com](https://dgateway.desispay.com)) is the canonical aggregator — one API to collect from mobile money wallets AND card networks (via Stripe under the hood).
>
> This guide is the framework's reference for wiring DGateway end-to-end. Follow it exactly — it bakes in the gotchas we hit shipping real products.

---

## When to use DGateway vs Stripe

| Market | Use |
|---|---|
| US / EU / global SaaS | **Stripe** — install JB Stripe UI |
| East / West Africa, Kenya, Uganda, Nigeria, Ghana, Tanzania, Rwanda | **DGateway** — install JB DGateway Shop |
| Multi-region (global + Africa) | **Both** — DGateway routes card payments through Stripe internally, so install DGateway as the unified entrypoint |

If the project's `project-description.md` → Integrations → Payments says "Mobile Money" or names a UGX / KES / NGN / GHS market, default to DGateway.

---

## What ships in the box

The framework already ships:

- **JB DGateway Shop** component (`pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/dgateway-shop.json`) — product catalog at `/shop`, cart drawer, checkout flow, Mobile Money + Stripe card payments, real-time status polling.

This guide covers the patterns to extend that — custom checkout flows, subscription-style billing, gating with DGateway, and the gotchas.

---

## Environment variables

```bash
# .env.local
DGATEWAY_API_URL="https://dgatewayapi.desispay.com"
DGATEWAY_API_KEY="dgw_test_..."   # Test keys start with dgw_test_, live with dgw_live_
NEXT_PUBLIC_DGATEWAY_PUBLIC_KEY="" # Optional — only if using the JS widget client-side
```

**Get the keys:** Sign up at [dgateway.desispay.com](https://dgateway.desispay.com), create an app, copy the API key from the dashboard.

---

## Gotchas (read first, save hours)

These are real bugs the framework has hit shipping with DGateway. Bake the workarounds in from the start.

### 1. `phone_number` is required on every collect call, even for card

Even when you're collecting via the Stripe card provider (no Mobile Money involved), DGateway requires a `phone_number` field on the collect request. If you omit it, you get a 400 with no useful error.

**Workaround:** for card-only flows, pass `phone_number: "0000000000"`. DGateway treats that as a placeholder and proceeds.

### 2. Test phone numbers fail on live keys

DGateway has a small set of test phone numbers (e.g. `256700000000`) that succeed against `dgw_test_*` keys but return `TEST_NUMBER_ON_LIVE_KEY` against `dgw_live_*`. Forgetting to swap to a real number when switching to live keys is a common 30-min debug.

**Workaround:** In `process.env.NODE_ENV === "production"`, validate that no `256700000000` test numbers slip through. Add a runtime check.

### 3. Response shape inconsistency: `client_secret` vs `clientSecret`

DGateway's `/collect` response sometimes returns `client_secret` (snake_case) and sometimes `clientSecret` (camelCase) depending on the underlying provider it routes to. Parse defensively.

```ts
const clientSecret = response.client_secret ?? response.clientSecret;
```

### 4. Collect → poll-status flow needs a 5-minute timeout

Mobile money collections can take 30–120 seconds (the user has to approve a USSD prompt on their phone). DGateway returns immediately with a `transaction_id` and you poll `/status` until it resolves.

**Rule:** cap the polling loop at 5 minutes (300s). After that, surface a "still waiting — check your phone or try again" state.

```ts
const MAX_POLL_MS = 5 * 60 * 1000;
const POLL_INTERVAL_MS = 3000;
const startedAt = Date.now();

while (Date.now() - startedAt < MAX_POLL_MS) {
  const status = await verifyTransaction(transactionId);
  if (status.state === "SUCCESS") return status;
  if (status.state === "FAILED") throw new Error(status.reason);
  await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
}
throw new Error("DGATEWAY_POLL_TIMEOUT");
```

### 5. Currency precision: UGX is stored as integer, USD as cents

DGateway stores UGX amounts as integer shillings (3000 → 3000), but USD as cents (3.00 → 300). Mixing them up under-charges or over-charges by 100x.

**Rule:** Always derive the amount from the product price + currency at server-side time. Never trust the client.

---

## The DGateway client (`src/lib/dgateway.ts`)

This is the canonical client. Drop it in `src/lib/dgateway.ts` and import everywhere.

```ts
const API_URL = process.env.DGATEWAY_API_URL!;
const API_KEY = process.env.DGATEWAY_API_KEY!;

if (!API_URL || !API_KEY) {
  throw new Error("DGATEWAY_API_URL and DGATEWAY_API_KEY must be set");
}

export type DGatewayCurrency = "UGX" | "USD" | "KES" | "NGN" | "GHS" | "TZS" | "RWF";
export type DGatewayProvider = "mobile_money" | "stripe";

export interface CollectPaymentInput {
  amount: number;
  currency: DGatewayCurrency;
  provider: DGatewayProvider;
  /** Required even for card. Pass "0000000000" if no real number. */
  phone_number: string;
  /** Optional — your internal order/invoice id. Surfaced in webhooks. */
  reference?: string;
  metadata?: Record<string, string>;
}

export interface CollectPaymentResult {
  transaction_id: string;
  state: "PENDING" | "SUCCESS" | "FAILED";
  client_secret?: string;
  clientSecret?: string;
  reason?: string;
}

export async function collectPayment(input: CollectPaymentInput): Promise<CollectPaymentResult> {
  // Production guard: reject the well-known test number
  if (process.env.NODE_ENV === "production" && input.phone_number === "256700000000") {
    throw new Error("Test phone number used on live keys");
  }

  const res = await fetch(`${API_URL}/collect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DGateway collect failed (${res.status}): ${body}`);
  }

  return res.json();
}

export async function verifyTransaction(transactionId: string): Promise<CollectPaymentResult> {
  const res = await fetch(`${API_URL}/status/${transactionId}`, {
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`DGateway status failed (${res.status}): ${body}`);
  }

  const data = await res.json();
  return {
    ...data,
    client_secret: data.client_secret ?? data.clientSecret,
  };
}
```

---

## Checkout API routes

The framework pattern: client posts to `/api/checkout/start`, gets a `transaction_id`, then polls `/api/checkout/status?id=...` until success/fail.

### `src/app/api/checkout/start/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { collectPayment } from "@/lib/dgateway";
import { auth } from "@/lib/auth"; // Better Auth

const BodySchema = z.object({
  productId: z.string(),
  provider: z.enum(["mobile_money", "stripe"]),
  phoneNumber: z.string().optional(), // omitted for card → defaulted below
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = BodySchema.parse(await req.json());

  // Always derive amount + currency from the DB, never trust the client
  const product = await db.product.findUniqueOrThrow({ where: { id: body.productId } });

  // Card flows need a placeholder phone number (DGateway requires the field)
  const phoneNumber =
    body.provider === "stripe"
      ? "0000000000"
      : body.phoneNumber;

  if (body.provider === "mobile_money" && !phoneNumber) {
    return NextResponse.json({ error: "Phone number required for mobile money" }, { status: 400 });
  }

  const result = await collectPayment({
    amount: product.price,
    currency: product.currency as "UGX" | "USD",
    provider: body.provider,
    phone_number: phoneNumber!,
    reference: `order_${Date.now()}_${session.user.id}`,
    metadata: { userId: session.user.id, productId: product.id },
  });

  // Persist a Payment row immediately, even before the user pays.
  await db.payment.create({
    data: {
      transactionId: result.transaction_id,
      userId: session.user.id,
      productId: product.id,
      amount: product.price,
      currency: product.currency,
      provider: body.provider,
      state: "PENDING",
    },
  });

  return NextResponse.json({
    transaction_id: result.transaction_id,
    state: result.state,
    client_secret: result.client_secret ?? result.clientSecret,
  });
}
```

### `src/app/api/checkout/status/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyTransaction } from "@/lib/dgateway";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const dgw = await verifyTransaction(id);

  // Mirror the state back to our own DB so we don't have to hit DGateway again
  await db.payment.update({
    where: { transactionId: id },
    data: { state: dgw.state, reason: dgw.reason },
  });

  return NextResponse.json(dgw);
}
```

---

## Client polling state machine

```tsx
"use client";
import { useEffect, useState } from "react";

type State = "idle" | "pending" | "success" | "failed" | "timeout";

export function useCheckoutStatus(transactionId: string | null) {
  const [state, setState] = useState<State>("idle");
  const [reason, setReason] = useState<string | null>(null);

  useEffect(() => {
    if (!transactionId) return;
    setState("pending");

    const startedAt = Date.now();
    const MAX_MS = 5 * 60 * 1000;
    const INTERVAL_MS = 3000;

    let cancelled = false;

    async function tick() {
      if (cancelled) return;
      if (Date.now() - startedAt > MAX_MS) {
        setState("timeout");
        return;
      }
      const res = await fetch(`/api/checkout/status?id=${transactionId}`);
      const data = await res.json();
      if (data.state === "SUCCESS") setState("success");
      else if (data.state === "FAILED") {
        setReason(data.reason ?? null);
        setState("failed");
      } else {
        setTimeout(tick, INTERVAL_MS);
      }
    }

    tick();
    return () => { cancelled = true; };
  }, [transactionId]);

  return { state, reason };
}
```

---

## Test credentials

| Currency | Provider | Phone number | Result |
|---|---|---|---|
| UGX | MTN | `256770000000` | Success |
| UGX | MTN | `256770000001` | Insufficient funds |
| UGX | Airtel | `256750000000` | Success |
| UGX | Airtel | `256750000001` | Timeout |
| USD | Stripe | (use `4242 4242 4242 4242`) | Success |
| USD | Stripe | (use `4000 0000 0000 9995`) | Insufficient funds |

⚠ All `dgw_test_*` only. Live keys reject test numbers with `TEST_NUMBER_ON_LIVE_KEY`.

---

## Prisma schema for payments

```prisma
model Payment {
  id            String   @id @default(cuid())
  transactionId String   @unique
  userId        String
  productId     String
  amount        Int
  currency      String   // "UGX" | "USD" | ...
  provider      String   // "mobile_money" | "stripe"
  state         String   @default("PENDING") // "PENDING" | "SUCCESS" | "FAILED"
  reason        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  product Product @relation(fields: [productId], references: [id])

  @@index([userId])
  @@index([state])
}
```

---

## Subscriptions on DGateway

DGateway does NOT yet ship recurring/subscription primitives. For subscription products:

1. Use DGateway for the **first** payment as a one-time collect.
2. Save the `state: "SUCCESS"` and grant access for the subscription period (e.g. 30 days).
3. Use a cron / scheduled job (`Vercel Cron` or `Upstash QStash`) to enqueue renewal collects N days before expiry.
4. On renewal failure, downgrade the user with a 3-day grace period.

This is more work than Stripe Subscriptions, but it's the only path on mobile money today.

---

## Reference

- **Skill:** [dgateway.desispay.com/skill/SKILL.md](https://dgateway.desispay.com/skill/SKILL.md) — paste into your coding agent for one-shot DGateway integration
- **Dashboard:** [dgateway.desispay.com](https://dgateway.desispay.com)
- **Component:** [`jb-components.md` → DGateway Shop](./jb-components.md)
- **Test credentials:** above table

---

_Last updated: 2026-05-14_
