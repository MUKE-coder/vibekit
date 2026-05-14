# Contributing to VibeKit

Thanks for considering a contribution. VibeKit is community-driven — every component in the registry was built by someone shipping with AI agents in production.

This guide covers the most common contribution: **adding a new component to the JB Component Registry**. Other contributions (docs fixes, bug reports, framework refinements) are also welcome — open an issue or PR.

---

## Table of contents

1. [What makes a good VibeKit component](#what-makes-a-good-vibekit-component)
2. [The contribution workflow](#the-contribution-workflow)
3. [The component schema](#the-component-schema)
4. [Quality checklist](#quality-checklist)
5. [PR review timeline](#pr-review-timeline)
6. [Other contributions](#other-contributions)

---

## What makes a good VibeKit component

A VibeKit component is **production-ready, opinionated, and reusable across projects**. Examples in the registry today: Better Auth UI, Stripe UI, File Storage UI, Data Table, MDX Blog, DGateway Shop.

### Good fit

- **Solves a recurring need** — auth, payments, file uploads, data tables, dashboards, AI features, search, charts.
- **Self-contained** — installs with one `pnpm dlx shadcn@latest add <url>` and works on a fresh Next.js 16 project.
- **Documented** — has a doc page (your blog, your GitHub README, anywhere accessible) explaining usage.
- **Aligned with the stack** — Next.js 16 App Router, TypeScript, Tailwind v4, shadcn/ui, Prisma v7 if it touches the DB.

### Not a good fit

- Personal one-off components for a single project.
- Wrappers around existing JB components.
- Components that require a custom backend not commonly used (e.g. a proprietary CMS).
- Components that overlap with existing entries (check `/components` first).

---

## The contribution workflow

### 1. Build & host the component

Build the component and publish it to a shadcn-compatible registry. Your own domain works:

```
https://yourdomain.com/r/your-component.json
```

The registry JSON should follow the [shadcn registry spec](https://ui.shadcn.com/docs/registry). Verify:

```bash
pnpm dlx shadcn@latest add https://yourdomain.com/r/your-component.json
```

works end-to-end on a fresh Next.js 16 project.

### 2. Write a doc page

Document what the component does. Anywhere accessible works:

- A blog post on your own site
- A GitHub README in the component's repo
- A Notion page (public)
- A page in the JB component blog (`https://jb.desishub.com`)

This becomes the **"Read full guide"** link on the component's detail page.

### 3. Open a pull request

Fork the repo:

```bash
git clone https://github.com/MUKE-coder/vibekit.git
cd vibekit
git checkout -b add-<component-slug>
```

Edit `web/src/lib/components-data.ts`. Append a new entry to the `components` array using [the schema below](#the-component-schema).

Commit and push:

```bash
git add web/src/lib/components-data.ts
git commit -m "Add <Component Name> to the registry"
git push origin add-<component-slug>
```

Open a PR. The `new-component.md` template will walk you through the checklist.

### 4. Review & merge

We review weekly. Most PRs need one or two iterations on copy, schema, or installation testing. Once merged:

- Your component appears at `https://vibekit.desishub.com/components/<slug>`
- It's listed in `jb-components.md`, which every Claude Code session reads
- It becomes part of the agent's default toolkit across thousands of builds

---

## The component schema

All component metadata lives in one file: `web/src/lib/components-data.ts`. Append your entry to the `components` array.

```ts
{
  slug: "my-component",
  name: "My Component",
  tagline: "One sentence — what it does, who it's for.",
  category: "data", // auth | marketing | data | commerce | files | content | api | forms | hero | saas | productivity | team | documents | animation
  categoryLabel: "Data",
  install: "pnpm dlx shadcn@latest add https://your-registry.com/r/my-component.json",
  blogUrl: "https://your-domain.com/blog/my-component",

  prerequisites: [
    "Next.js 16 + shadcn/ui",
    "PostgreSQL database",
    // anything else that must be set up first
  ],

  envVars: [
    { name: "MY_API_KEY", description: "Where to get it (e.g. service dashboard)" },
    // omit this field entirely if no env vars are needed
  ],

  features: [
    "Bullet point — what it does (a feature, not marketing fluff)",
    "Another bullet",
    "3–6 bullets total is the sweet spot",
  ],

  whenToUse: "One sentence describing the project type or use case where this is the right tool.",
  whenNotToUse: "One sentence describing when a different approach is better.",

  filesAdded: [
    "/route-it-creates",
    "/api/endpoint-it-adds",
    "components/component-name.tsx",
    "Prisma schema additions: ModelName",
    // list every file or route the install command produces
  ],
}
```

### Field-by-field

| Field | Description |
|---|---|
| `slug` | URL-safe identifier. Becomes `/components/<slug>`. Lowercase, hyphens, no spaces. |
| `name` | Display name. Title case. Brief — "JB Better Auth UI" beats "The JB Better Auth UI Component System". |
| `tagline` | One sentence under 100 characters. What it does + who it's for. |
| `category` | One of: `auth` \| `marketing` \| `data` \| `commerce` \| `files` \| `content` \| `api` \| `forms` \| `hero` \| `saas` \| `productivity` \| `team` \| `documents` \| `animation`. Propose a new one in the PR if none fit. |
| `categoryLabel` | Display label for the category. |
| `install` | The exact command users run. Must be tested on a fresh Next.js 16 project. |
| `blogUrl` | URL to a doc page explaining usage. |
| `prerequisites` | Things that must exist before installing (database, other components, accounts). Optional. |
| `envVars` | Each env var with name + description of where to obtain it. Omit field if none. |
| `features` | 3–6 bullet points describing capabilities. No marketing fluff. |
| `whenToUse` / `whenNotToUse` | One sentence each. Honest about tradeoffs. |
| `filesAdded` | Every route, API endpoint, component, and schema change the install creates. **This is the most-checked field — be exhaustive.** |

### Adding a new category

If your component doesn't fit any existing category, propose a new one in your PR. Add it to:

1. The `ComponentCategory` type in `components-data.ts`
2. The `categories` array (with a label)

We'll discuss in the PR whether the new category is the right call.

---

## Quality checklist

Before you open the PR, confirm:

- [ ] Component is production-ready and documented (not a half-built prototype).
- [ ] Install command works end-to-end on a fresh Next.js 16 project.
- [ ] Schema entry includes every required field.
- [ ] `filesAdded` is accurate — every route, API, component, schema change.
- [ ] Env vars are enumerated with where to obtain them.
- [ ] Component category fits one of the existing categories OR you propose a new one in the PR.
- [ ] Component does not duplicate an existing JB component (check `/components` first).
- [ ] Doc page (`blogUrl`) exists and is publicly accessible.

---

## PR review timeline

- **First response:** within 7 days
- **Typical merge:** 1–2 iterations of feedback
- **Reasons we'd reject:** duplicates an existing component, doesn't follow the stack (e.g. uses Drizzle, Mongo, jsPDF), no doc page, install command doesn't work cleanly

If we reject, we'll explain why and suggest where it might land instead.

---

## Other contributions

### Documentation fixes

Spot a typo, broken link, outdated screenshot? Open a PR directly — no schema needed.

### Framework refinements

Have an opinion on the master prompt, design system, or pre-deploy review? Open a [Discussion](https://github.com/MUKE-coder/vibekit/discussions) first so we can align before code changes.

### Bug reports

Open an [Issue](https://github.com/MUKE-coder/vibekit/issues) with:

- What you were doing
- What you expected
- What happened instead
- Your environment (OS, Node version, agent)

---

## Code of conduct

Be respectful, be honest, ship things. No corporate spam, no AI-generated marketing copy in PR descriptions, no drive-by "this should support X" issues without context.

VibeKit is a small project. We're optimizing for **quality of components** over quantity of contributors.

---

## Questions?

- [GitHub Discussions](https://github.com/MUKE-coder/vibekit/discussions)
- Reach out to JB on [Twitter](https://twitter.com/jbwebdeveloper) or via [jb.desishub.com](https://jb.desishub.com)

Thanks for shipping with us.

— JB & contributors
