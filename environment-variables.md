# Environment Variables Guide

> Environment variables are the secrets your app needs to connect to external services. This guide tells you exactly where to get each one, step by step.

---

## What Are Environment Variables?

Environment variables are private configuration values that your app reads at runtime. They are never stored in your code — they live in a `.env` file locally and in your deployment platform (Vercel) in production.

Think of them as a secure keychain: your app asks "what's the database password?" and the environment provides it — without the password ever being written in the code where someone could see it.

### The Two Files You Need

**`.env.local`** — local development secrets. Never commit this to GitHub.  
**`.env.example`** — a template with all variable names and descriptions, but no real values. Commit this to GitHub so other developers know what variables they need.

---

## Complete Variable Reference

### The Full `.env.example` Template

Copy this into your project's `.env.example`:

```env
# ─── DATABASE ─────────────────────────────────────────────────────────────────
DATABASE_URL=

# ─── AUTHENTICATION ───────────────────────────────────────────────────────────
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

# ─── GOOGLE OAUTH ─────────────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── GITHUB OAUTH (optional) ──────────────────────────────────────────────────
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# ─── EMAIL (RESEND) ───────────────────────────────────────────────────────────
RESEND_API_KEY=
RESEND_FROM=noreply@yourdomain.com

# ─── PAYMENTS (STRIPE) ────────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ─── FILE STORAGE (CLOUDFLARE R2) ─────────────────────────────────────────────
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
NEXT_PUBLIC_R2_PUBLIC_URL=

# ─── APP CONFIG ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## DATABASE_URL — Neon Postgres

### What It Is
The connection string your app uses to connect to your Postgres database hosted on Neon.

### How to Get It

1. Go to [neon.tech](https://neon.tech) and sign up (free)
2. Click **"Create Project"**
3. Give your project a name (e.g. your app name)
4. Choose your region (pick the closest to your users)
5. Click **"Create Project"**
6. On the dashboard, you will see a connection string. Click **"Show password"** to reveal it
7. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-example-12345.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### Development vs Production

Create **two Neon branches**:
- `main` — your production database
- `dev` — your development database (use Neon's branch feature)

**Never connect your local development to your production database.** In Neon, click **"Branches"** → **"Create Branch"** to create a `dev` branch with its own connection string.

Use the `dev` connection string in your `.env.local` and the `main` connection string in Vercel production environment variables.

### In `.env.local`
```env
DATABASE_URL=postgresql://username:password@ep-dev-12345.us-east-2.aws.neon.tech/dbname?sslmode=require
```

---

## BETTER_AUTH_SECRET

### What It Is
A random secret string that Better Auth uses to sign and verify session tokens. Think of it as the master password for your auth system.

### How to Get It

Generate a secure random string of at least 32 characters. Options:

**Option 1 — Online generator:**
Go to [randomkeygen.com](https://randomkeygen.com) and copy a "CodeIgniter Encryption Key" (64 characters)

**Option 2 — Use any random string that is at least 32 characters long**

Example (do not use this one — generate your own):
```
k9x2mP8vQnR4tY7wZ3aB6cD5eF1gH0iJ
```

### In `.env.local`
```env
BETTER_AUTH_SECRET=your-generated-32-plus-character-string-here
```

> ⚠️ Never share this value. Never commit it to GitHub. If it is ever exposed, regenerate it immediately (this will log out all users).

---

## BETTER_AUTH_URL

### What It Is
The base URL of your app. Better Auth uses this to construct callback URLs for OAuth and email links.

### Values by Environment

| Environment | Value |
|---|---|
| Local development | `http://localhost:3000` |
| Vercel preview | Your preview URL (or leave as production URL) |
| Production | `https://yourdomain.com` (no trailing slash) |

### In `.env.local`
```env
BETTER_AUTH_URL=http://localhost:3000
```

### In Vercel (Production)
```env
BETTER_AUTH_URL=https://yourdomain.com
```

---

## GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

### What They Are
Credentials from Google Cloud Console that allow your app to offer "Sign in with Google".

### How to Get Them

**Step 1 — Create a Google Cloud Project**
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click the project dropdown at the top → **"New Project"**
3. Give it a name (e.g. your app name)
4. Click **"Create"**

