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
 *   4. ATOMIC idempotency claim (skip events already claimed)
 *
 * Idempotency note: Stripe delivers at-least-once and retries. A
 * check-then-later-write pair leaves a window where two concurrent deliveries
 * of `checkout.session.completed` both pass the check and both grant the
 * subscription. `claimEvent` must therefore be a single atomic insert that
 * returns false when the row already exists — rely on the primary-key conflict,
 * not a prior read.
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
 *     // Atomic: the unique PK makes the second concurrent insert throw.
 *     claimEvent: async (id, type) => {
 *       try {
 *         await db.stripeEvent.create({ data: { id, type } });
 *         return true;            // we own this event
 *       } catch (e) {
 *         if ((e as { code?: string }).code === "P2002") return false; // already claimed
 *         throw e;
 *       }
 *     },
 *     // Called when the handler throws, so Stripe's retry can re-claim it.
 *     releaseEvent: (id) => db.stripeEvent.delete({ where: { id } }).catch(() => {}),
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
  /**
   * ATOMICALLY claim this event id. Returns true if this call won the claim,
   * false if the event was already claimed (i.e. a duplicate delivery).
   * Must be a single atomic operation — an insert relying on a unique
   * constraint, or Redis `SET NX`. A read-then-write pair reintroduces the race.
   */
  claimEvent: (eventId: string, type: string) => Promise<boolean>;
  /**
   * Optional: undo a claim when the handler throws, so Stripe's retry can
   * re-process the event. Without it a transient handler failure permanently
   * blocks that event.
   */
  releaseEvent?: (eventId: string) => Promise<void> | void;
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

    // Claim BEFORE running the handler. Two concurrent deliveries of the same
    // event race here, and exactly one wins; the loser returns 200 without
    // re-running the side effect.
    const won = await options.claimEvent(event.id, event.type);
    if (!won) {
      return NextResponse.json({ received: true, replay: true });
    }

    const handler = options.handlers[event.type];
    if (handler) {
      try {
        await handler(event);
      } catch (err) {
        console.error(`[stripe-webhook:${event.type}]`, err);
        // Release the claim so Stripe's retry can re-process this event.
        try {
          await options.releaseEvent?.(event.id);
        } catch (releaseErr) {
          console.error(`[stripe-webhook:release:${event.id}]`, releaseErr);
        }
        // 500 → Stripe will retry.
        return NextResponse.json(
          { error: `Handler failed: ${(err as Error).message}` },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ received: true });
  };
}
