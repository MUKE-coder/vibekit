# VibeKit — Build Production Apps with Claude Code

> A structured framework for building production-grade Next.js apps with Claude Code — without burning tokens, shipping broken code, or getting stuck.

**By JB (Muke Johnbaptist) · [jb.desishub.com](https://jb.desishub.com) · Desishub Technologies**

---

## What Is VibeKit?

VibeKit is a **planning + building system** for vibe coders who use Claude Code to build real Next.js applications. It gives you:

- A **master prompt** that makes Claude Code write production-quality code (not AI slop)
- A **planning workflow** that generates 3 project files from your app idea
- **Reference guides** for database, deployment, environment variables, design, payments, and troubleshooting
- A **Claude Code skill** that enforces the framework standards automatically

---

## The Standard Tech Stack

Every project built with this framework uses this stack. Do not deviate unless the user has a specific reason.

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | Latest App Router with React 19 |
| Language | TypeScript 5.9 | Type safety, better DX |
| Database | Neon — Serverless Postgres | Free tier, instant setup, serverless scale |
| ORM | Prisma v7 | Type-safe, AI reads schema easily |
| Authentication | Better Auth | Secure, extensible, Prisma-compatible |
| Data Fetching | React Query + Fetch API | Caching, refetching, loading states built-in |
| API Layer | API Routes (Route Handlers) | Server-side logic via Next.js App Router |
| Validation | Zod + React Hook Form | Type-safe validation on client and server |
| PDF Generation | @react-pdf/renderer | React components to PDF, full styling control |
| Excel Export | xlsx | Read/write Excel files, lightweight and reliable |
| File Storage | Cloudflare R2 or UploadThing | R2 for S3-compatible storage, UploadThing for simple uploads |
| Email | Resend + React Email | Best DX, great deliverability |
| Payments | Stripe | Industry standard, webhook-driven |
| Styling | Tailwind CSS v4 + shadcn/ui | AI knows these patterns well |
| Deployment | Vercel | One-click, preview URLs, zero config |
| Domain & DNS | Cloudflare | Free SSL, fast DNS, easy management |
| Components | JB Component Registry | Production-ready shadcn components |

> **File Uploads — R2 vs UploadThing:**
> - **Cloudflare R2 / AWS S3** — Full control, large files, S3-compatible workflows.
> - **UploadThing** — Simpler setup, great for image uploads. Follow the [UploadThing setup guide](https://jb.desishub.com/blog/image-upload-with-uploadthing).
> Choose based on your project needs.

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

### Step 5 — Get your 3 project files

Claude will generate:

| File | Purpose |
|---|---|
| `project-description.md` | Complete description of your app — features, data model, pages, design direction |
| `project-phases.md` | Build blueprint with phases, tasks, and dependencies |
| `prompt.md` | The prompt you paste into Claude Code to start building |

Save all 3 files into your project root folder.

### Step 6 — Copy the master prompt

Copy [`master_prompt.md`](./master_prompt.md) from this repository into your project root. This is the coding standard Claude Code will follow.

### Step 7 — Start building with Claude Code

Open Claude Code in your project directory and paste the contents of `prompt.md`. Claude Code will:

1. Read your master prompt, project description, and build phases
2. Start with Phase 1 (Foundation)
3. Stop after each phase for your confirmation
4. Follow the design system and coding standards exactly

---

## Framework Files

```
vibekit/
├── README.md                    ← You are here
├── CLAUDE_PROMPT.md             ← Paste this into Claude to plan your project
├── master_prompt.md             ← Coding standards for Claude Code (copy to your project)
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

---

## JB Component Registry

**Registry Reference:** [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)

Production-ready shadcn components for auth, data tables, forms, file uploads, e-commerce, and more. The master prompt instructs Claude Code to use these when applicable.

---

## Contributing

If you build something with this framework and want to contribute a template, component suggestion, or improvement — PRs are welcome.

---

## License

MIT — use freely, build boldly.

---

*VibeKit — Built by [JB (Muke Johnbaptist)](https://jb.desishub.com) · [Desishub Technologies](https://desishub.com)*
