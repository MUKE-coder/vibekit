# Monetization Guide — Stripe & Billing

> How to turn the app you built into the app that pays you.

---

## Table of Contents
1. [Choosing a Pricing Model](#pricing-models)
2. [Setting Up Stripe](#setting-up-stripe)
3. [Creating Products and Prices](#creating-products)
4. [Integrating Stripe in Your App](#integrating-stripe)
5. [Stripe Webhooks — The Critical Piece](#webhooks)
6. [Feature Gating — Locking Features Behind Plans](#feature-gating)
7. [Billing Management Page](#billing-management)
8. [Going from Test to Live Mode](#test-to-live)
9. [Common Stripe Errors](#common-errors)

---

## Choosing a Pricing Model {#pricing-models}

### The Three Models

| Model | Best For | Example |
|---|---|---|
| **One-Time Payment** | Tools, templates, one-off products | "Buy this app template for $49" |
| **Subscription** | SaaS, ongoing value, recurring revenue | "$19/month for Pro access" |
| **Usage-Based** | APIs, AI credits, consumption products | "$0.01 per API call" |

**For most vibe-coded SaaS apps, subscriptions are the right choice.** They create predictable recurring revenue and are well-supported by Stripe and the JB Stripe UI component.

### Recommended Pricing Structure

For a B2B SaaS app, use this as a starting point:

```
FREE plan:    Core features, limited usage (e.g. 3 projects, no team features)
PRO plan:     $19–$29/month — all features, reasonable limits
TEAM plan:    $79–$99/month — everything in Pro plus team members and admin features
```

**Do not have more than 3 tiers.** More tiers cause confusion and reduce conversions.

---

## Setting Up Stripe {#setting-up-stripe}

### Step 1 — Create Account
1. Go to [stripe.com](https://stripe.com) and sign up
2. Complete identity verification (required for live payments)
3. Make sure you start in **Test Mode** (toggle in the top header)

### Step 2 — Get API Keys
1. Go to **Developers → API Keys**
2. Copy your Publishable Key (starts with `pk_test_`)
3. Click "Reveal" and copy your Secret Key (starts with `sk_test_`)
4. Add both to your `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

---

## Creating Products and Prices {#creating-products}

### In the Stripe Dashboard (Do This Manually)

1. Go to **Products → Add Product**
2. Add your products:

**Example for a PRO plan:**
- Name: `Pro Plan`
- Description: `All features, unlimited projects, priority support`
- Pricing:
  - Type: Recurring
  - Amount: $19.00
  - Billing period: Monthly
  - Currency: USD
3. Click **Save Product**
4. Copy the **Price ID** (starts with `price_`) — you will need this in your code

**Example for annual pricing:**
Add a second price to the same product:
- Amount: $190.00 (saves 2 months = 17% discount)
- Billing period: Yearly

### Prompt for Lovable

```
Add these Stripe Price IDs to the project configuration:

PRO_MONTHLY_PRICE_ID = price_xxx
PRO_YEARLY_PRICE_ID  = price_xxx
TEAM_MONTHLY_PRICE_ID = price_xxx

Create a constants file at lib/stripe-plans.ts with these values and the plan details 
(name, description, features list, price display).
```

---

## Integrating Stripe in Your App {#integrating-stripe}

### Install the JB Stripe UI Component

```
pnpm dlx shadcn@latest init
```

Then follow the Stripe UI setup guide included in the component.

Alternatively, use Lovable with this prompt:

```
Install the Stripe package: pnpm add stripe @stripe/stripe-js @stripe/react-stripe-js

Create a Stripe client at lib/stripe.ts that:
- Exports a server-side Stripe instance using STRIPE_SECRET_KEY
- Exports a client-side Stripe promise using NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

Create a checkout API route at app/api/checkout/route.ts that:
- Requires authentication (return 401 if no session)
- Accepts a priceId in the request body
- Creates a Stripe Checkout Session with:
  - mode: 'subscription'
  - success_url: [app url]/dashboard?success=true
  - cancel_url: [app url]/pricing
  - customer_email: user's email from session
  - metadata: { userId: user's ID }
- Returns the session URL

Create a /pricing page that:
- Displays the FREE, PRO, and TEAM plans from lib/stripe-plans.ts
- Shows features for each plan
- Has a "Get Started" button for each paid plan that calls the checkout API
- Highlights the PRO plan as "Most Popular"
```

---

## Stripe Webhooks — The Critical Piece {#webhooks}

Webhooks are how Stripe tells your app that a payment succeeded or a subscription changed. **Without webhooks, your app will never know when someone pays.**

### Why Webhooks Matter

The checkout flow goes like this:
1. User clicks "Upgrade to Pro"
2. User is redirected to Stripe's hosted checkout page
3. User enters card details and pays
4. **Stripe calls your webhook** with the payment success event
5. Your webhook updates the user's `plan` field to `PRO` in the database
6. User is redirected to your success URL

Steps 4–5 happen entirely outside the browser. If step 4 never reaches your app, the user paid but your database was never updated.

### Setting Up Webhooks

**For Local Development:**
1. Install Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. The CLI outputs a webhook secret starting with `whsec_` — add it to `.env.local`

**For Production:**
1. Stripe Dashboard → Developers → Webhooks → Add Endpoint
2. URL: `https://yourdomain.com/api/webhooks/stripe`
3. Events to select:
   - `checkout.session.completed` — when a payment is made
   - `customer.subscription.updated` — when a subscription changes
   - `customer.subscription.deleted` — when a subscription is cancelled
   - `invoice.payment_failed` — when a renewal fails
4. Copy the Signing Secret and add to Vercel env vars

### Prompt for Lovable

```
Create a Stripe webhook handler at app/api/webhooks/stripe/route.ts that:

1. Verifies the webhook signature using STRIPE_WEBHOOK_SECRET
2. Handles these events:

checkout.session.completed:
- Extract userId from session.metadata.userId
- Get the subscription from the session
- Update the user in the database:
  - stripeCustomerId = session.customer
  - subscriptionId = session.subscription
  - subscriptionStatus = 'active'
  - plan = 'PRO' (or determine from price ID)

customer.subscription.updated:
- Find user by stripeCustomerId
- Update subscriptionStatus to subscription.status
- Update plan if the price changed

customer.subscription.deleted:
- Find user by stripeCustomerId or subscriptionId
- Set subscriptionStatus = 'canceled'
- Set plan = 'FREE'

invoice.payment_failed:
- Find user by stripeCustomerId
- Set subscriptionStatus = 'past_due'

3. Return 200 for all handled events, 400 for invalid signatures
```

---

## Feature Gating {#feature-gating}

Feature gating means blocking certain features for users who are not on the right plan.

### Database Setup

Make sure your User model has plan and subscription fields:

```prisma
model User {
  // ... other fields
  plan               Plan    @default(FREE)
  subscriptionStatus String? // "active", "canceled", "past_due", null
  stripeCustomerId   String? @unique
  subscriptionId     String? @unique
}

enum Plan { FREE PRO TEAM }
```

### Gating in API Routes

```typescript
// In any API route that requires a paid plan:
const session = await auth.api.getSession({ headers: request.headers });
if (!session?.user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

const user = await prisma.user.findUnique({ where: { id: session.user.id } });
if (user?.plan === 'FREE') {
  return Response.json({ error: 'Upgrade to Pro to use this feature' }, { status: 403 });
}
```

### Gating in UI Components

```
Create a reusable component called ProGate at components/ProGate.tsx.

It accepts: children, featureName (string).

If the user's plan is FREE:
- Show an upgrade prompt card instead of the children
- The card says: "[featureName] is a Pro feature. Upgrade to unlock it."
- Include a button that links to /pricing

If the user's plan is PRO or TEAM:
- Render the children normally

Wrap the component with the user's plan from the session/auth context.
```

**Usage in pages:**
```tsx
<ProGate featureName="Advanced Analytics">
  <AnalyticsDashboard />
</ProGate>
```

### Free Plan Limits (Usage-Based Gating)

If your free plan has limits (e.g. "max 3 projects"):

```
In the POST /api/projects route, before creating a new project:
1. Count the user's existing projects: prisma.project.count({ where: { userId } })
2. If user.plan === 'FREE' and count >= 3:
   Return 403 with message: "Free plan is limited to 3 projects. Upgrade to Pro for unlimited projects."
3. Otherwise, proceed with creation
```

---

## Billing Management Page {#billing-management}

Every paying user needs a way to manage their subscription — upgrade, downgrade, cancel, and view invoices.

### Prompt for Lovable

```
Create a billing management page at /dashboard/billing.

The page should show:
1. Current plan name and status (active, canceled, past_due)
2. Next billing date (from Stripe)
3. Billing amount

Upgrade/Downgrade:
- If on FREE: show "Upgrade to Pro" button linking to /pricing
- If on PRO: show "Upgrade to Team" and "Cancel Subscription" options

Manage in Stripe:
Create an API route at /api/billing/portal that:
- Creates a Stripe Customer Portal session using STRIPE_SECRET_KEY
- Uses the user's stripeCustomerId
- Sets return_url to [app url]/dashboard/billing
- Returns the portal URL

The "Manage Billing" button on the page calls this route and redirects to the portal URL.
The Stripe Customer Portal allows users to update payment method, cancel, and see invoices.
```

---

## Going from Test to Live Mode {#test-to-live}

When you are ready to accept real payments:

### Step 1 — Switch to Live Mode in Stripe

1. In Stripe dashboard, toggle to **Live Mode**
2. Go to Developers → API Keys
3. Copy your **Live** publishable and secret keys

### Step 2 — Recreate Products in Live Mode

Products created in Test Mode do not exist in Live Mode. You must recreate them:
1. In Live Mode, go to Products → Add Product
2. Create the same plans as in Test Mode
3. Copy the new **live** Price IDs

### Step 3 — Create Live Webhook

1. Developers → Webhooks → Add Endpoint (in Live Mode)
2. Same URL and events as your test webhook
3. Copy the new signing secret

### Step 4 — Update Vercel Environment Variables

In Vercel, update your Production environment variables:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...  (live key)
STRIPE_SECRET_KEY = sk_live_...                    (live key)
STRIPE_WEBHOOK_SECRET = whsec_...                  (live webhook secret)
```

Keep Test keys in Preview and Development environments.

### Step 5 — Test with a Real Card

Make one real purchase with your own card to verify everything works end-to-end. Refund it immediately from the Stripe dashboard.

---

## Common Stripe Errors {#common-errors}

### `No such customer: cus_xxx`
The customer ID in your database does not match the Stripe customer. This happens if test data got mixed with live data.
Fix: Clear subscription data from your database and let users subscribe fresh.

### `Webhook signature verification failed`
The `STRIPE_WEBHOOK_SECRET` is wrong or the request body was modified before verification.
Fix: Make sure you are reading the raw request body in the webhook route, not the parsed JSON.

### `This account cannot currently make live charges`
Your Stripe account is not fully activated.
Fix: Complete all verification steps in Stripe → Settings → Account.

### Subscription updated in Stripe but not in database
The webhook is not firing or your webhook handler has an error.
Fix: Check Stripe → Developers → Webhooks → your endpoint → Recent deliveries. Look for failed events and check the error.

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