**Step 2 — Enable the Google+ API**
1. In your new project, go to **"APIs & Services"** → **"Enable APIs and Services"**
2. Search for **"Google+ API"** and enable it
3. Also enable **"Google Identity"** if available

**Step 3 — Configure the OAuth Consent Screen**
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** (for apps used by anyone) or **"Internal"** (for internal tools)
3. Fill in:
   - App name: your app name
   - User support email: your email
   - Developer contact: your email
4. Click **"Save and Continue"** through the remaining steps

**Step 4 — Create OAuth Credentials**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
3. Application type: **"Web application"**
4. Name: your app name
5. Under **"Authorized Redirect URIs"**, add:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Add your production URL too when you deploy:)
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
6. Click **"Create"**
7. Copy the **Client ID** and **Client Secret**

### In `.env.local`
```env
GOOGLE_CLIENT_ID=1234567890-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

---

## GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET

### What They Are
Credentials for "Sign in with GitHub" OAuth.

### How to Get Them

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in:
   - Application name: your app name
   - Homepage URL: `http://localhost:3000` (update after deployment)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy the secret

### In `.env.local`
```env
GITHUB_CLIENT_ID=Ov23liABC123XYZ
GITHUB_CLIENT_SECRET=abc123def456ghi789jkl012mno345pqr678stu
```

---

## RESEND_API_KEY

### What It Is
The API key that allows your app to send emails through Resend.

### How to Get It

