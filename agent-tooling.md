# Agent Tooling — Skills & MCPs that Make VibeKit Builds Better

> Two tools that compound the framework's value: a **UI/UX skill** that locks design quality into every conversation, and an **MCP server** that gives the agent a real browser to verify its own work.
>
> **`npx vibekit-framework init` installs both for you** — it registers the Playwright MCP in your project's `.mcp.json` and clones the ui-ux-pro-max-skill into your Claude Code config. This guide is the manual / other-agent fallback and the rationale behind them.

---

## Why these two?

| Tool | What it does | Who it benefits |
|---|---|---|
| **ui-ux-pro-max-skill** | Auto-loads senior-designer rules into every Claude Code conversation — typography, spacing, motion, contrast, modern aesthetics | Anyone who wants "this doesn't look AI-built" output without writing 1000 lines of design rules |
| **Playwright MCP** | Gives the agent a real browser it drives over MCP — navigate, click, fill forms, read the page's accessibility tree as structured snapshots — so it can verify the UI it just built | Anyone who wants the agent to catch its own render bugs and broken flows before the user ever sees them |

Combined effect: the agent has **opinionated design taste** (skill) + **the ability to check its own work in a real browser** (MCP). VibeKit's master_prompt locks the stack; these two raise the visual ceiling and close the feedback loop.

---

## 1. ui-ux-pro-max-skill

### What it is

A Claude Code skill from [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) — a markdown rule pack the agent auto-loads on every conversation. It encodes senior-designer instincts: type scales, spacing rhythm, motion timing, contrast ratios, "this is AI slop" anti-patterns.

> **`npx vibekit-framework init` installs this for you** (Claude Code target only) by cloning the skill into `~/.claude/skills/ui-ux-pro-max`. It's best-effort — it needs git + a network connection, and it's skipped in non-interactive / CI runs unless you pass `--skills`. Opt out entirely with `--no-skills`. The manual steps below are the fallback and the path for other agents.

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

## 2. Playwright MCP

### What it is

An MCP (Model Context Protocol) server from Microsoft — [`@playwright/mcp`](https://github.com/microsoft/playwright-mcp) — that gives your agent a real browser. Over MCP it can navigate to a URL, click, type, fill forms, and read back the page's **accessibility tree as structured snapshots** (no vision model needed — it works from the semantic structure of the page).

The point for VibeKit: instead of the agent building a page and you manually opening it to see if it renders, **the agent verifies its own work** — it opens the page it just built, confirms it renders, and clicks through the flow to catch broken states before you ever see them.

> **`npx vibekit-framework init` sets this up for you** by merging a project-level `.mcp.json` (and `.cursor/mcp.json` when your agent is Cursor). The merge is non-destructive — it never disturbs other MCP servers — and idempotent. Opt out with `--no-mcp`. The steps below are the manual fallback.

### Standard config

The server needs no API key. The standard `.mcp.json` (in your project root) is:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

**Prereqs:** Node.js 20+ and an MCP client.

### Install (Claude Code)

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

Restart Claude Code. The server shows up in the `/mcp` command list, and the agent can drive the browser during a conversation.

### Setup (other agents)

MCPs are an open protocol, and every modern MCP client reads the same standard config shape shown above:

- **Cursor**: writes to `.cursor/mcp.json` (same `mcpServers` block)
- **VS Code**: add the same `playwright` server entry to your MCP config
- **Windsurf**: Settings → MCPs → add the same command + args
- **Cline**: `cline_mcp_settings.json` (see Cline's MCP docs)

The config file location changes per agent; the `command` + `args` are identical everywhere.

### Why it pairs well with VibeKit

VibeKit's **Component Registry** gives the agent battle-tested structural primitives to assemble; the ui-ux-pro-max-skill gives it design taste. Playwright MCP closes the loop: after the agent wires those parts into a page, it can **open that page in a real browser and check the result** — does it render, does the form submit, does the selected state actually show — catching render bugs and broken flows before the user does.

### Security note

The standard config above is safe to commit. One aside: the server also exposes a `browser_run_code_unsafe` tool that is RCE-equivalent — the standard config does **not** enable it, so leave it off unless you fully understand the risk.

---

## When the agent should use which

| Need | Use |
|---|---|
| Auth, file uploads, Stripe checkout, data tables, kanban, charts, multi-step forms, command palette, notification center | **VibeKit registry** — battle-tested, installable, source visible in `jb-components.md` |
| Verify the UI actually works — open the page just built, click through the flow, check the accessibility tree renders as expected | **Playwright MCP** — drive a real browser to check its own work |
| Final-mile polish on any UI (spacing, motion, type, hover states) | **ui-ux-pro-max-skill** — applies passively in the background |

The agent uses all three. It doesn't pick one.

---

## Recommended install order

1. **Phase 0** (machine setup, [/setup](https://vibekit.desishub.com/setup)) — Node, pnpm, git, gh
2. **Phase 0.5** — done for you by `npx vibekit-framework init`: it registers the Playwright MCP and clones the ui-ux-pro-max-skill. Only reach for this guide if you're setting them up manually or on a non-Claude agent.
3. **Step 1** ([CLAUDE_PROMPT.md](./CLAUDE_PROMPT.md)) — paste planning prompt into Claude
4. **Phase 1 onwards** — build your project

The Playwright MCP lives in your project's `.mcp.json`; the skill is user-level. Set up once (by `init`), benefit forever.

---

## Optional: Taste Skill — for the marketing/landing surface only

[Taste Skill](https://github.com/Leonxlnx/taste-skill) (MIT, by Leon Lin) is an
open-source "anti-slop frontend" skill: a big, production-tested catalog of the
specific patterns an LLM defaults to when it tries to look designed (em-dashes,
section-number eyebrows, fake `<div>` screenshots, weather strips, three equal
cards, and so on). VibeKit has already **baked its best, non-conflicting rules
into `master_prompt.md` and `pre-design-review.md`** (see the "marketing-page
anti-slop" blocks), so you don't need to install anything to get most of the value.

If you want the full skill anyway, treat it as a **landing-page-only** tool:

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

Use it with care — it is **not** a drop-in for VibeKit builds:

- **Scope:** Taste is for landing pages / portfolios / heroes. It explicitly is
  *not* for dashboards, data tables, or multi-step product UI — which is most of
  what VibeKit builds. Apply it to the marketing surface, not the app.
- **Don't run it alongside `ui-ux-pro-max-skill`** on the same task — two large,
  opinionated design skills loaded at once give the agent contradictory rules.
- **It conflicts with VibeKit on three axes, on purpose:** Taste discourages
  **Inter** (VibeKit's default) and **Lucide** (VibeKit mandates `lucide-react`),
  and pushes per-page *variance* / swapping design systems per brief — the
  opposite of VibeKit's ONE locked `design-style-guide.md`. If you use Taste,
  VibeKit's `design-style-guide.md` still wins on tokens, fonts, and icons.

The safe default is to **not** install it and rely on the ported rules — they
give you the anti-tells without the conflicts.

---

## Reference

- **ui-ux-pro-max-skill:** [github.com/nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- **Playwright MCP:** [github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp) — docs, config, and tool list
- **MCP package:** [`@playwright/mcp`](https://www.npmjs.com/package/@playwright/mcp)
- **Claude Code MCP docs:** see `claude mcp --help` or [docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code)
- **Taste Skill (optional):** [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) — best rules already ported into VibeKit's design docs

---

_Last updated: 2026-08-03_
