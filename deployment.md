# Deployment Guide

> Your app is not real until it is live. This guide takes you from finished Claude Code project to a custom domain with SSL, working emails, and everything verified in production.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Vercel (Recommended)](#vercel-deployment)
3. [Netlify (Alternative)](#netlify-deployment)
4. [VPS — DigitalOcean / Hetzner (Advanced)](#vps-deployment)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Cloudflare DNS Configuration](#cloudflare-dns-configuration)
7. [SSL Certificates](#ssl-certificates)
8. [Email Domain Setup (Resend)](#email-domain-setup)
9. [Post-Deployment Checklist](#post-deployment-checklist)
10. [Troubleshooting Common Deployment Errors](#troubleshooting)

---

## Pre-Deployment Checklist

Complete every item before deploying. Skipping these causes the most common post-deployment failures.

### Code Readiness
- [ ] All environment variables are read from `process.env` — no hardcoded secrets anywhere in the code
- [ ] A `.env.example` file exists listing all required variables (with descriptions, no real values)
- [ ] All Prisma migrations are committed to the repository
- [ ] The `prisma generate` command runs without errors
- [ ] `next build` completes without errors (test in Claude Code's build tool or ask Claude Code to verify)
- [ ] All API routes return proper HTTP status codes (200, 400, 401, 404, 500)
- [ ] No `console.log` statements with sensitive data (API keys, passwords, tokens)

### Auth Readiness
- [ ] Login and signup work end-to-end in the current environment
- [ ] Google OAuth works (if enabled) — Client ID and Secret are ready
- [ ] Redirect URLs are noted (you will need to add the production URL to Google Cloud Console)
- [ ] Protected routes redirect to `/login` when no session exists

### Database Readiness
- [ ] Neon database is created and connection string is ready
- [ ] All Prisma migrations have been run in development
- [ ] The production Neon database is separate from the development database (use Neon's branch feature)

### Design Readiness
- [ ] 404 page exists at `app/not-found.tsx`
- [ ] Error page exists at `app/error.tsx`
- [ ] App is tested on mobile viewport
- [ ] Favicon is set (`app/favicon.ico`)
- [ ] Page titles are set on all pages using Next.js `metadata`

---

## Vercel Deployment

Vercel is the recommended deployment platform for Next.js apps built with Claude Code. It requires zero configuration and deploys in under 2 minutes.

### Step 1 — Push Your Code to GitHub

In Claude Code, download your project. Then:

1. Create a new repository on [github.com](https://github.com)
2. Push your code to the repository

Alternatively, Claude Code has a built-in GitHub sync — use that if available.

### Step 2 — Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up or log in (use your GitHub account)
2. Click **"Add New Project"**
3. Under "Import Git Repository", find and select your GitHub repository
4. Click **"Import"**

### Step 3 — Configure the Project

On the configuration screen:

- **Framework Preset**: Vercel will auto-detect Next.js. Leave it as is.
- **Root Directory**: Leave as `/` unless your Next.js app is in a subfolder
- **Build Command**: Leave as `next build` (default)
- **Output Directory**: Leave as `.next` (default)
- **Install Command**: Change to `pnpm install` if you use pnpm (recommended)

### Step 4 — Add Environment Variables

This is the most important step. Do not skip any variable.

Click **"Environment Variables"** and add each variable from your `.env.example` file. For each one:

1. Enter the variable **name** (e.g. `DATABASE_URL`)
2. Enter the variable **value** (your real production value)
3. Set **Environment** to: Production, Preview, and Development (all three)
4. Click **Add**

See [`environment-variables.md`](./environment-variables.md) for a step-by-step guide to getting each value.

### Step 5 — Deploy

Click **"Deploy"**. Vercel will:

1. Clone your repository
2. Install dependencies
3. Run `next build`
4. Deploy to a `.vercel.app` URL

The first deploy takes 2–4 minutes. Subsequent deploys take 30–90 seconds.

### Step 6 — Verify the Deployment

1. Click the generated URL (e.g. `your-app.vercel.app`)
2. Test login and signup
3. Test one core feature (create a record, view a page)
4. Check the browser console for errors

### Automatic Deployments

Every time you push to your GitHub `main` branch, Vercel automatically re-deploys. Every pull request gets a unique **Preview URL** — this is useful for testing before going live.

### Vercel Environment Variable Tips

- Never add environment variables with quotes around the value (`"value"` not `value`)
- After adding new environment variables, you must re-deploy for them to take effect
- Use Vercel's **Environment Variable Groups** if you have many variables shared across projects
- The `NEXTAUTH_URL` / `BETTER_AUTH_URL` must be your exact production domain including `https://`

---

## Netlify Deployment

Netlify is a good alternative to Vercel. Use it if you prefer Netlify's interface or already have a Netlify account.

### Step 1 — Connect Repository

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose GitHub and select your repository

### Step 2 — Configure Build Settings

- **Base directory**: Leave empty (or set to your project root)
- **Build command**: `next build`
- **Publish directory**: `.next`

### Step 3 — Add Environment Variables

1. Go to **Site Settings** → **Environment Variables**
2. Add each variable individually
3. Click **"Deploy site"** after adding all variables

### Step 4 — Install the Next.js Runtime

Netlify requires a plugin for Next.js to work correctly:

1. Go to **Plugins** in your Netlify dashboard
2. Search for **"Essential Next.js"**
3. Install it on your site

Alternatively, add this to your `netlify.toml` file:

```toml
[build]
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Netlify vs Vercel — When to Choose

| Vercel | Netlify |
|---|---|
| Built for Next.js — zero config | Requires Next.js plugin |
| Free tier: 100GB bandwidth/month | Free tier: 100GB bandwidth/month |
| Better Next.js performance | More flexible for non-Next.js |
| Easier automatic deployments | More control over build process |
| **Recommended for this framework** | Use if you already use Netlify |

---

## VPS Deployment

Use a VPS (Virtual Private Server) when you need full control, want to save money at scale, or your app has specific requirements that Vercel/Netlify cannot meet.

**Recommended providers:**
- [Hetzner Cloud](https://hetzner.com/cloud) — Best price/performance. CX22 (2 vCPU, 4GB RAM) from €4.51/month
- [DigitalOcean](https://digitalocean.com) — Great UX. Basic Droplet from $6/month
- [Vultr](https://vultr.com) — Good global coverage from $6/month

### Prerequisites

You will need basic comfort with a Linux terminal. This is the advanced path — use Vercel unless you have a specific reason to need a VPS.

### Step 1 — Create a Server

On Hetzner (example):

1. Go to [console.hetzner.cloud](https://console.hetzner.cloud)
2. Create a new project
3. Click **"Add Server"**
4. Choose: Ubuntu 22.04, CX22 (or larger), your region
5. Add your SSH key (or create one — see GitHub's guide)
6. Click **"Create & Buy Now"**

### Step 2 — Connect to the Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 3 — Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20 via NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Install pnpm
npm install -g pnpm

# Install PM2 (process manager — keeps your app running)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install nginx -y

# Install Certbot (free SSL)
apt install certbot python3-certbot-nginx -y
```

### Step 4 — Clone and Build Your App

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Install dependencies
pnpm install

# Create your .env file
nano .env
# Paste all your environment variables, save with Ctrl+X, Y, Enter

# Run Prisma migrations
npx prisma migrate deploy

# Build the app
pnpm build
```

### Step 5 — Start the App with PM2

```bash
# Start the app
pm2 start pnpm --name "myapp" -- start

# Save PM2 config so it restarts on server reboot
pm2 save
pm2 startup
# Run the command PM2 outputs
```

### Step 6 — Configure Nginx

```bash
nano /etc/nginx/sites-available/myapp
```

Paste this configuration:

```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable the site
ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Step 7 — Add SSL with Certbot

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

Follow the prompts. Certbot will automatically configure HTTPS.

### Updating Your App on VPS

When you push new code:

```bash
cd YOUR_REPO
git pull
pnpm install
pnpm build
pm2 restart myapp
```

---

## Custom Domain Setup

Regardless of whether you deploy to Vercel, Netlify, or a VPS — you need to configure your domain's DNS to point to your deployment.

### Buying a Domain

**Recommended registrars:**

| Registrar | Best For | Price Range |
|---|---|---|
| [Cloudflare Registrar](https://cloudflare.com/products/registrar/) | Best price, built-in DNS management | At-cost (no markup) |
| [Namecheap](https://namecheap.com) | Easy interface, good support | $8–$15/year |
| [Google Domains](https://domains.google.com) | Simple, reliable | $10–$15/year |

**Recommendation: Buy from Cloudflare Registrar.** You get DNS management, DDoS protection, and free SSL all in one place at the lowest possible price.

### Connecting Your Domain to Vercel

1. In your Vercel project, go to **Settings** → **Domains**
2. Click **"Add Domain"**
3. Type your domain (e.g. `myapp.com`) and click **Add**
4. Vercel will show you DNS records to configure

You will see either:
- **A Record**: `76.76.21.21` (for apex domain: `myapp.com`)
- **CNAME Record**: `cname.vercel-dns.com` (for subdomain: `www.myapp.com`)

Configure these in Cloudflare (see next section).

---

## Cloudflare DNS Configuration

### Step 1 — Add Your Domain to Cloudflare

1. Go to [cloudflare.com](https://cloudflare.com) and sign up or log in
2. Click **"Add a Site"**
3. Enter your domain name and click **"Add Site"**
4. Choose the **Free plan**
5. Cloudflare will scan your existing DNS records

### Step 2 — Update Your Nameservers

Cloudflare will give you two nameservers like:
```
aria.ns.cloudflare.com
bob.ns.cloudflare.com
```

Go to wherever you bought your domain and update the nameservers to these two values. This process varies by registrar but is usually under **"DNS"** or **"Nameservers"** in your domain settings.

**Nameserver changes take 1–48 hours to propagate.** Usually it is under 30 minutes.

### Step 3 — Add DNS Records for Vercel

In your Cloudflare dashboard, go to **DNS** → **Records** and add:

**For `myapp.com` (apex domain):**
| Type | Name | Content | Proxy |
|---|---|---|---|
| A | @ | 76.76.21.21 | DNS only (grey cloud) |

**For `www.myapp.com`:**
| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | www | cname.vercel-dns.com | DNS only (grey cloud) |

> ⚠️ Set Cloudflare proxy to **"DNS only" (grey cloud)** for Vercel records. Vercel handles its own CDN and SSL — enabling Cloudflare's proxy (orange cloud) can cause SSL conflicts.

### Step 4 — Verify in Vercel

Back in Vercel → Settings → Domains, your domain should show a green checkmark within a few minutes of DNS propagation.

---

## SSL Certificates

### Vercel and Netlify
SSL is **automatic and free**. Once your domain is connected and DNS is verified, Vercel/Netlify provision an SSL certificate from Let's Encrypt automatically. No action needed.

### Cloudflare + VPS

Cloudflare provides free SSL in two modes:

| Mode | What It Does | When to Use |
|---|---|---|
| **Flexible** | Encrypts browser ↔ Cloudflare only | Not recommended — insecure on origin |
| **Full** | Encrypts browser ↔ Cloudflare ↔ server | Use with self-signed cert on server |
| **Full (Strict)** | Encrypts everything with valid cert | **Recommended** — use with Certbot |

For VPS, use Certbot (Step 7 in VPS section above) and set Cloudflare SSL to **Full (Strict)**.

---

## Email Domain Setup

If you are using Resend for emails, you must verify your sending domain so emails land in the inbox and not in spam. This is a DNS configuration in Cloudflare.

### Step 1 — Add Domain in Resend

1. Go to [resend.com](https://resend.com) and sign in
2. Go to **Domains** → **Add Domain**
3. Enter your domain (e.g. `myapp.com`)
4. Resend will give you DNS records to add

### Step 2 — Add Resend DNS Records in Cloudflare

Resend will ask you to add records that look like this (exact values will differ):

| Type | Name | Value |
|---|---|---|
| MX | send | feedback-smtp.us-east-1.amazonses.com |
| TXT | resend._domainkey | p=MIGfMA0GCSq... (long key) |
| TXT | @ | v=spf1 include:amazonses.com ~all |

Add each record in Cloudflare DNS → Records.

> Set all Resend records to **"DNS only" (grey cloud)** — not proxied.

### Step 3 — Verify in Resend

1. Go back to Resend → Domains
2. Click **"Verify"** next to your domain
3. Wait a few minutes for DNS to propagate
4. Status should change to **"Verified"**

### Step 4 — Update RESEND_FROM in Your App

Make sure your emails are sent from your verified domain:

```
RESEND_FROM=noreply@yourdomain.com
```

If you send from an unverified domain or `onboarding@resend.dev`, emails will likely land in spam in production.

---

## Post-Deployment Checklist

Run through every item after your first production deployment.

### Authentication
- [ ] Sign up with email works and creates a user in the Neon database
- [ ] Login with email and password works
- [ ] Google OAuth works and creates a session
- [ ] Logging out clears the session
- [ ] Visiting a protected route while logged out redirects to `/login`
- [ ] Password reset email is received and the reset link works

### Core Features
- [ ] Create a record (whatever your app's main feature is)
- [ ] Read / list records
- [ ] Update a record
- [ ] Delete a record
- [ ] File upload works (if applicable)

### Payments (if Stripe is enabled)
- [ ] Checkout page loads
- [ ] Stripe test payment completes (use card `4242 4242 4242 4242`)
- [ ] Stripe webhook fires and updates the database
- [ ] Subscription status is correctly stored in the database
- [ ] Premium features are gated correctly for free users

### Email
- [ ] Welcome email arrives in inbox (not spam) after signup
- [ ] Password reset email arrives in inbox
- [ ] Payment receipt email arrives (if applicable)
- [ ] Sender name and address are correct (not `onboarding@resend.dev`)

### Performance & SEO
- [ ] Pages load in under 3 seconds on a mobile connection
- [ ] Favicon is visible in the browser tab
- [ ] Page titles are set correctly (check browser tab and `<title>` tag)
- [ ] `og:image` and `og:title` are set (check using [opengraph.xyz](https://opengraph.xyz))
- [ ] Sitemap is accessible at `/sitemap.xml` (if applicable)
- [ ] robots.txt exists at `/robots.txt`

### Security
- [ ] No API keys, secrets, or passwords are visible in the browser source code
- [ ] No sensitive data appears in the URL
- [ ] All API routes that modify data require authentication

---

## Troubleshooting

### Build Fails on Vercel

**Error: `Module not found`**
- Check that all imports use the correct file paths (case-sensitive on Linux)
- Make sure all packages are in `dependencies` (not just `devDependencies`) in `package.json`

**Error: `Environment variable not found`**
- Make sure all variables are added in Vercel → Settings → Environment Variables
- Re-deploy after adding new variables

**Error: `Prisma Client not found`**
- Add `prisma generate` to your build command in Vercel: `prisma generate && next build`

### App Deploys But Auth Doesn't Work

1. Check that `BETTER_AUTH_URL` is set to your exact production URL: `https://yourdomain.com` (no trailing slash)
2. Check that `BETTER_AUTH_SECRET` is set and is at least 32 characters
3. In Google Cloud Console, add `https://yourdomain.com/api/auth/callback/google` to Authorized Redirect URIs

### Database Connection Fails in Production

1. Check that `DATABASE_URL` is your Neon production database URL (not development)
2. In Neon, make sure the database's **IP allowlist** includes Vercel's IPs (or set it to allow all — `0.0.0.0/0`)
3. Add `?sslmode=require` to the end of your Neon connection string if not already present

### Emails Landing in Spam

1. Verify your sending domain in Resend (see Email Domain Setup above)
2. Make sure you are sending FROM a verified domain address (not `onboarding@resend.dev`)
3. Check that all three DNS records (MX, TXT for DKIM, TXT for SPF) show as verified in Resend

### Custom Domain Not Working After Adding to Vercel

1. Check that DNS records are set to **"DNS only"** (grey cloud) in Cloudflare — not proxied
2. Wait at least 10 minutes for DNS propagation
3. Use [dnschecker.org](https://dnschecker.org) to verify your DNS records have propagated
4. Check that the A record points to `76.76.21.21` (Vercel's IP)

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
