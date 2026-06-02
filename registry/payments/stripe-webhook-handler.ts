import Stripe from "stripe";
import { NextResponse } from "next/server";

/**
 * Typed Stripe webhook router. Bundles the four things every Stripe
 * webhook route needs:
 *
 *   1. Read RAW body (`req.text()` — NOT `req.json()`; signature
 *      verification needs the unparsed bytes)
 *   2. Verify the signature via `stripe.webhooks.constructEvent`
 *   3. Dispatch to a typed handler keyed by event type
 *   4. Idempotency check (skip events whose id is already in the DB)
 *
 *   // lib/stripe.ts
 *   import { defineStripeWebhookHandler } from "@/lib/stripe-webhook-handler";
 *   import { db } from "@/lib/db";
 *
 *   export const POST = defineStripeWebhookHandler({
 *     handlers: {
 *       "checkout.session.completed": async (event) => {
 *         const session = event.data.object;
 *         // ...
 *       },
 *       "invoice.payment_failed": async (event) => { ... },
 *       "customer.subscription.deleted": async (event) => { ... },
 *     },
 *     isProcessed: (id) => db.stripeEvent.findUnique({ where: { id } }).then(Boolean),
 *     markProcessed: (id, type) => db.stripeEvent.create({ data: { id, type } }),
 *   });
 *
 *   // app/api/webhooks/stripe/route.ts
 *   export { POST } from "@/lib/stripe.ts";
 *
 * Required env:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *
 * Required Prisma schema (or your own equivalent storage for idempotency):
 *
 *   model StripeEvent {
 *     id        String   @id
 *     type      String
 *     createdAt DateTime @default(now())
 *   }
 */

type EventTypeMap = Stripe.Event["type"];

type Handler<T extends Stripe.Event = Stripe.Event> = (event: T) => Promise<void> | void;

interface DefineStripeWebhookOptions {
  /** Map of event-type → handler. Unhandled types are ignored (return 200). */
  handlers: Partial<Record<EventTypeMap, Handler>>;
  /** Check if we've already processed this event id. */
  isProcessed: (eventId: string) => Promise<boolean>;
  /** Persist that this event id has been processed (must be idempotent itself). */
  markProcessed: (eventId: string, type: string) => Promise<void> | void;
  /** Override Stripe SDK options (apiVersion, etc.). */
  stripeOptions?: Stripe.StripeConfig;
}

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("stripe-webhook-handler: STRIPE_SECRET_KEY must be set");
  _stripe = new Stripe(key);
  return _stripe;
}

/**
 * Build the POST handler for `app/api/webhooks/stripe/route.ts`.
 * Returns a (req: Request) => Promise<NextResponse> function.
 */
export function defineStripeWebhookHandler(options: DefineStripeWebhookOptions) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("stripe-webhook-handler: STRIPE_WEBHOOK_SECRET must be set");
  }
  if (options.stripeOptions) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", options.stripeOptions);
  }

  return async function POST(req: Request): Promise<NextResponse> {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;
    try {
      event = getStripe().webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${(err as Error).message}` },
        { status: 400 },
      );
    }

    // Idempotency — skip events we've already processed
    if (await options.isProcessed(event.id)) {
      return NextResponse.json({ received: true, replay: true });
    }

    const handler = options.handlers[event.type];
    if (handler) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[stripe-webhook:${event.type}]`, err);
        // 500 → Stripe will retry. Don't markProcessed.
        return NextResponse.json(
          { error: `Handler failed: ${(err as Error).message}` },
          { status: 500 },
        );
      }
    }

    await options.markProcessed(event.id, event.type);
    return NextResponse.json({ received: true });
  };
}