1. Go to [resend.com](https://resend.com) and sign up
2. On the dashboard, click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Give it a name (e.g. your app name)
5. Set permission to **"Full Access"**
6. Set Domain to **"All Domains"** (or restrict to your domain)
7. Click **"Add"**
8. **Copy the key immediately** — it will only be shown once. It starts with `re_`

### In `.env.local`
```env
RESEND_API_KEY=re_abcdefghijklmnopqrstuvwxyz123456
RESEND_FROM=noreply@yourdomain.com
```

> For local development, you can use `onboarding@resend.dev` as the FROM address without domain verification. But in production you must use your own verified domain.

---

## Stripe Keys

### What They Are

Three separate Stripe credentials:

| Variable | Starts With | What It Is |
|---|---|---|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_` | Public key — safe to expose in browser |
| `STRIPE_SECRET_KEY` | `sk_` | Secret key — never expose, server-side only |
| `STRIPE_WEBHOOK_SECRET` | `whsec_` | Verifies webhook events are from Stripe |

### How to Get the API Keys

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign up
2. In the top right, make sure you are in **"Test mode"** (toggle visible in header)
3. Go to **"Developers"** → **"API Keys"**
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (click "Reveal" — starts with `sk_test_`)

### How to Get the Webhook Secret

The webhook secret is generated when you create a webhook endpoint.

**For local development (using Stripe CLI):**

1. Install the Stripe CLI: [stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. The CLI will output a webhook signing secret starting with `whsec_`

**For production:**

1. In Stripe dashboard, go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **"Add endpoint"**
6. Click on the new endpoint, then click **"Reveal"** under Signing Secret

### Test vs Live Keys

Stripe has two sets of keys: **Test** (for development) and **Live** (for production with real money).

| Key Set | Prefix | When to Use |
|---|---|---|
| Test | `pk_test_` / `sk_test_` | Always during development |
| Live | `pk_live_` / `sk_live_` | Production only, real payments |

In Vercel, set your **Production** environment to use **Live** keys and your **Preview/Development** environments to use **Test** keys.

### In `.env.local`
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Cloudflare R2 (File Storage)

### What It Is
Cloudflare R2 is object storage (like Amazon S3) for storing uploaded files: images, documents, videos, attachments. R2 is free for the first 10GB of storage and has no egress (download) fees.

### How to Get the Credentials

**Step 1 — Enable R2 on Your Cloudflare Account**
1. Go to [cloudflare.com/r2](https://cloudflare.com/r2) and sign in
2. In the left sidebar, click **"R2 Object Storage"**
3. Click **"Get Started"** and add a payment method (required but free tier available)

**Step 2 — Create a Bucket**
1. Click **"Create bucket"**
2. Give it a name (e.g. `myapp-uploads`)
3. Choose a region or leave as default
4. Click **"Create bucket"**

**Step 3 — Make the Bucket Publicly Accessible (for image display)**
1. Click on your bucket
2. Go to **"Settings"**
3. Under **"Public access"**, click **"Allow Access"** and enable **"R2.dev subdomain"**
4. Note the public URL (looks like `https://pub-abc123.r2.dev`)

**Step 4 — Create API Tokens**
1. In the R2 overview page, click **"Manage R2 API tokens"**
2. Click **"Create API Token"**
3. Give it a name (e.g. `myapp-token`)
4. Permissions: **"Object Read & Write"**
5. Specify bucket: select your bucket
6. Click **"Create API Token"**
7. Copy all three values shown:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (shown on the R2 overview page)

### In `.env.local`
```env
R2_ACCOUNT_ID=abc123def456
R2_ACCESS_KEY_ID=abc123
R2_SECRET_ACCESS_KEY=verylongsecretkey
R2_BUCKET_NAME=myapp-uploads
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-abc123.r2.dev
```

---

## NEXT_PUBLIC_APP_URL

### What It Is
The full URL of your app. Used for constructing absolute URLs in emails, OG tags, and other places.

### Values by Environment

```env
# Local development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Production (in Vercel)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## Setting Variables in Vercel

### Step-by-Step

1. Go to your Vercel project dashboard
2. Click **"Settings"** in the top navigation
3. Click **"Environment Variables"** in the left sidebar
4. For each variable:
   a. Type the variable **name** in the "Key" field
   b. Type or paste the **value** in the "Value" field
   c. Select which environments: check **Production**, **Preview**, and **Development**
   d. Click **"Save"**
5. After adding all variables, go to **"Deployments"** and click **"Redeploy"** on your latest deployment

### Important Rules

- No quotes around values — enter the raw value only
- `NEXT_PUBLIC_` prefix means the variable is exposed to the browser — use only for non-secret values
- After adding or changing any variable, you must redeploy for changes to take effect
- The `BETTER_AUTH_URL` must match your exact production domain

### How to Add Multiple Variables at Once

Instead of adding one by one, you can bulk-import:

1. Prepare a file with all variables in `KEY=VALUE` format (like your `.env.local`)
2. In Vercel → Settings → Environment Variables, click **"Import .env"**
3. Paste the contents or upload the file

---

## Security Rules — Never Break These

| Rule | Why |
|---|---|
| Never commit `.env.local` to GitHub | Exposes all your secrets publicly |
| Never put secrets in `NEXT_PUBLIC_` variables | These are exposed in the browser source code |
| Never hardcode API keys in your source code | Anyone who reads the code can steal them |
| Never share your Stripe secret key | Anyone with it can charge your customers |
| Never use the same secret across different apps | A breach in one app does not affect others |
| Rotate secrets immediately if exposed | Assume they are already compromised |

---

## Quick Reference Table

| Variable | Where to Get It | Starts With |
|---|---|---|
| `DATABASE_URL` | Neon dashboard → project → connection string | `postgresql://` |
| `BETTER_AUTH_SECRET` | [randomkeygen.com](https://randomkeygen.com) | any 32+ chars |
| `BETTER_AUTH_URL` | Your app's domain | `http://` or `https://` |
| `GOOGLE_CLIENT_ID` | Google Cloud Console → Credentials | numbers + `.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console → Credentials | `GOCSPX-` |
| `GITHUB_CLIENT_ID` | GitHub → Settings → Developer settings | `Ov23li` |
| `GITHUB_CLIENT_SECRET` | GitHub → Settings → Developer settings | long hash |
| `RESEND_API_KEY` | Resend dashboard → API Keys | `re_` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe dashboard → API Keys | `pk_test_` or `pk_live_` |
| `STRIPE_SECRET_KEY` | Stripe dashboard → API Keys | `sk_test_` or `sk_live_` |
| `STRIPE_WEBHOOK_SECRET` | Stripe dashboard → Webhooks | `whsec_` |
| `R2_ACCESS_KEY_ID` | Cloudflare → R2 → API Tokens | short string |
| `R2_SECRET_ACCESS_KEY` | Cloudflare → R2 → API Tokens | long string |

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
