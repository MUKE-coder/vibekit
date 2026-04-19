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
| **Burning tokens**                | $100–$200 per project because AI rewrites boilerplate every time (auth, tables, forms, uploads) | JB Component Registry covers the big primitives — AI installs and wires up instead of writing from scratch (saves 60–80% tokens)          |
| **Getting stuck in loops**        | AI tries the same broken fix repeatedly, context gets polluted, progress stalls                 | Phase-based build (`project-phases.md`) + rescue prompts in `prompt-engineering.md` + `troubleshooting.md` playbook                       |
| **No plan, no clarity**           | Starting with "build me a SaaS" and hoping for the best                                         | Claude interviews you first, generates `project-description.md` + `project-phases.md` — a clear blueprint before a single line is written |
| **Tech stack chaos**              | AI picks a different stack every project — jsPDF here, Drizzle there, useEffect for data        | Master prompt locks the stack: Next.js 16 + Prisma v7 + React Query + Zod + @react-pdf/renderer + xlsx — always                           |
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
| Authentication | Better Auth                  | Secure, extensible, Prisma-compatible                        |
| Data Fetching  | React Query + Fetch API      | Caching, refetching, loading states built-in                 |
| API Layer      | API Routes (Route Handlers)  | Server-side logic via Next.js App Router                     |
| Validation     | Zod + React Hook Form        | Type-safe validation on client and server                    |
| PDF Generation | @react-pdf/renderer          | React components to PDF, full styling control                |
| Excel Export   | xlsx                         | Read/write Excel files, lightweight and reliable             |
| File Storage   | Cloudflare R2 or UploadThing | R2 for S3-compatible storage, UploadThing for simple uploads |
| Email          | Resend + React Email         | Best DX, great deliverability                                |
| Payments       | Stripe                       | Industry standard, webhook-driven                            |
| Styling        | Tailwind CSS v4 + shadcn/ui  | AI knows these patterns well                                 |
| Deployment     | Vercel                       | One-click, preview URLs, zero config                         |
| Domain & DNS   | Cloudflare                   | Free SSL, fast DNS, easy management                          |
| Components     | JB Component Registry        | Production-ready shadcn components                           |

> **File Uploads — R2 vs UploadThing:**
>
> - **Cloudflare R2 / AWS S3** — Full control, large files, S3-compatible workflows.
> - **UploadThing** — Simpler setup, great for image uploads. Follow the [UploadThing setup guide](https://jb.desishub.com/blog/image-upload-with-uploadthing).
>   Choose based on your project needs.

---

## How To Use This Framework

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

- [`master_prompt.md`](./master_prompt.md) — Tech stack rules, Prisma v7 patterns, coding standards
- [`jb-components.md`](./jb-components.md) — JB component registry reference (when to use each)

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
├── master_prompt.md             ← Coding standards for Claude Code (copy to your project)
├── design-style-guide.md        ← Design style guide template (Claude customizes per project)
├── jb-components.md             ← JB component registry reference (copy to your project)
│
├── prompt-engineering.md        ← Token economy, prompt formula, rescue system
├── deployment.md                ← Vercel, Netlify, VPS, Cloudflare, SSL
├── environment-variables.md     ← Step-by-step for every secret
├── database-guide.md            ← Neon, Prisma, schema patterns, migrations
├── design-system-guide.md       ← Design principles, color palettes, component styles
├── troubleshooting.md           ← Symptoms → fixes, AI rescue protocols
├── monetization-guide.md        ← Stripe, webhooks, feature gating, billing
│
└── templates/
    ├── design-system.md
    ├── prd-saas.md
    ├── prd-ecommerce.md
    └── prd-school.md
```

### Files to copy into your project

When starting a new project, copy these from the VibeKit repo into your project root:

| File               | Purpose                                                  |
| ------------------ | -------------------------------------------------------- |
| `master_prompt.md` | Claude Code reads this first — tech stack + coding rules |
| `jb-components.md` | Reference for when to install which JB component         |

Claude (in the planning step) will generate `project-description.md`, `project-phases.md`, `design-style-guide.md`, and `prompt.md` for you.

---

## JB Component Registry

**Registry Reference:** [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)

**Framework Reference:** [`jb-components.md`](./jb-components.md) — Detailed guide with install commands, env vars, prerequisites, and when-to-use for each major component.

Production-ready shadcn components for auth, data tables, forms, file uploads, e-commerce, and more. Claude Code checks `jb-components.md` before building features from scratch.

---

## Contributing

If you build something with this framework and want to contribute a template, component suggestion, or improvement — PRs are welcome.

---

## License

MIT — use freely, build boldly.

---

_VibeKit — Built by [JB (Muke Johnbaptist)](https://jb.desishub.com) · [Desishub Technologies](https://desishub.com)_
