import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * Sponsorship / "buy me a coffee" checkout.
 *
 *   - one-time  → Stripe `mode: 'payment'`
 *   - monthly   → Stripe `mode: 'subscription'`
 *
 * Prices are built inline with `price_data` rather than pre-created Stripe
 * Prices, so changing the ladder in config/sponsors.ts needs no dashboard work.
 * Stripe is instantiated INSIDE the handler so a missing key never breaks the
 * build - only a live request returns a graceful 500.
 */

export const dynamic = "force-dynamic";

const MIN_AMOUNT = 100; // $1.00
const MAX_AMOUNT = 99900; // $999.00 - mirrors SPONSOR_MAX_USD

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Sponsorship isn't configured yet." }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.json();
    const amount: unknown = body.amount;
    const interval: unknown = body.interval ?? "once";
    const tierName: unknown = body.tier;

    if (interval !== "once" && interval !== "month") {
      return NextResponse.json(
        { error: "Invalid interval. Expected 'once' or 'month'." },
        { status: 400 },
      );
    }

    if (!amount || typeof amount !== "number" || !Number.isInteger(amount) || amount < MIN_AMOUNT) {
      return NextResponse.json({ error: "Invalid amount. Minimum is $1.00." }, { status: 400 });
    }

    if (amount > MAX_AMOUNT) {
      return NextResponse.json(
        { error: "Maximum is $999. Get in touch for larger sponsorships." },
        { status: 400 },
      );
    }

    const recurring = interval === "month";
    const label =
      typeof tierName === "string" && tierName.trim()
        ? `VibeKit ${tierName.trim()} Sponsor`
        : recurring
          ? "VibeKit Monthly Sponsor"
          : "Support VibeKit";

    const session = await stripe.checkout.sessions.create({
      mode: recurring ? "subscription" : "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: label,
              description: recurring
                ? "Recurring sponsorship - cancel any time."
                : "Thank you for supporting VibeKit ☕",
            },
            unit_amount: amount,
            ...(recurring ? { recurring: { interval: "month" as const } } : {}),
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "auto",
      success_url: `${req.nextUrl.origin}/sponsor/success`,
      cancel_url: `${req.nextUrl.origin}/sponsor`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
