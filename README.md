# VibeKit Framework — Build Production Apps with Claude Code

> A structured framework for building production-grade Next.js apps with Claude Code/Any agent — without burning tokens, shipping broken code, or getting stuck.

**By JB (Muke Johnbaptist) · [jb.desishub.com](https://jb.desishub.com) · Desishub Technologies**

---

## What Is VibeKit Framework?

VibeKit Framework is a **planning + building system** for vibe coders who use Claude Code/any agent to build real Next.js applications. It gives you:

- A **master prompt** that makes Claude Code write production-quality code (not AI slop)
- A **planning workflow** that generates 4 project files from your app idea
- **Reference guides** for database, deployment, environment variables, design, payments, and troubleshooting
- A **Claude Code skill** that enforces the framework standards automatically

---

## The Problems VibeKit Solves

Every vibe coder building with AI hits the same walls. VibeKit is designed to remove each one.

| Pain                              | What it looks like                                                                              | How VibeKit solves it                                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **AI slop design**                | Every app looks the same — purple gradients, generic shadcn defaults, no brand identity         | `design-style-guide.md` is customized per project (colors, typography, spacing, component specs) and Claude Code follows it exactly       |
| **Inconsistent UI**               | Buttons, cards, and forms look slightly different on every page                                 | Design tokens defined in one place, enforced by the master prompt across every component                                                  |
| **Shipping broken auth**          | AI writes insecure login flows, missing password reset, no OAuth, session bugs                  | `jb-components.md` points Claude to install JB Better Auth UI — battle-tested auth in one command                                         |
| **Slow page loads**               | API routes hit the database on every request — no cache layer between React Query and Postgres  | Upstash Redis caches hot API queries in memory. React Query on the client + Redis on the server = dual-layer caching. See REDIS CACHING. |
| **Bloated JS bundles**            | Heavy libraries (PDF, charts, editors) load on every page + two animation frameworks = slow paint | `next/dynamic` for all imports over 15KB. Framer Motion ONLY (single lib). GSAP only for advanced marketing. Bundle analysis in pre-deploy. |
| **Burning tokens**                | $100–$200 per project because AI rewrites boilerplate every time (auth, tables, forms, uploads) | JB Component Registry covers the big primitives — AI installs and wires up instead of writing from scratch (saves 60–80% tokens)          |
| **Getting stuck in loops**        | AI tries the same broken fix repeatedly, context gets polluted, progress stalls                 | Phase-based build (`project-phases.md`) + rescue prompts in `prompt-engineering.md` + `troubleshooting.md` playbook                       |
| **No plan, no clarity**           | Starting with "build me a SaaS" and hoping for the best                                         | Claude interviews you first, generates `project-description.md` + `project-phases.md` — a clear blueprint before a single line is written |
| **Tech stack chaos**              | AI picks a different stack every project — jsPDF here, Drizzle there, useEffect for data        | Master prompt locks the stack: Next.js 16 + Prisma v7 + Upstash Redis + React Query + Zod + Framer Motion + @react-pdf/renderer + xlsx — always |
| **Prisma version drift**          | AI mixes Prisma v6 and v7 patterns, breaks the build                                            | Master prompt enforces Prisma v7 patterns exactly (generator, custom output path, adapter-pg)                                             |
| **Deployment confusion**          | App works locally, breaks in production — env vars, DNS, SSL, email spam                        | `deployment.md` + `environment-variables.md` walk through every step with checklists                                                      |
| **Vague prompts = vague code**    | "Make it look better" produces unpredictable changes that break other things                    | `prompt-engineering.md` teaches the 5-part formula and context-loading technique                                                          |
| **Payment setup hell**            | Stripe keys, webhooks, feature gating, billing pages — most builds never ship monetization      | `monetization-guide.md` + JB Stripe UI component handle the full flow                                                                     |
| **Losing track of progress**      | Mid-build, no idea what's done vs. what's left                                                  | Phase tasks in `project-phases.md` are checkboxes — Claude Code checks them off as it goes                                                |
| **No rescue plan when AI breaks** | Build stalls for hours because AI keeps making it worse                                         | Rescue prompts + hard-reset protocol + the V0 bypass technique in `prompt-engineering.md`                                                 |

---

## The Standard Tech Stack

Every project built with this framework uses this stack. Do not deviate unless the user has a specific reason.

| Layer          | Technology                   | Why                                                          |
| -------------- | ---------------------------- | ------------------------------------------------------------ |
| Framework      | Next.js 16 (App Router)      | Latest App Router with React 19                              |
| Language       | TypeScript 5.9               | Type safety, better DX                                       |
| Database       | Neon — Serverless Postgres   | Free tier, instant setup, serverless scale                   |
| ORM            | Prisma v7                    | Type-safe, AI reads schema easily                            |
| Cache          | Upstash Redis                | API-layer query caching, rate limiting, session store        |
| Authentication | Better Auth                  | Secure, extensible, Prisma-compatible                        |
| Data Fetching  | React Query + Redis + Fetch  | Client cache (React Query) + server cache (Redis) = dual layer |
| API Layer      | API Routes (Route Handlers)  | Server-side logic via Next.js App Router                     |
| Validation     | Zod + React Hook Form        | Type-safe validation on client and server                    |
| Animation      | Framer Motion                | State + entrance animations (single lib, ~35KB gzipped)      |
| PDF Generation | @react-pdf/renderer          | React components to PDF, full styling control                |
| Excel Export   | xlsx                         | Read/write Excel files, lightweight and reliable             |
| File Storage   | Cloudflare R2 or UploadThing | R2 for S3-compatible storage, UploadThing for simple uploads |
| Email          | Resend + React Email         | Best DX, great deliverability                                |
| Payments       | Stripe                       | Industry standard, webhook-driven                            |
| Styling        | Tailwind CSS v4 + shadcn/ui  | AI knows these patterns well                                 |
| Deployment     | Vercel                       | One-click, preview URLs, zero config                         |
| Domain & DNS   | Cloudflare                   | Free SSL, fast DNS, easy management                          |
| Components     | JB + VibeKit In-House Registry | Production-ready shadcn components — auth, payments, data tables, kanban, charts, org UI, etc. |

> **File Uploads — R2 vs UploadThing:**
>
> - **Cloudflare R2 / AWS S3** — Full control, large files, S3-compatible workflows.
> - **UploadThing** — Simpler setup, great for image uploads. Follow the [UploadThing setup guide](https://jb.desishub.com/blog/image-upload-with-uploadthing).
>   Choose based on your project needs.

---

## 📺 Watch the Crash Course

The fastest way to learn VibeKit is to watch the full crash course where I build a real Hardware POS system from scratch in about 3 hours — every prompt, every command, end-to-end.

[![VibeKit Framework Crash Course](https://14j7oh8kso.ufs.sh/f/HLxTbDBCDLwf0VdAvuLtvnF3cx4uPCTU9aqg2f0oY8klybGQ)](https://youtu.be/TvGu_Tu-6UI)

▶ **[Watch on YouTube → VibeKit Framework Crash Course](https://youtu.be/TvGu_Tu-6UI)**

The written version with copyable prompts is also on the site: [vibekit.desishub.com/tutorial](https://vibekit.desishub.com/tutorial).

---

## How To Use This Framework

### Step 0 — Check your environment (2 min, optional but recommended)

Before anything else, make sure your machine has Node 20+, pnpm 9+, git, and gh CLI installed. The fastest check: copy the OS-specific prompt from [`setup-prompts/`](./setup-prompts) (macOS / Windows / Linux) and paste it into your AI coding agent. It runs a single safe shell command and tells you exactly what's installed and what to fix — without touching your system. Or visit [vibekit.desishub.com/setup](https://vibekit.desishub.com/setup) for the full guide with one-click copy.

### Step 1 — Copy the planning prompt

Copy the contents of [`CLAUDE_PROMPT.md`](./CLAUDE_PROMPT.md) from this repository.

### Step 2 — Open Claude

Go to [claude.ai](https://claude.ai) and start a new conversation.

### Step 3 — Paste and add your idea

Paste the contents of `CLAUDE_PROMPT.md` into Claude, then add your app idea at the bottom:

```
[CLAUDE_PROMPT.md contents pasted here]

MY IDEA: I want to build a school management system where teachers can manage students,
track attendance, and parents can log in to see their child's progress and pay school fees.
```

### Step 4 — Answer Claude's questions

Claude will ask you 6–10 questions about your project. Answer honestly and completely.

### Step 5 — Get your 4 project files

Claude will generate:

| File                     | Purpose                                                                         |
| ------------------------ | ------------------------------------------------------------------------------- |
| `project-description.md` | Complete description of your app — features, data model, pages, integrations    |
| `project-phases.md`      | Build blueprint with phases, tasks, and install commands                        |
| `design-style-guide.md`  | Fully customized visual design system (colors, typography, spacing, components) |
| `prompt.md`              | The prompt you paste into Claude Code to start building                         |

Save all 4 files into your project root folder.

### Step 6 — Copy the framework files

Copy these 2 files from this repository into your project root:

- [`master_prompt.md`](./master_prompt.md) — Tech stack rules, Prisma v7 patterns, coding standards (rename to `CLAUDE.md` for auto-loading)
- [`jb-components.md`](./jb-components.md) — JB component registry reference (when to use each)

**Pro tip:** Claude Code auto-loads a `CLAUDE.md` file at the project root. Rename (or symlink) `master_prompt.md` → `CLAUDE.md` so it's loaded automatically every session — no more copy-pasting.

### Step 7 — Start building with Claude Code

Open Claude Code in your project directory and paste the contents of `prompt.md`. Claude Code will:

1. Read `master_prompt.md`, `design-style-guide.md`, `jb-components.md`, `project-description.md`, and `project-phases.md`
2. Start with Phase 1 (Foundation)
3. Install JB components before writing from scratch
4. Stop after each phase for your confirmation
5. Follow the design system and coding standards exactly

---

## Framework Files

```
vibekit/
├── README.md                    ← You are here
├── CLAUDE_PROMPT.md             ← Paste this into Claude to plan your project
│
├── CLAUDE.md                    ← 🔥 Rename master_prompt.md → CLAUDE.md for auto-loading
├── master_prompt.md             ← Coding standards for Claude Code (copy to your project + rename to CLAUDE.md for auto-load)
├── design-style-guide.md        ← Design style guide template (Claude customizes per project)
├── jb-components.md             ← JB component registry reference (copy to your project)
├── pre-deploy-review.md         ← Paste into Claude Code before deploying — security/perf/Redis/WebVitals audit
│
├── prompt-engineering.md        ← Token economy, prompt formula, rescue system
├── deployment.md                ← Vercel, Netlify, VPS, Cloudflare, SSL
├── environment-variables.md     ← Step-by-step for every secret
├── database-guide.md            ← Neon, Prisma, schema patterns, migrations
├── design-system-guide.md       ← Design principles, color palettes, component styles
├── troubleshooting.md           ← Symptoms → fixes, AI rescue protocols
├── monetization-guide.md        ← Stripe, webhooks, feature gating, billing
├── dgateway-guide.md            ← Mobile Money + card checkout for African markets
├── multi-tenant.md              ← Orgs + RBAC + scoped queries (B2B SaaS)
├── audit-log.md                 ← Hash-chained tamper-evident log (SOC2 / compliance)
└── ai-guide.md                  ← Vercel AI SDK + pgvector RAG + credit packs
```

### Files to copy into your project

When starting a new project, copy these from the VibeKit repo into your project root:

| File                   | Purpose                                                  |
| ---------------------- | -------------------------------------------------------- |
| `master_prompt.md`     | Claude Code reads this first — tech stack + coding rules (rename to `CLAUDE.md` for auto-load) |
| `jb-components.md`     | Reference for when to install which JB component         |
| `pre-deploy-review.md` | Paste into Claude Code before deploying for a full audit (perf, Redis, security, Web Vitals) |

Claude (in the planning step) will generate `project-description.md`, `project-phases.md`, `design-style-guide.md`, and `prompt.md` for you.

### Install the VibeKit rules for your AI agent (one curl, every major agent)

After copying the framework files, install the VibeKit agent rules so they auto-load every session — no need to paste long prompts. Same rules content for every agent, just a different filename / install path.

| Agent | One-line install |
|---|---|
| **Claude Code** | `mkdir -p .claude/skills/vibekit && curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/SKILL.md -o .claude/skills/vibekit/SKILL.md` |
| **Cursor** | `mkdir -p .cursor/rules && curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md -o .cursor/rules/vibekit.mdc` |
| **OpenAI Codex CLI** | `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md -o AGENTS.md` |
| **Cline** | `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md -o .clinerules` |
| **Windsurf** | `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md -o .windsurfrules` |
| **Gemini CLI** | `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md -o GEMINI.md` |
| **Aider, Continue, Cody, Junie, others** | See [`skill/README.md`](./skill/README.md) |

Using multiple agents on the same project? Symlink one canonical `AGENTS.md` to the per-agent paths — see [`skill/README.md`](./skill/README.md) → "Multi-agent setup".

---

## Pre-Deploy Code Review

Before shipping to production, run [`pre-deploy-review.md`](./pre-deploy-review.md) in Claude Code. It performs a senior-level audit covering:

- **Performance** — N+1 queries, missing pagination, expensive operations
- **Security** — unauthenticated routes, SQL injection, missing rate limiting, exposed secrets
- **Background tasks** — webhook idempotency, job retries, distributed locks
- **Resource consumption** — memory leaks, unclosed streams, missing timeouts

Claude Code writes the findings to `pre-deploy-review-report.md`. Address every Critical issue before deploying. This is a phase task in every VibeKit project.

---

## Component Registry — JB + VibeKit In-House

**JB Registry Reference:** [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)

**VibeKit In-House Registry:** [vibekit.desishub.com/components](https://vibekit.desishub.com/components) — Components built and maintained as part of the framework. Hosted at `vibekit.desishub.com/r/{slug}.json`.

**Framework Reference:** [`jb-components.md`](./jb-components.md) — Detailed guide with install commands, env vars, prerequisites, and when-to-use for every component (JB + in-house).

Production-ready shadcn components for auth, data tables, forms, file uploads, e-commerce, Stripe checkout, MDX blogs, API docs, kanban boards, org/team UI, charts dashboards, multi-step wizards, rich text editors, command palettes, notification centers, file managers, printable templates, and SaaS pricing/billing/subscription/token UIs. Claude Code (and Cursor, Cline, Codex) checks `jb-components.md` before building features from scratch.

---

## Contributing

VibeKit is community-driven — every component in the registry was built by someone shipping with AI in production. **We're actively looking for new components.**

If you've built something reusable — auth flow, payment widget, AI feature, dashboard primitive, search component — please contribute it. Once merged:

- Your component gets a permanent doc page at `vibekit.desishub.com/components/<slug>`
- It's listed in [`jb-components.md`](./jb-components.md), which every Claude Code agent reads
- It becomes part of the framework's default toolkit across thousands of builds

**Read the full contribution guide:** [CONTRIBUTING.md](./CONTRIBUTING.md)

**Quick start:**

1. Build & host your component (shadcn-compatible registry)
2. Write a doc page anywhere accessible
3. Fork, edit `web/src/lib/components-data.ts`, append your entry using [the schema](./CONTRIBUTING.md#the-component-schema)
4. Open a PR with the `new-component.md` template — we review weekly

Other contributions (docs fixes, framework refinements, bug reports) are also welcome — open an issue or PR.

---

## License

MIT — use freely, build boldly.

---

_VibeKit — Built by [JB (Muke Johnbaptist)](https://jb.desishub.com) · [Desishub Technologies](https://desishub.com)_
