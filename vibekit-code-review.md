# VibeKit — Senior Engineer Code Review

> Reviewed by: Claude (Anthropic) acting as Senior Software Engineer  
> Repository: https://github.com/MUKE-coder/vibekit  
> Date: May 2026

---

## Overview

VibeKit is a prompt-engineering framework targeting vibe coders building production Next.js SaaS apps with Claude Code. The review covers prompt quality, architecture guidance, security, developer experience, and completeness.

**Overall verdict: Solid foundation with some critical gaps to address before it scales.**

---

## Scores at a Glance

| Area | Score |
|---|---|
| Prompt Engineering | 88 / 100 |
| Architecture | 75 / 100 |
| Security | 48 / 100 |
| Developer Experience | 82 / 100 |
| Completeness | 65 / 100 |

---

## Strengths — What's Really Good

### 1. The 5-Part Prompt Formula is Excellent

Context → Goal → Component → Spec → Constraint is genuinely the right mental model for AI-assisted coding. The contrast between the "bad prompt" and "pro prompt" for the data table example is the clearest teaching moment in the entire framework. Keep that pattern and expand on it.

### 2. Token Economy Explanation is Genuinely Useful

The breakdown showing ~800–1,200 lines of auth from scratch vs ~400 tokens when using a pre-built component is concrete and compelling. This is exactly what vibe coders need to understand why planning saves money.

### 3. Phase-Gated Build Structure is Industry-Correct

Foundation → Core Features → Payments → Files → Emails → Deploy is the right order of operations. The explicit stop-and-confirm between phases prevents the classic vibe coding failure mode of building on a broken foundation.

### 4. Prisma v7 Rules are Precise and Correct

The `prisma-client` vs `prisma-client-js` distinction, the `prisma.config.ts` pattern, the import path from `app/generated/prisma/client` — these are real gotchas that trip up AI tools. Codifying them as ABSOLUTE RULES is exactly the right approach.

### 5. The Rescue System is a Hidden Gem

Technique 1 (Hard Reset), 2 (Decomposition), and 3 (V0 Bypass) address the actual pain point most vibe coders hit. The instruction to never keep prompting in the same broken conversation is advice most tutorials miss entirely.

### 6. Design System Specificity is Excellent

Pinning card styles to `bg-white border border-slate-200 shadow-sm rounded-xl`, specifying an 8pt grid, 52px row height in tables, shadow-xs on cards and shadow-xl on modals — this level of specificity is what separates AI output that looks like Linear from output that looks like a tutorial site.

---

## Critical Issues — Fix Before Sharing Widely

### 🚨 [CRITICAL] No API Route Authorization Pattern

The master prompt's sample API route template has **zero auth checking**. The example `GET /api/` and `POST /api/` handlers just call `db.contact.findMany()` with no session validation. AI will generate this pattern for every route in every project, creating unauthenticated data endpoints by default.

**Fix:** Add a canonical session check pattern to every route template:

```ts
const session = await auth.api.getSession({ headers: req.headers });
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

This is the single biggest security hole in the framework right now.

---

### 🚨 [CRITICAL] Next.js Version Claim is Incorrect

The README and master prompt reference **Next.js 16**, but as of mid-2025 Next.js is at version 15.x. There is no released Next.js 16. The `package.json` template pins `"next": "16.2.2"` which is a non-existent version — running `pnpm install` will fail. This will confuse every new user immediately.

**Fix:** Update to the actual latest stable version and add a note to check `npmjs.com/package/next` for the current version.

---

### 🚨 [CRITICAL] Raw Body Parsing on Stripe Webhooks Not Covered

The monetization guide mentions Stripe webhooks but never addresses that webhook handlers require the raw request body (not JSON-parsed) for `stripe.webhooks.constructEvent()`. This is the #1 reason Stripe webhook integrations break silently.

**Fix:** The webhook section needs to explicitly instruct Claude to use `await req.text()` and pass that raw string to `constructEvent`:

```ts
const rawBody = await req.text();
const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
```

---

### 🚨 [CRITICAL] No RBAC (Role-Based Access Control) Pattern

The framework collects user roles in `project-description.md` (admin, user, viewer, etc.) but never provides a pattern for enforcing them. AI will collect the roles and then ignore them at the route level.

**Fix:** Add a canonical guard pattern:

```ts
function requireRole(session: Session | null, role: string) {
  if (!session || session.user.role !== role) {
    throw new Error("Forbidden");
  }
}
```

This should be a standard utility in the `lib/` folder template.

---

### ⚠️ [HIGH] No Testing Guidance Whatsoever

A framework claiming "production-grade" with zero mention of testing is a contradiction. AI-generated code tends to accumulate subtle regressions that only testing catches.

**Fix:** Add a minimal testing section — "Add Vitest for unit tests on utility functions, Playwright for E2E smoke tests on auth flows." Even a single test phase task would close this gap.

---

## Architecture & Stack Suggestions

### 1. Add Server Actions as an Alternative to API Routes for Mutations

The framework mandates API Routes (Route Handlers) for all server logic. This is defensible but increasingly outdated with Next.js App Router. Server Actions eliminate the client→API→server round-trip for mutations, which fits React Query mutations well.

**Recommendation:** Add a decision rule:
- **Server Actions** → form mutations (create/update/delete)
- **API Routes** → external webhooks and public APIs that need raw HTTP control

### 2. The Global Prisma Singleton Has a Next.js Edge Case

The current pattern stores the Prisma client on `global`. This can behave unexpectedly with Next.js middleware (Edge Runtime) and hot-reload in dev.

**Fix:** Add a note: this client should only be imported from Server Components, API Routes, and Server Actions — never from client components or middleware.

### 3. Pin TypeScript to 5.x, Not 5.9

TypeScript 5.9 doesn't exist yet. This will cause the same install-failure as the Next.js 16 issue. Use `"typescript": "^5"` or pin to the current latest patch. Same issue with `@types/react: ^19` — verify the actual @types version available.

### 4. Add an Error Boundary Pattern to the Design System Rules

The framework specifies loading states (skeleton), empty states, and 404/error pages — but doesn't cover React Error Boundaries. AI-generated components that crash will silently kill the whole page.

**Fix:** Add a rule: "Every major page section doing async data fetching must be wrapped in a Suspense boundary with an error fallback."

### 5. Document the Zustand vs React Query vs React State Decision

The JB Zustand Cart component is referenced, but there's no guidance on when to use which state tool. Vibe coders will use all three randomly.

**Fix:** Add a one-paragraph decision rule:
- **React state** → local UI state
- **React Query** → server state (all data from the database)
- **Zustand** → cross-component client-only state (cart, modal stacks, user preferences)

---

## Prompt Quality — Refinements

### 1. CLAUDE_PROMPT.md Fetches External URLs That May Break

The planning prompt tells Claude to read `https://raw.githubusercontent.com/...` URLs at runtime. This is fragile — if GitHub is slow, Claude's context window is full, or the URL changes, the planning session silently degrades.

**Fix:** Embed the essential content directly in the prompt, or instruct users to copy-paste the file contents manually. External URL fetching during a planning session is an unreliable dependency.

### 2. "ONE QUESTION AT A TIME" Conflicts with the Interview Process

The master prompt says "ONE question at a time" but the `CLAUDE_PROMPT.md` interview says "Ask me 7–12 questions." These will produce different behaviors depending on which prompt Claude sees first.

**Fix:** Reconcile the two: the planning session can ask 2–3 related questions per turn; the build session is strictly one at a time. Make this distinction explicit in both files.

### 3. Add a "What Not to Install" Blocklist

The framework tells AI what to install but never what to avoid. Vibe coders frequently end up with `moment.js`, `lodash`, duplicate auth libraries, or `classnames` alongside `clsx`.

**Fix:** Add a short explicit blocklist:
- Never `moment` → use `date-fns`
- Never `axios` → use `fetch`
- Never `next-auth` alongside `better-auth`
- Never `classnames` → use `clsx` (already in the stack)

### 4. The "DONE PHASE" Instruction Gives Incorrect Neon URL Guidance

The done phase warns against `prisma+postgres://` but doesn't explain Neon's two connection strings. This is a real Neon + Prisma gotcha.

**Fix:** Clarify:
- `DATABASE_URL` → direct (non-pooled) connection for Prisma and migrations
- `DATABASE_URL_UNPOOLED` → for migrations specifically on serverless environments

