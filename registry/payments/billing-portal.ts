import Stripe from "stripe";

/**
 * One-line helper to bounce a user into Stripe's hosted Customer Portal
 * — they manage subscriptions, payment methods, and download invoices
 * without your app having to build any billing UI.
 *
 *   // Server action / API route:
 *   const url = await createBillingPortalSession(user.stripeCustomerId, {
 *     returnUrl: `${env.NEXT_PUBLIC_APP_URL}/settings/billing`,
 *   });
 *   return NextResponse.redirect(url);
 *
 * Configure the portal once in the Stripe dashboard
 * (https://dashboard.stripe.com/settings/billing/portal) — what plans
 * users can switch to, whether they can cancel, etc.
 */

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("billing-portal: STRIPE_SECRET_KEY must be set");
  _stripe = new Stripe(key);
  return _stripe;
}

interface CreateBillingPortalOptions {
  /** Where Stripe sends the user after they're done (or hit "Return"). */
  returnUrl: string;
  /** Optional Stripe portal configuration id (advanced — most apps leave undefined). */
  configurationId?: string;
  /** Optional locale override (e.g. "fr", "es", "auto"). */
  locale?: Stripe.BillingPortal.SessionCreateParams.Locale;
  /** Optional pre-set flow (subscription update, cancel, payment method update, etc.). */
  flowData?: Stripe.BillingPortal.SessionCreateParams.FlowData;
}

/**
 * Create a Customer Portal session and return its hosted URL. Throws if
 * `stripeCustomerId` doesn't exist in Stripe.
 */
export async function createBillingPortalSession(
  stripeCustomerId: string,
  options: CreateBillingPortalOptions,
): Promise<string> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: options.returnUrl,
    configuration: options.configurationId,
    locale: options.locale,
    flow_data: options.flowData,
  });
  return session.url;
}

/**
 * Convenience route-handler factory:
 *
 *   // app/api/billing/portal/route.ts
 *   import { defineBillingPortalRoute } from "@/lib/billing-portal";
 *   export const POST = defineBillingPortalRoute({
 *     loadCustomerId: async (req) => {
 *       const user = await requireAuth();
 *       const sub = await db.subscription.findUnique({ where: { userId: user.id } });
 *       return sub?.stripeCustomerId ?? null;
 *     },
 *     returnUrl: (req) => `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
 *   });
 */
import { NextResponse } from "next/server";

interface DefineBillingPortalOptions {
  loadCustomerId: (req: Request) => Promise<string | null>;
  returnUrl: string | ((req: Request) => string);
}

export function defineBillingPortalRoute(options: DefineBillingPortalOptions) {
  return async function POST(req: Request): Promise<NextResponse> {
    const customerId = await options.loadCustomerId(req);
    if (!customerId) {
      return NextResponse.json(
        { error: "No Stripe customer linked to this account" },
        { status: 404 },
      );
    }

    const returnUrl =
      typeof options.returnUrl === "function" ? options.returnUrl(req) : options.returnUrl;

    const url = await createBillingPortalSession(customerId, { returnUrl });
    return NextResponse.json({ url });
  };
}
