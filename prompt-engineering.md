# Prompt Engineering for Vibe Coders

> The difference between a messy, broken build and a clean production app is not the complexity — it is the quality of your prompts.

---

## Table of Contents

1. [What Is Prompt Engineering?](#what-is-prompt-engineering)
2. [The Token Economy — Why Your Wallet Depends on This](#the-token-economy)
3. [How Claude Code & V0 Actually Read Your Prompts](#how-lovable-reads-prompts)
4. [The 5-Part Pro Prompt Formula](#the-5-part-pro-prompt-formula)
5. [Context Loading — The Most Powerful Technique](#context-loading)
6. [The PRD Method — Guide AI Through an Entire Project](#the-prd-method)
7. [Prompt Templates by Situation](#prompt-templates-by-situation)
8. [The Claude Code vs V0 Decision Framework](#lovable-vs-v0-decision-framework)
9. [Anti-Patterns — What Never to Do](#anti-patterns)
10. [Advanced Techniques](#advanced-techniques)
11. [The Rescue System — When AI Gets Stuck](#the-rescue-system)

---

## What Is Prompt Engineering?

Prompt engineering is the practice of writing instructions for AI tools in a way that produces the result you actually want — efficiently, on the first try, without wasting tokens or triggering loops.

For vibe coders using Claude Code, prompt engineering is the single most important skill. It determines:

- **How much you spend** — bad prompts burn 3–5x more tokens than good ones
- **How fast you build** — good prompts produce working code on the first attempt
- **How stuck you get** — vague prompts create vague code that breaks in unpredictable ways
- **How consistent your app looks** — unfocused prompts produce inconsistent UI

The mental model: **think of Claude Code as a very capable contractor who charges by the hour.** The clearer and more complete your brief, the less time it wastes rereading, clarifying, and redoing work.

---

## The Token Economy

Understanding tokens is understanding money.

### What Is a Token?

A token is roughly 4 characters of text, or about ¾ of a word. When you write a prompt to Claude Code, every word costs tokens. When Claude Code reads your existing codebase to understand context, every line of code costs tokens. When Claude Code writes new code back, every line it generates costs tokens.

**Tokens = Money. The more tokens, the higher your bill.**

### Where Most Tokens Go (And Are Wasted)

| Source | % of Token Usage | Controllable? |
|---|---|---|
| AI reading your existing codebase | ~35% | Partly — keep code clean |
| AI writing new code from scratch | ~40% | Yes — use pre-built components |
| AI re-reading context after errors | ~15% | Yes — better prompts prevent errors |
| Your prompt text | ~10% | Yes — be concise and specific |

### The Pre-Built Component Advantage

When you ask Claude Code to "add authentication", without a pre-built component it must:

1. Design the auth pages
2. Write the login form
3. Write the signup form
4. Write password reset logic
5. Write session management
6. Write the database schema
7. Write the API routes
8. Test and debug all of the above

That is roughly **800–1,200 lines of code written from scratch**, costing 3,000–5,000 tokens in generation alone.

When you install `Better Auth UI` first and then tell Claude Code to use it, Claude Code only needs to:

1. Read the existing component (~300 tokens to understand)
2. Wire it to your database (~100 tokens)

**Total: ~400 tokens. Saving: ~4,600 tokens. Per feature.**

Multiply this across auth, data tables, forms, payments, and file uploads — and the difference between a $20 build and a $200 build becomes clear.

---

## How Claude Code Reads Your Prompts

Claude Code processes your prompt in this order:

1. **Reads your entire codebase** (existing files) for context
2. **Reads your prompt** top to bottom
3. **Plans the changes** it will make
4. **Writes the code** and shows you the result

This means:

- **What comes first in your prompt matters most** — put the most important constraint at the top
- **Claude Code will try to be helpful beyond what you asked** — be explicit about what NOT to do
- **Long codebases = expensive reads** — the more existing code, the more tokens spent just reading
- **Multiple small prompts beat one giant prompt** — each prompt is focused, cheaper, and easier to undo if wrong

### The Single Responsibility Rule for Prompts

Each prompt should do **one thing**. Not "build auth, set up the database, create the dashboard, add the data table, and style the sidebar." That is five prompts pretending to be one.

**Wrong:**
```
Build me a complete SaaS app with authentication, a dashboard, user management, 
billing with Stripe, email notifications, and deploy it to Vercel.
```

**Right (Phase 1 only):**
```
I am building a project management SaaS. The design system is: [paste design system].
Install the Better Auth UI component and connect it to my Neon database. 
Set up login, signup, and Google OAuth only. 
Do not build any other pages yet.
```

---

## The 5-Part Pro Prompt Formula

Every effective Claude Code prompt has five parts. You do not need to label them — but you need all five.

```
[1. CONTEXT]   What project is this, what phase are we in, what already exists
[2. GOAL]      The single specific thing this prompt must achieve
[3. COMPONENT] The JB component to use (install command if new)
[4. SPEC]      The exact details — pages, fields, schema, routes, style
[5. CONSTRAINT] What NOT to do, what NOT to touch
```

### Example: Adding a Data Table

**Bad prompt:**
```
Add a data table to show all users.
```

**Pro prompt using the formula:**
```
[CONTEXT]
This is a SaaS project management app built with Next.js. Phase 2 is in progress. 
Authentication with Better Auth is already working. The Neon database has a Prisma 
schema with a User model and a Project model.

[GOAL]
Add a data table to the /dashboard/users page that displays all users.

[COMPONENT]
First, install the Data Table component:
pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json

Read the installed component before writing any code.

[SPEC]
The table should display these columns: Name, Email, Role, Created Date, Status.
Include search by name or email.
Include pagination (10 rows per page).
Include a column visibility toggle.
Fetch users from a GET /api/users route you will also create.
The API route should query all users from the Prisma User model.

[CONSTRAINT]
Do not modify the authentication setup.
Do not change the Prisma schema.
Do not touch any other pages.
Match the existing design system: white cards, border-slate-200, rounded-xl.
```

This prompt costs more tokens to write — but produces a working result on the first try, saving 3–5 failed attempts that each cost 500–800 tokens.

---

## Context Loading

Context loading is the practice of **telling Claude Code everything it needs to know at the start of each session** before asking it to do anything.

Because Claude Code has no memory between sessions, every new chat starts cold. If you jump straight to "add a payment page", Claude Code will guess what your app looks like, how your auth works, and what your database looks like — and it will guess wrong.

### The Context Loading Template

Paste this at the start of every new Claude Code session:

```
PROJECT CONTEXT — read this before doing anything.

Project name: [Your App Name]
What it does: [1–2 sentence description]
Current build phase: Phase [X] — [phase name]

Tech stack:
- Framework: Next.js 16 (App Router)
- Database: Neon Postgres + Prisma
- Auth: Better Auth UI (already installed and working)
- Data Fetching: React Query + Fetch API
- API: API Routes (Route Handlers) — all data goes through API routes
- Validation: Zod
- PDF: @react-pdf/renderer (always)
- Excel: xlsx (always)
- Styling: Tailwind CSS + shadcn/ui

Design system:
- Primary color: [hex]
- Style: Professional, clean, similar to Linear/Notion
- No purple gradients, no neon effects
- Cards: bg-white border border-slate-200 shadow-sm rounded-xl

What is already built:
- [List what works: auth, dashboard, specific pages, API routes]

What I need you to do in this session:
- [Single specific task — do not list multiple]

Rules for this session:
- Do not modify the authentication setup
- Do not change the Prisma schema unless I explicitly ask
- Match the existing design system exactly
- Ask me before making changes to more than 3 files at once
```

### Why This Works

- Claude Code spends fewer tokens guessing context
- Every change respects the existing architecture
- The design system is locked from the first message
- The single-task rule keeps the session focused and cheap

---

## The PRD Method

A PRD (Product Requirements Document) is a detailed written description of your entire app that you paste as your **very first message** in a new Claude Code project.

Instead of building feature by feature with no plan, the PRD gives Claude Code a complete picture of what you are building, so every individual prompt later is just an execution step — not a new discovery.

### PRD Template

```
PRODUCT REQUIREMENTS DOCUMENT

App name: [Name]
One-line description: [What it does in one sentence]

WHO IT IS FOR
Primary user: [Describe the main user]
Secondary user (if any): [Admin, client, guest, etc.]

WHAT THE APP MUST DO (Core Features)
1. [Feature 1 — be specific. Not "user management" but "users can sign up with email or Google, 
   update their profile photo and name, and delete their account"]
2. [Feature 2]
3. [Feature 3]
4. [Feature 4 if applicable]

USER ROLES
- [Role 1] can: [list permissions]
- [Role 2] can: [list permissions]

DATA MODEL (what needs to be stored)
- [Entity 1]: fields are [list]
- [Entity 2]: fields are [list]
- [Relationships: e.g. "A Project belongs to a User. A Task belongs to a Project."]

PAGES TO BUILD
1. / (Landing page) — [describe]
2. /login — [describe]
3. /dashboard — [describe]
4. /dashboard/[page] — [describe]
[Continue for all pages]

DESIGN DIRECTION
- Colors: [primary hex, background, text]
- Feel: [3 words: e.g. "clean, professional, fast"]
- Inspired by: [e.g. "Notion's sidebar, Linear's table view"]
- NO: [things to avoid]

OUT OF SCOPE FOR VERSION 1
- [Feature you do not want built yet]
- [Feature you do not want built yet]

TECH STACK
- Framework: Next.js 16 (App Router)
- Database: Neon Postgres + Prisma
- Auth: Better Auth UI (JB Registry)
- Email: Resend
- PDF: @react-pdf/renderer (always use this for PDF generation)
- Excel: xlsx (always use this for spreadsheet export)
- Data Fetching: React Query + Fetch API (always)
- API: API Routes (Next.js Route Handlers) — all data through API routes
- Validation: Zod (always use for request/form validation)
- File Storage: [Cloudflare R2 / UploadThing] — ask user preference
- Payments: [Stripe / None]
- Deployment: Vercel
```

### How to Use the PRD

1. Fill in the PRD template for your app
2. On your first Claude Code message in Phase 1, paste the full PRD before any other instruction
3. Tell Claude Code: *"Read this PRD. We will build in phases. In this first session, only do Phase 1: install Better Auth UI, connect Neon, and set up the base layout. Do not build any other features yet."*
4. For each subsequent session, refer back to the PRD: *"Referring to the PRD I shared at the start, now let's build the [feature]."*

---

## Prompt Templates by Situation

Copy, fill in the brackets, and paste directly into Claude Code or V0.

### Starting a New Project

```
I am starting a new Next.js SaaS project. Here is the PRD:

[PASTE FULL PRD]

Phase 1 only. Do the following in this session:

1. Install Better Auth UI:
   pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json
   Read the installed component before proceeding.

2. Connect the Neon database. The DATABASE_URL will be set as an environment variable.

3. Update the Prisma schema for this app. Based on the PRD, the initial models needed are:
   [List the models from your PRD data model section]

4. Create the base app layout with a sidebar and top navigation. Use this design system:
   Primary: [hex]. Cards: bg-white border border-slate-200 shadow-sm rounded-xl.
   No purple gradients. Professional B2B feel like Linear or Notion.

5. Make sure login, signup, and the protected /dashboard route all work.

Stop after Phase 1. Do not build any feature pages yet.
```

### Adding a Page with a Data Table

```
Add the [Page Name] page at [/path].

First install the Data Table component:
pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json

Read the component before writing any code.

This page should:
- Fetch [model name] records from the database
- Display them in the Data Table component with columns: [list columns]
- Include search by [field name]
- Include pagination at [X] rows per page

Create a GET /api/[model] route that:
- Requires authentication (redirect to /login if no session)
- Queries all [model] records from Prisma
- Returns JSON

Do not touch: authentication setup, other pages, Prisma schema changes.
Match the existing design system.
```

### Adding a Form

```
Add a form to [create/edit] a [model name] at [/path].

First install the Multi Step Form component (if this form has more than 4 fields):
pnpm dlx shadcn@latest add https://jb.desishub.com/r/multi-step-form.json

The form should have these fields:
- [Field name]: [type — text/number/select/date/file] — [required/optional]
- [Field name]: [type] — [required/optional]

On submit, it should call a POST /api/[model] route that:
- Validates all required fields
- Creates a new [model] record in the Prisma database
- Returns the created record or an error
- Requires authentication

After successful submission, redirect to [/path].
Show a success toast notification.
Show validation errors inline below each field.

Do not change: authentication, other pages, existing API routes.
```

### Fixing a Broken Page

```
The page at [/path] has a problem: [describe the exact problem].

Do not change any of the following:
- Authentication setup
- Prisma schema or database files
- API routes
- Any other pages

Only fix the issue in the component file for this page.

The design system is:
- Primary: [hex]
- Cards: bg-white border border-slate-200 shadow-sm rounded-xl
- No purple gradients

Here is the current component code:
[PASTE THE COMPONENT CODE]

Make the smallest possible fix. Show me what changed and why.
```

### Asking V0 for a Component Design

```
Design a [component name] component for a [describe app type] SaaS application.

Design requirements:
- Style: professional, clean, similar to [Notion / Linear / Vercel dashboard]
- Primary color: [hex]
- Use Tailwind CSS classes only
- Use shadcn/ui components where appropriate
- No purple gradients, no neon, no heavy shadows
- Mobile-responsive

The component should:
- [Describe what it displays]
- [Describe any interactions]
- [Describe the data it receives as props]

Output only the React component code. No explanation needed.
```

---

## Claude Code vs V0 Decision Framework

| Situation | Use | Reasoning |
|---|---|---|
| Building a landing page | V0 first, then Claude Code | V0 is faster for visual design |
| Building a dashboard layout | V0 first, then Claude Code | Layout is visual work |
| Connecting a page to a database | Claude Code | V0 cannot write backend logic |
| Adding an API route | Claude Code | V0 is frontend-only |
| Creating a form with validation | Claude Code | Form logic needs server-side handling |
| Designing a card component | V0 | Pure UI, iterate visually |
| Setting up authentication | Claude Code | Requires backend, database, env vars |
| Making a page look unique | V0 first | Visual iteration is V0's strength |
| Fixing a logic bug | Claude Code | Logic work, not visual |
| Trying 3 different layouts | V0 | Visual comparison is instant |

### The V0 → Claude Code Handoff Prompt

After designing in V0, use this to integrate it into Claude Code without breaking the design:

```
I designed a component in V0. Here is the code:

[PASTE V0 COMPONENT CODE]

Add this component to the project at [/path/ComponentName.tsx].

Rules:
- Do not change any of the component's design (colors, layout, spacing, typography)
- Only add the real functionality: [describe what needs to be wired up]
- Connect it to this API route: [route]
- These props should come from: [data source]
- Do not touch any other files
```

---

## Anti-Patterns

These are the most common prompting mistakes that waste money and cause problems.

### ❌ The Everything Prompt

```
Build me a full SaaS app with auth, dashboard, user management, billing, email, 
file uploads, and deploy it to Vercel with a custom domain.
```

**Why it fails:** Claude Code will make dozens of decisions without your input, get halfway through, run out of context, and produce something neither you nor it can fully understand.

**Fix:** One phase at a time. One feature at a time.

---

### ❌ The Vague Description

```
Make the dashboard look better.
```

**Why it fails:** "Better" means nothing. Claude Code will guess — and guess wrong.

**Fix:** 
```
The dashboard header has too much whitespace and the card borders are too dark. 
Change border-gray-300 to border-slate-200 and reduce the header padding from p-8 to p-6. 
Do not change anything else.
```

---

### ❌ Asking AI to Rewrite Working Code

```
Something is wrong with the login page. Can you rewrite it?
```

**Why it fails:** "Rewrite" means Claude Code scraps working code and starts over — losing fixes you made and introducing new bugs.

**Fix:**
```
The login page has a specific problem: [describe it exactly]. 
Do not rewrite the page. Only change [the specific thing that is wrong].
Here is the current code: [paste it].
```

---

### ❌ The No-Constraint Prompt

```
Add a users table to the admin dashboard.
```

**Why it fails:** Claude Code might decide to change the navigation, update the layout, rename files, or modify the authentication setup as "helpful" side effects.

**Fix:** Always end with constraints:
```
Do not touch: navigation, authentication, layout files, Prisma schema, or any other page.
Only create: the /dashboard/admin/users page and its API route.
```

---

### ❌ Debugging by Redoing

When something breaks, the natural instinct is to ask Claude Code to "fix the auth" or "redo the database connection." This almost always makes things worse.

**Fix:** See the Rescue System below.

---

## Advanced Techniques

### The Checkpoint Commit

Before starting any new phase in Claude Code, download your project or note the commit state. This gives you a safe point to return to if the next phase introduces problems. Treat each phase like a savepoint in a game.

### The Minimal Scope Test

Before writing a prompt, ask yourself: *"What is the smallest version of this feature that proves it works?"* Build that first. Then expand.

For example, instead of building a complete user management system, first build: **one page that shows a list of users from the database.** Once that works, add search. Then pagination. Then actions.

### The Schema First Rule

Before building any UI that involves data, tell Claude Code to update the Prisma schema and run the migration first — in a separate prompt, before any UI work.

```
Before we build any UI, update the Prisma schema to add these models:
[list models and fields]

Run the migration.
Do not build any pages or components yet.
Confirm the migration was successful and show me the updated schema.
```

Only after confirming the schema works do you move to the UI prompt.

### Component Reading Before Building

Always tell Claude Code to read a JB component before using it. This single instruction saves hundreds of tokens because Claude Code reads the existing patterns instead of inventing new ones.

```
First, install and read this component:
pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json

Do not write any code until you have read all the files this command installs.
Then use the component's existing patterns to build [your feature].
```

---

## The Rescue System

When AI gets stuck, the worst thing you can do is keep prompting in the same conversation. Here are the three rescue techniques.

### Technique 1 — The Hard Reset

Close the current Claude Code conversation. Open a new one. Paste your Context Loading template with the specific error situation:

```
PROJECT CONTEXT: [paste context]

CURRENT PROBLEM:
I am getting this error: [paste exact error message]
It occurs in this file: [filename]
This is the current content of that file: [paste code]

TASK: Fix only this error. Do not change any other files.
Make the smallest possible change. Show me what you changed and why.
```

### Technique 2 — The Decomposition

If a feature prompt is causing repeated failures, break it into pieces. If "add payment system" keeps breaking:

1. First prompt: "Install the Stripe package only. Do not configure anything."
2. Second prompt: "Create the Stripe API route only. Do not create any UI."
3. Third prompt: "Create the checkout page UI. Do not add any logic yet."
4. Fourth prompt: "Wire the checkout page UI to the Stripe API route."

Four small prompts will always beat one big prompt when the big prompt is failing.

### Technique 3 — The V0 Bypass

If Claude Code cannot produce a correct UI component, design it in V0 and import the result:

1. Build the visual component in V0 (design only, no logic)
2. Copy the V0 output
3. In a new Claude Code session, paste it with the V0 Handoff Prompt
4. Ask Claude Code to wire the functionality — not redesign it

This separates the visual problem (V0 solves it) from the logic problem (Claude Code solves it) and prevents the two from interfering with each other.

---

## Quick Reference Card

```
BEFORE EVERY LOVABLE SESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Paste context loading template
2. State ONE goal for this session
3. List what NOT to touch

BEFORE EVERY PROMPT
━━━━━━━━━━━━━━━━━━
1. Is there a JB component for this? Install it first.
2. Is the schema updated? Update schema before building UI.
3. Is this one task? If not, split it.

WHEN AI GETS STUCK
━━━━━━━━━━━━━━━━━
1. New conversation (do not keep trying in the same one)
2. Paste exact error + exact file
3. Say "smallest possible fix only"

MONEY SAVING RULES
━━━━━━━━━━━━━━━━━
1. Always use JB components (saves 60-80% tokens)
2. One task per prompt
3. Always add constraints at the end
4. Start sessions with context loading
```

---

*Part of the [VibeKit Framework](../README.md) — github.com/MUKE-coder/vibekit*
