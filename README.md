# VibeKit Framework — Build Production Apps with Claude Code

> A structured framework for building production-grade Next.js apps with Claude Code/Any agent — without burning tokens, shipping broken code, or getting stuck.

**By JB (Muke Johnbaptist) · [jb.desishub.com](https://jb.desishub.com) · Desishub Technologies**

[![npm version](https://img.shields.io/npm/v/vibekit-framework?color=%234F46E5&label=vibekit-framework)](https://www.npmjs.com/package/vibekit-framework)
[![npm downloads](https://img.shields.io/npm/dm/vibekit-framework?color=%234F46E5)](https://www.npmjs.com/package/vibekit-framework)
[![license](https://img.shields.io/npm/l/vibekit-framework?color=%234F46E5)](./LICENSE)

```bash
npx vibekit-framework init
```

---

## What Is VibeKit Framework?

VibeKit ships in two halves that work together:

1. **The framework** — a set of markdown prompts and reference guides that make your AI agent build production-grade Next.js apps (this repo, and the docs site at [vibekit.desishub.com](https://vibekit.desishub.com)).
2. **The [`vibekit-framework`](https://www.npmjs.com/package/vibekit-framework) npm package** — the one-command installer that drops the framework into any project. `npx vibekit-framework init` copies `master_prompt.md`, `jb-components.md` and `pre-deploy-review.md` into your project root **and** installs the rules file for your agent (Claude Code, Cursor, Codex, Cline, Windsurf, Gemini CLI, Aider, Continue, Cody or Junie) so they auto-load every session. Zero dependencies, runs offline, never overwrites your edits, safe to re-run. → [CLI docs](./cli/README.md)


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

### Step 0.5 — Give your agent superpowers (installed for you)

Two tools compound the framework's value on every project:

1. **`ui-ux-pro-max-skill`** — a Claude Code skill that auto-loads senior-designer rules (type rhythm, spacing, motion, contrast) into every conversation.
2. **Playwright MCP** — gives the agent a real browser via the Model Context Protocol. It can navigate, click, fill forms, and read the page's accessibility tree as structured snapshots — so **the agent can verify its own UI work** (open the page it just built, check it renders, exercise the flow) instead of you checking by hand.

**You don't install these manually — `npx vibekit-framework init` (Step 6) does it for you.** It registers the Playwright MCP by merging a project `.mcp.json` (non-destructively, opt out with `--no-mcp`), and clones the ui-ux-pro-max-skill into `~/.claude/skills/` for Claude Code (best-effort — needs git + network; opt out with `--no-skills`).

For manual setup or non-Claude agents (Cursor, Cline, Codex, Windsurf), see [`agent-tooling.md`](./agent-tooling.md).

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

### Step 6 — Run `npx vibekit-framework init`

From your project root:

```bash
npx vibekit-framework init
```

One command installs everything you'd otherwise copy by hand:

| Installed | What it is |
|---|---|
| [`master_prompt.md`](./master_prompt.md) | Tech stack rules, Prisma v7 patterns, coding standards |
| [`jb-components.md`](./jb-components.md) | JB component registry reference (when to use each) |
| [`pre-deploy-review.md`](./pre-deploy-review.md) | The pre-deploy security + performance audit prompt |
| [`pre-design-review.md`](./pre-design-review.md) | The UI/UX design audit prompt (checks the app against your style guide) |
| Your agent's rules file | Auto-loads the framework rules every session |

It detects your agent (Claude Code, Cursor, Codex, Cline, Windsurf, Gemini CLI,
Aider, Continue, Cody, Junie), never overwrites files you've edited, and is safe
to re-run after an upgrade. Useful flags:

```bash
npx vibekit-framework init --agent all    # write every agent's rules file
npx vibekit-framework init --global       # Claude skill in ~/.claude, not the project
npx vibekit-framework init --force        # overwrite existing files
npx vibekit-framework init --yes          # no prompts (CI)
```

Full CLI docs: [`cli/README.md`](./cli/README.md). Prefer to install by hand?
Copy the three files above yourself and follow [`skill/README.md`](./skill/README.md).

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
├── CLAUDE.md                    ← Rules for agents working ON this repo (not for your project)
├── master_prompt.md             ← Coding standards for your project (installed by `npx vibekit-framework init`)
├── design-style-guide.md        ← Design style guide template (Claude customizes per project)
├── jb-components.md             ← JB component registry reference (copy to your project)
├── pre-deploy-review.md         ← Paste into Claude Code before deploying — security/perf/Redis/WebVitals audit
├── pre-design-review.md         ← Paste into your agent after a UI is built — design audit vs your style guide
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
├── ai-guide.md                  ← Vercel AI SDK + pgvector RAG + credit packs
├── agent-tooling.md             ← ui-ux-pro-max-skill + Playwright MCP (installed by init)
├── vibekit-primitives.md        ← Roadmap: 150 primitives — 100% production coverage ✨ (144 via GitHub registry + 6 graduated to JB legacy)
├── nextjs-reusable-library-150.md ← The 150-item source list the registry was built from
├── vibekit-code-review.md       ← Code-review prompt
├── CONTRIBUTING.md              ← How to add a primitive to the registry
│
├── registry.json                ← Root index for the GitHub registry
├── registry/                    ← Source for installable primitives (auth/hooks/utilities/...)
│   └── INDEX.md                 ← Discovery index: every primitive + its TRIGGER phrases
├── cli/                         ← `npx vibekit-framework init` — installs the framework into a project
├── skill/                       ← SKILL.md + AGENTS.md (the agent rules the CLI installs)
├── setup-prompts/               ← Per-OS environment-check prompts (macos/windows/linux)
├── web/                         ← vibekit.desishub.com — the landing + docs site
├── demo/                        ← Smoke-test app that installs every primitive
├── public-templates/            ← Starter templates
├── articles/                    ← Long-form writeups
└── .claude/commands/            ← /vibekit-find, /redesign-from-image
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

## Pre-Design Review

The visual counterpart to the code review. Run [`pre-design-review.md`](./pre-design-review.md) after a UI is built to audit **how the app looks and feels** — it compares the built screens against your own `design-style-guide.md` **and** a set of universal design principles (synthesized from Nielsen Norman Group, the Webflow design-system checklist, and classic design fundamentals):

- **System fidelity** — colors/type/spacing/components that drift from your style guide
- **Hierarchy, layout, whitespace, typography, color & contrast (WCAG AA)**
- **Interaction states** — the eight-state contract (hover, focus, loading, error, success, …)
- **Accessibility & responsive safety** — keyboard, focus rings, 375px, no horizontal scroll
- **Copy integrity** — flags fabricated metrics/testimonials (a liability, treated as Critical)

With the **Playwright MCP** (installed by `npx vibekit-framework init`), the agent opens the rendered pages in a real browser and judges the actual result, not just the JSX. Findings go to `pre-design-review-report.md`; fixes use your design tokens.

---

## Component Registry — JB + VibeKit In-House

**JB Registry Reference:** [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)

**VibeKit In-House Registry:** [vibekit.desishub.com/components](https://vibekit.desishub.com/components) — Components built and maintained as part of the framework. Hosted at `vibekit.desishub.com/r/{slug}.json`.

**Framework Reference:** [`jb-components.md`](./jb-components.md) — Detailed guide with install commands, env vars, prerequisites, and when-to-use for every component (JB + in-house).

Production-ready shadcn components for auth, data tables, forms, file uploads, e-commerce, Stripe checkout, MDX blogs, API docs, kanban boards, org/team UI, charts dashboards, multi-step wizards, rich text editors, command palettes, notification centers, file managers, printable templates, and SaaS pricing/billing/subscription/token UIs. Claude Code (and Cursor, Cline, Codex) checks `jb-components.md` before building features from scratch.

### VibeKit Primitives (GitHub registry — new)

The big component registry above ships **feature units** (Kanban Board, Stripe UI, Charts Grid, etc.). The new **VibeKit Primitives** library at [`vibekit-primitives.md`](./vibekit-primitives.md) ships **small building blocks** (typed hooks, helpers, single-file components) every CRM / ERP / SaaS rebuilds — `useCurrentUser`, `useTableState`, `EmptyState`, `useConfirm()`, `formatters`, `env-validator`, etc.

Install via the shadcn GitHub-registry syntax:

```bash
pnpm dlx shadcn@latest add MUKE-coder/vibekit/use-current-user
pnpm dlx shadcn@latest add MUKE-coder/vibekit/empty-state
pnpm dlx shadcn@latest add MUKE-coder/vibekit/formatters
```

Phases 1–11 shipped (150 / 150 ✨ — all sixteen categories complete). Roadmap of all 150 in [`vibekit-primitives.md`](./vibekit-primitives.md). Two install paths: GitHub registry (144 items) and JB legacy registry (6 feature units). Browse all from the CLI:

```bash
pnpm dlx shadcn@latest list MUKE-coder/vibekit
pnpm dlx shadcn@latest view MUKE-coder/vibekit/use-table-state
```

### Discovery for AI agents

The big problem with a 150-item registry: agents don't know it exists. They generate from training data instead of installing what's already built. VibeKit fixes this at three layers:

- **[`registry/INDEX.md`](./registry/INDEX.md)** — a flat, grep-friendly catalogue. Every primitive listed with **TRIGGER** phrases (problem-shape keywords) so agents pattern-match before writing code.
- **[`skill/SKILL.md`](./skill/SKILL.md)** + **[`skill/AGENTS.md`](./skill/AGENTS.md)** — hard rule in the agent's auto-loaded rules: *"Before writing any hook / helper / single-file component, grep `registry/INDEX.md`."* Examples baked in: "filter by status + date range" → install `use-filters` + `filter-bar`. "auto-save the form" → install `form-autosave`. Etc.
- **`/vibekit-find <query>`** — Claude Code slash command at [`.claude/commands/vibekit-find.md`](./.claude/commands/vibekit-find.md). The agent runs grep against INDEX.md and returns top 5 install commands.

### Smoke-test app

The audit pass found 22 install-time / first-render bugs that the registry never sees on its own. The [`demo/`](./demo) folder is a real Next.js app that installs and exercises every primitive — every release passes through `pnpm tsc --noEmit && pnpm build` on the demo before tagging. See [`demo/README.md`](./demo/README.md) for the page-to-primitive mapping and [`demo/PHASES.md`](./demo/PHASES.md) for the build phases.

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
