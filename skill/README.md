# VibeKit — Agent Rules Installation

> **The fast path is `npx @vibekit/cli init`** — it detects your agent, writes the
> right rules file, and installs the three framework files alongside it. See
> [`cli/README.md`](../cli/README.md). Everything below is the manual
> equivalent, kept for people who want to see exactly what lands where.

This folder ships TWO files that contain the same rules in two formats:

| File | For | Format |
|---|---|---|
| [`SKILL.md`](./SKILL.md) | **Claude Code** | YAML frontmatter (`name`, `description`) — registers as the `/vibekit` slash-command skill |
| [`AGENTS.md`](./AGENTS.md) | **Every other agent** (Cursor, Codex CLI, Cline, Windsurf, Gemini CLI, Aider, Continue, Cody, Junie) | Plain markdown — drop into the agent's auto-loaded rules path |

Pick the install for your agent below. All commands assume you're at the root of your VibeKit project.

---

## Claude Code

Two install options.

### Project-local (recommended — travels with the repo)

```bash
mkdir -p .claude/skills/vibekit
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/SKILL.md \
  -o .claude/skills/vibekit/SKILL.md
```

After install, restart Claude Code. Type `/vibekit` to invoke it explicitly, or it auto-loads when Claude Code detects the framework files.

### Global (every Claude Code session anywhere on your machine)

```bash
mkdir -p ~/.claude/skills/vibekit
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/SKILL.md \
  -o ~/.claude/skills/vibekit/SKILL.md
```

---

## Cursor

Cursor reads `.cursor/rules/*.mdc` (newer) and the legacy root `.cursorrules` file. Both work; we recommend the newer path.

```bash
mkdir -p .cursor/rules
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o .cursor/rules/vibekit.mdc
```

Restart Cursor (or reload the rules from Settings → Cursor Settings → Rules).

---

## OpenAI Codex CLI

Codex CLI auto-loads `AGENTS.md` from the project root. This is the simplest install:

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o AGENTS.md
```

Run `codex` in the project — the rules load automatically. (Note: you may already have an `AGENTS.md` from another tool — if so, append the contents instead of overwriting.)

---

## Cline (VS Code)

Cline auto-loads `.clinerules` from the project root.

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o .clinerules
```

Reload Cline.

---

## Windsurf

Windsurf auto-loads `.windsurfrules` from the project root.

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o .windsurfrules
```

Restart Windsurf.

---

## Gemini CLI

Gemini CLI auto-loads `GEMINI.md` from the project root.

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o GEMINI.md
```

---

## Aider

Aider doesn't auto-load — you reference the file via config. Add to `.aider.conf.yml`:

```yaml
read:
  - AGENTS.md
  - master_prompt.md
  - jb-components.md
```

Then download the rules:

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o AGENTS.md
```

---

## Continue (VS Code / JetBrains)

Continue reads rules from `~/.continue/config.json`. Add a `rules` entry referencing the file:

```bash
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o AGENTS.md
```

Then in `~/.continue/config.json`:

```json
{
  "rules": [
    { "name": "vibekit", "rule": "Always read AGENTS.md at the start of every task and follow it strictly." }
  ]
}
```

---

## Cody (Sourcegraph)

```bash
mkdir -p .cody
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o .cody/instructions.md
```

Reference `.cody/instructions.md` in your custom commands.

---

## Junie (JetBrains)

```bash
mkdir -p .junie
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o .junie/guidelines.md
```

---

## Multi-agent setup (use VibeKit with multiple agents)

If you switch between agents on the same project, install for all of them at once:

```bash
# One-shot: install for Claude Code (project-local), Cursor, Codex/Gemini, Cline, Windsurf
mkdir -p .claude/skills/vibekit .cursor/rules

curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/SKILL.md \
  -o .claude/skills/vibekit/SKILL.md

curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \
  -o AGENTS.md

# Symlink AGENTS.md to the per-agent filenames
ln -sf AGENTS.md .cursor/rules/vibekit.mdc
ln -sf AGENTS.md .clinerules
ln -sf AGENTS.md .windsurfrules
ln -sf AGENTS.md GEMINI.md
```

(On Windows PowerShell, replace `ln -sf` with `New-Item -ItemType SymbolicLink -Path <link> -Target <target>` or just `Copy-Item`.)

---

## Updating the rules

The rules content changes as the framework evolves. To pull the latest version, re-run `npx @vibekit/cli init --force`, or re-run the same `curl` command for your agent. The new file overwrites the old one — your project files are untouched.

---

## Where this fits in the VibeKit workflow

Install the rules in **Module 03 — Initialize the project** of the [tutorial](https://vibekit.desishub.com/tutorial). `npx @vibekit/cli init` does this step *and* copies `master_prompt.md`, `jb-components.md` and `pre-deploy-review.md` into your project root in one command — the manual commands on this page are the fallback if you'd rather do it by hand or need a target the CLI doesn't cover yet.

If you skip this step, VibeKit still works — the agent reads the framework files manually when you paste `prompt.md` (the build prompt). Installing the rules just makes them load automatically without a long paste.
