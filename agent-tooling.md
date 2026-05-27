# Agent Tooling — Skills & MCPs that Make VibeKit Builds Better

> Two installs that compound the framework's value: a **UI/UX skill** that locks design quality into every conversation, and an **MCP server** that gives the agent access to hundreds of polished component snippets.
>
> Both are user-side installs (they live in your Claude / Cursor / Cline config, not in your project). Set them up ONCE on your machine and every VibeKit project benefits.

---

## Why these two?

| Tool | What it does | Who it benefits |
|---|---|---|
| **ui-ux-pro-max-skill** | Auto-loads senior-designer rules into every Claude Code conversation — typography, spacing, motion, contrast, modern aesthetics | Anyone who wants "this doesn't look AI-built" output without writing 1000 lines of design rules |
| **21st.dev Magic MCP** | Lets the agent search / preview / fetch from 21st.dev's catalog of hundreds of polished React + Tailwind components mid-conversation | Anyone who'd otherwise paste shadcn snippets manually all day |

Combined effect: the agent has **opinionated design taste** (skill) + **a huge gallery of vetted parts** (MCP). VibeKit's master_prompt locks the stack; these two raise the visual ceiling.

---

## 1. ui-ux-pro-max-skill

### What it is

A Claude Code skill from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — a markdown rule pack the agent auto-loads on every conversation. It encodes senior-designer instincts: type scales, spacing rhythm, motion timing, contrast ratios, "this is AI slop" anti-patterns.

### Install (Claude Code)

```bash
# In ANY project (the skill installs to your user-level Claude config, not per-project)
mkdir -p ~/.claude/skills
git clone https://github.com/nextlevelbuilder/ui-ux-pro-max-skill ~/.claude/skills/ui-ux-pro-max
```

Restart Claude Code. The skill loads on every new conversation.

### Install (other agents)

Skills are a Claude Code feature, but the skill file is just markdown. Copy its content into your agent's equivalent rules file:

| Agent | Path |
|---|---|
| Cursor | `.cursor/rules/ui-ux-pro-max.mdc` |
| Cline | append to `.clinerules` |
| Codex CLI | append to `AGENTS.md` |
| Windsurf | `.windsurfrules` |

The rules are stack-agnostic — they apply equally regardless of whether your agent is Claude Code, Cursor, or anything else.

### Why it pairs well with VibeKit

VibeKit's master_prompt locks the stack (Next.js 16, Prisma v7, framer-motion, etc.) and pins HIGH-level design rules (image-first 80/20, no multi-color gradients, loud selected states, etc.). The ui-ux-pro-max skill goes one level finer — typography rhythm, motion easing curves, hover-state micro-interactions, the small choices that separate "shadcn defaults" from "designed". They stack cleanly.

---

## 2. 21st.dev Magic MCP

### What it is

An MCP (Model Context Protocol) server from [21st.dev](https://21st.dev) that lets your agent search, preview, and fetch components from 21st.dev's catalog mid-build. Instead of "give me a hero section" producing generic shadcn output, the agent can pull from a curated library of hundreds of polished hero/pricing/testimonial/dashboard parts.

Free tier covers most usage; the API key is just to identify you.

### Setup

**Step 1: Get an API key**

1. Go to [21st.dev](https://21st.dev)
2. Sign in (GitHub OAuth)
3. Go to your dashboard → **API** section
4. Create a new API key for MCP use
5. Copy it — it looks like a long hex string

**Step 2: Install the MCP into Claude Code**

```bash
claude mcp add magic --scope user --env API_KEY="PASTE_YOUR_API_KEY_HERE" -- npx -y @21st-dev/magic@latest
```

Substitute `PASTE_YOUR_API_KEY_HERE` with the key from step 1. `--scope user` means the MCP is available in every Claude Code session, not just one project.

**Step 3: Restart Claude Code**

The MCP shows up in the `/mcp` command list. The agent can now use `magic.search`, `magic.preview`, `magic.add` (or whatever the server exposes) during a conversation.

### Setup (other agents)

MCPs are an open protocol. The same `@21st-dev/magic` server works wherever the agent supports MCPs:

- **Cursor**: Settings → MCP → Add server → `npx -y @21st-dev/magic@latest` with env `API_KEY=...`
- **Cline**: `cline_mcp_settings.json` (see Cline's MCP docs)
- **Codex CLI**: `codex.toml` MCP section
- **Windsurf**: Settings → MCPs

The install command shape and per-agent config file changes, but the package + env var pattern is identical.

### Why it pairs well with VibeKit

VibeKit's **Component Registry** (the 32 JB + in-house components) is the *known* set — auth, payments, kanban, charts, marketing primitives. It covers the big, structural primitives.

21st.dev Magic MCP is the *long tail* — when the agent needs an unusual hero variant, a specific testimonial layout, a dashboard chrome the registry doesn't ship, it has a huge gallery to pull from on demand. Together: predictable structural building blocks + on-demand variety for everything else.

### Security note

Treat the API key like any secret:
- Don't commit it
- Use a different key per machine if you can
- Rotate if you accidentally paste it somewhere public

The `--scope user` install means the key lives in your Claude Code user config (e.g. `~/.claude/mcp.json` or similar), NOT in your project's git history.

---

## When the agent should use which

| Need | Use |
|---|---|
| Auth, file uploads, Stripe checkout, data tables, kanban, charts, multi-step forms, command palette, notification center | **VibeKit registry** — battle-tested, installable, source visible in `jb-components.md` |
| Marketing hero, testimonial, pricing tier, dashboard chrome, feature grid you can't find in the registry | **21st.dev Magic MCP** — pull a component on demand |
| Final-mile polish on any UI (spacing, motion, type, hover states) | **ui-ux-pro-max-skill** — applies passively in the background |

The agent uses all three. It doesn't pick one.

---

## Recommended install order

1. **Phase 0** (machine setup, [/setup](https://vibekit.desishub.com/setup)) — Node, pnpm, git, gh
2. **Phase 0.5** (this guide) — install ui-ux-pro-max-skill + 21st.dev Magic MCP
3. **Step 1** ([CLAUDE_PROMPT.md](./CLAUDE_PROMPT.md)) — paste planning prompt into Claude
4. **Phase 1 onwards** — build your project

The Phase 0.5 installs are user-level. Set them up once, benefit forever.

---

## Reference

- **ui-ux-pro-max-skill:** [github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **21st.dev:** [21st.dev](https://21st.dev) — sign in, grab an MCP API key
- **MCP package:** [`@21st-dev/magic`](https://www.npmjs.com/package/@21st-dev/magic)
- **Claude Code MCP docs:** see `claude mcp --help` or [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code)

---

_Last updated: 2026-05-18_
