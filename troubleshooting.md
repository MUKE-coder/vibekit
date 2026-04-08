# Troubleshooting Guide

> When your build is stuck, this is the first place to look. Organised by symptom so you can find your problem fast.

---

## Quick Diagnosis — Start Here

**Answer these questions before scrolling:**

1. Did this work before and then break? → [Something I Changed Broke It](#something-broke)
2. Is AI looping on the same error? → [AI Is Stuck in a Loop](#ai-stuck)
3. Did the app deploy but something doesn't work? → [Production Issues](#production-issues)
4. Is auth broken? → [Authentication Problems](#authentication-problems)
5. Is the database throwing errors? → [Database Errors](#database-errors)
6. Are emails not arriving? → [Email Issues](#email-issues)
7. Are payments failing? → [Payment Issues](#payment-issues)
8. Does the app look broken? → [UI / Design Issues](#ui-issues)

---

## AI Is Stuck in a Loop {#ai-stuck}

### Symptom
Claude Code keeps trying the same fix over and over. The error changes slightly each time but the problem persists. You have been in the same conversation for 30+ minutes.

### Fix — The Hard Reset Protocol

1. **Stop.** Do not send another message in the current conversation.
2. Open a **brand new** Claude Code conversation.
3. Paste this rescue prompt:

```
I am resuming a build that got stuck. Here is the full context:

Project: [name]
Tech stack: Next.js 16, Neon Postgres, Prisma, Better Auth UI, React Query + Fetch API, API Routes, Zod, Tailwind + shadcn/ui

The specific problem:
Error message: [paste exact error]
File where it occurs: [filename]
Current content of that file: [paste file content]

What I already tried (do NOT repeat these):
- [thing 1]
- [thing 2]

Rules:
- Fix ONLY the specific error above
- Do NOT modify: authentication, other pages, Prisma schema, package.json
- Make the smallest possible change
- Explain what was wrong in one sentence
- Show me only the changed lines, not the entire file
```

### Why This Works

Each new conversation starts fresh — Claude Code does not carry over its failed assumptions from the previous session. You are giving it a clean slate with complete context instead of a confused history.

---

## Something I Changed Broke It {#something-broke}

### Strategy — Isolate the Change

1. Identify exactly which Claude Code prompt caused the breakage
2. In your new prompt, say:
   ```
   The last change broke the app. The specific symptom is: [describe].
   Revert ONLY the changes from the last prompt.
   Do not make any new changes.
   ```
3. If Claude Code cannot revert cleanly, download the project and manually restore the broken file from your previous working version

### Prevention

Before each new phase or significant change, download your project from Claude Code as a ZIP. This gives you a manual rollback point.

---

## Authentication Problems {#authentication-problems}

### Symptom: Login redirects correctly but session is not persisted

**Check:**
- `BETTER_AUTH_SECRET` is set in your environment variables
- `BETTER_AUTH_URL` matches your exact app URL (no trailing slash, correct protocol)
- The auth API route exists at `app/api/auth/[...all]/route.ts`

**Rescue prompt:**
```
Authentication is not persisting sessions. Login succeeds but the user is immediately shown as logged out on the next page load.

Do not reinstall Better Auth.
Check only these specific things:
1. Is BETTER_AUTH_SECRET set and at least 32 characters?
2. Is BETTER_AUTH_URL set to the exact app URL?
3. Is the session cookie being set correctly after login?
4. Is the session being checked on the dashboard page?

Show me the current content of: 
- app/api/auth/[...all]/route.ts
- The session check on the dashboard page
```

---

### Symptom: Google OAuth returns an error

**Check:**
- In Google Cloud Console: is `http://localhost:3000/api/auth/callback/google` in Authorized Redirect URIs?
- For production: is `https://yourdomain.com/api/auth/callback/google` also added?
- Are `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` correctly set?

**Common mistake:** Google OAuth redirect URIs must match exactly — including `http` vs `https` and with or without trailing slash.

---

### Symptom: User is logged in but protected pages still redirect to login

**Rescue prompt:**
```
Protected pages are redirecting to /login even when the user is authenticated.

Check the middleware or session check on the page at [/path].
Show me the current protection logic.
The user IS logged in — the issue is how the session is being read on this page.
Do not change authentication or any other pages.
```

---

## Database Errors {#database-errors}

### `PrismaClientInitializationError: Can't reach database server`

**Causes and fixes:**

| Cause | Fix |
|---|---|
| `DATABASE_URL` not set | Add it to `.env.local` or Vercel environment variables |
| Neon project is paused | Go to Neon dashboard and click "Resume" |
| Wrong connection string format | Make sure string includes `?sslmode=require` at the end |
| IP not whitelisted | In Neon settings, allow all IPs (`0.0.0.0/0`) or add Vercel's IP ranges |

---

### `The table 'X' does not exist`

**Cause:** Schema change was not migrated to the database.

**Fix:**
```
Run: npx prisma migrate dev --name [describe-the-change]

If migration fails, run: npx prisma db push
This pushes the schema directly without creating migration files (use only for development).
```

---

### `Unique constraint failed on the fields: ('email')`

**Cause:** Trying to create a record with a value that already exists in a `@unique` field.

**Rescue prompt:**
```
The POST /api/[endpoint] route is throwing a unique constraint error on the email field.
Add error handling that:
1. Catches the Prisma unique constraint error (PrismaClientKnownRequestError with code P2002)
2. Returns a 409 status with message "An account with this email already exists"
Do not change anything else in this route.
```

---

### `Foreign key constraint failed on the field: 'X'`

**Cause:** Creating a record that references an ID that does not exist.

**Example:** Creating a task with `projectId: "abc"` but no project with that ID exists.

**Fix:** In your API route, check the referenced record exists before creating:
```
Before creating the [model], verify that the referenced [parentModel] with ID [id] exists.
If it does not exist, return a 404 error: "[parentModel] not found".
```

---

## Production Issues {#production-issues}

### Symptom: App works locally but fails after deployment

**Most common causes:**

1. **Missing environment variable in Vercel**
   - Go to Vercel → Settings → Environment Variables
   - Compare every variable in your `.env.local` against what is set in Vercel
   - Re-deploy after adding missing variables

2. **Prisma client not generated**
   - Add to your Vercel build command: `prisma generate && next build`
   - In Vercel → Settings → General → Build & Development Settings → Build Command

3. **Database migration not run in production**
   - Build command should be: `prisma generate && prisma migrate deploy && next build`

4. **Wrong environment in BETTER_AUTH_URL**
   - In Vercel, `BETTER_AUTH_URL` must be your production URL: `https://yourdomain.com`
   - NOT `http://localhost:3000`

---

### Symptom: Vercel build succeeds but app shows a 500 error

1. In your Vercel project, go to **Deployments**
2. Click on the failing deployment
3. Click **"View Build Logs"** — scroll to the bottom to find the error
4. Copy the exact error message and use it in a rescue prompt

---

### Symptom: Custom domain is not working

**Checklist:**
- [ ] DNS records added in Cloudflare (A record for apex, CNAME for www)
- [ ] Records set to **DNS only** (grey cloud) — NOT proxied (orange cloud)
- [ ] Waited 10+ minutes for DNS propagation
- [ ] Domain added in Vercel → Settings → Domains with green checkmark
- [ ] SSL certificate is provisioned (Vercel does this automatically after DNS verification)

**Check DNS propagation:** Go to [dnschecker.org](https://dnschecker.org) and enter your domain.

---

## Email Issues {#email-issues}

### Symptom: Emails are landing in spam

**Fix in this order:**

1. In Resend dashboard, verify your domain has status **"Verified"** (not "Pending")
2. Check all three DNS records are added in Cloudflare and propagated
3. Make sure `RESEND_FROM` is set to an address at your verified domain (e.g. `noreply@yourdomain.com`) — NOT `onboarding@resend.dev`
4. Check your email content does not have spam trigger words

---

### Symptom: Emails are not sending at all

**Rescue prompt:**
```
Emails are not being sent. No error is thrown but emails are not arriving.

Check the email sending code in [file path].
Add console.log statements to log:
1. Whether the sendEmail function is being called
2. The response from the Resend API
3. Any errors caught

Do not change the email template or sending logic.
```

Then check your Vercel function logs (Vercel → project → Logs) for the console output.

---

## Payment Issues {#payment-issues}

### Symptom: Stripe checkout page loads but payment fails

**Check:**
- Are you using test card number `4242 4242 4242 4242`?
- Is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` the test key (starts with `pk_test_`)?
- Is `STRIPE_SECRET_KEY` the test key (starts with `sk_test_`)?
- Are Stripe test mode and live mode keys mixed? (They must match)

---

### Symptom: Webhook is not updating the database after payment

**Check in order:**

1. In Stripe dashboard → Developers → Webhooks: is the webhook endpoint URL correct?
2. Is the webhook pointing to `https://yourdomain.com/api/webhooks/stripe`?
3. Is `STRIPE_WEBHOOK_SECRET` set in Vercel (starts with `whsec_`)?
4. Check Vercel logs for the webhook API route
5. In Stripe → Webhooks → your endpoint: check the event delivery logs for errors

**Rescue prompt:**
```
The Stripe webhook is firing (I can see it in the Stripe dashboard) but the database is not being updated.

Show me the current content of app/api/webhooks/stripe/route.ts.
Add detailed console.log statements to log:
1. That the webhook was received
2. The event type
3. Whether the database update was attempted
4. Any errors caught

Do not change the business logic — only add logging.
```

---

## UI / Design Issues {#ui-issues}

### Symptom: Page looks completely unstyled

**Cause:** Tailwind CSS is not loading correctly.

**Fix:**
```
The page at [/path] is not styled — Tailwind classes are not being applied.
Check that:
1. The page component is in the correct directory
2. The Tailwind config includes this directory in the content paths
3. The global CSS file is imported in the root layout
Do not change any other pages.
```

---

### Symptom: AI changed the design after a code update

**Cause:** Claude Code made "helpful" style changes while updating functionality.

**Fix:**
```
The last update changed the visual design of [page/component].
Revert ONLY the style changes. Keep all the functional changes.
The design should follow this system:
- Primary: [hex]
- Cards: bg-white border border-slate-200 shadow-sm rounded-xl
- No purple gradients
- [paste your design system]
Show me what was changed.
```

---

### Symptom: App looks different on mobile

**Rescue prompt:**
```
The page at [/path] is not properly responsive on mobile (under 640px width).
The specific problem is: [describe — text overflows, layout breaks, etc.]

Fix the mobile layout for this page only.
Do not change: desktop layout, any other pages, or any backend code.
Use Tailwind responsive prefixes: sm:, md:, lg:
```

---

## Escalation — When Nothing Works

If you have tried everything above and are still stuck:

1. **Export your project** from Claude Code as a ZIP
2. **Open a new Claude Code project** and import the ZIP (fresh start, same code)
3. **Describe only the one specific problem** in your first message
4. **Do not mention the history** of failed attempts — let Claude Code approach it fresh

If the problem is truly blocking:
- Post in the Claude Code Discord community
- Post in the VibeKit GitHub Discussions with your error and context
- Tag `@jbwebdeveloper` on YouTube with your question

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