---

## Developer Experience — Quick Wins

### 1. Rename master_prompt.md to CLAUDE.md

Claude Code automatically reads a `CLAUDE.md` file at the project root before every session. Recommend that users rename (or symlink) their `master_prompt.md` to `CLAUDE.md` so it's loaded automatically — no manual pasting required. This eliminates the #1 friction point in the current workflow.

### 2. The Repository is Missing Its Template Files

The README mentions a `templates/` folder with `design-system.md`, `prd-saas.md`, `prd-ecommerce.md`, and `prd-school.md` — but these files don't exist in the repo. This is a broken promise in the documentation. Either add them or remove the reference. First impressions matter for a framework's credibility.

### 3. Add a Changelog / Versioning Strategy

VibeKit's prompts will evolve as Prisma, Next.js, and Better Auth change. Right now there's no way for users to know if their copy of `master_prompt.md` is current.

**Fix:** Add a version header at the top of each core prompt file (e.g. `# VibeKit v1.2.0 — master_prompt.md`) and maintain a simple `CHANGELOG.md`.

### 4. Document the JB Component Registry Dependency

The framework heavily relies on `jb.desishub.com` components. If the registry goes down or changes, the entire framework breaks silently.

**Fix:** Maintain a local `jb-components.md` reference in the repo itself rather than fetching it live every session.

---

## Strategic Opportunities — What Could Make VibeKit Great

### 1. Create a CLI Scaffolding Tool

Right now the UX is: clone repo → copy files → paste into Claude → get planning output → manually save 4 files → copy master_prompt.md → open Claude Code. That's 7+ manual steps.

**Opportunity:** A single `npx create-vibekit my-app` that runs the planning interview, saves the output files, and writes `CLAUDE.md` automatically would make VibeKit feel like a real product. This alone would 10x adoption.

### 2. Add a "Validation Checkpoint" Prompt

Between phases, give users a prompt template to audit Claude Code's own work:

> "Read all files in Phase 1. Check that: auth is protected, all env vars are in .env.example, Prisma v7 patterns are followed, no useEffect is used for data fetching. Report any violations."

This self-auditing loop is missing from most AI frameworks and would be a clear differentiator.

### 3. Lean Into African & Emerging Market Payments

You're based in Uganda (Desishub Technologies) and the framework already mentions DGateway for Mobile Money. This is a genuinely underserved area in the SaaS framework space.

**Opportunity:** A dedicated section on building for markets where mobile money is primary — MTN MoMo, Airtel Money, M-Pesa — with currency formatting for UGX/KES/GHS and latency considerations for lower-bandwidth environments. No other vibe coding framework targets this. It's your backyard and your moat.

---

## Priority Action List

| Priority | Action |
|---|---|
| 🚨 P0 | Add session auth check to all API route templates |
| 🚨 P0 | Fix Next.js and TypeScript version numbers |
| 🚨 P0 | Add raw body handling to Stripe webhook section |
| 🚨 P0 | Add RBAC guard utility pattern |
| ⚠️ P1 | Add `templates/` folder files referenced in README |
| ⚠️ P1 | Recommend `CLAUDE.md` naming for auto-loading |
| ⚠️ P1 | Fix Neon connection string guidance |
| ⚠️ P1 | Add "What Not to Install" blocklist |
| 💡 P2 | Add testing phase (Vitest + Playwright) |
| 💡 P2 | Add Server Actions guidance |
| 💡 P2 | Add Validation Checkpoint prompt |
| 💡 P2 | Add versioning / CHANGELOG |
| 🚀 P3 | Build `npx create-vibekit` CLI |
| 🚀 P3 | Expand Mobile Money / African payments section |

---

## Final Word

The bones of VibeKit are genuinely solid — the phase structure, the token economy teaching, the Prisma v7 rules, the design system specificity, and the Rescue System are all above average for frameworks in this space. You're building something real here.

Fix the security gaps first (unauthorized routes, missing RBAC), correct the version numbers, and add the missing template files. Those four things will take VibeKit from "promising" to "trustworthy." Everything else in this review is about taking it from trustworthy to great.

---

*Reviewed by Claude (Anthropic) · VibeKit by JB (Muke Johnbaptist) · Desishub Technologies*
