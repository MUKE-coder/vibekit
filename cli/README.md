# vibekit-framework

The one-command installer for [**VibeKit**](https://vibekit.desishub.com) — a
framework for building production-grade Next.js apps with Claude Code or any AI
agent, without burning tokens or shipping broken code.

```bash
npx vibekit-framework init
```

**How it fits:** VibeKit is a set of markdown prompts and reference guides your
AI agent reads to build real apps. This package drops those files into your
project and wires up your agent's rules so they load every session — the setup
step of the [VibeKit workflow](https://vibekit.desishub.com/docs/quickstart).
Full framework and docs: [vibekit.desishub.com](https://vibekit.desishub.com) ·
[GitHub](https://github.com/MUKE-coder/vibekit).

It installs:

| What | Where |
|---|---|
| `master_prompt.md` | project root — the coding constitution |
| `jb-components.md` | project root — component registry reference |
| `pre-deploy-review.md` | project root — the pre-deploy security + performance audit prompt |
| `pre-design-review.md` | project root — the UI/UX design audit prompt (against your style guide) |
| Agent rules | your agent's auto-loaded path (see below) |
| **Playwright MCP** | `.mcp.json` (+ `.cursor/mcp.json`) — a real browser so your agent can verify its own UI |
| **ui-ux-pro-max skill** | `~/.claude/skills/` — senior-designer rules for Claude Code (best-effort clone) |

This replaces quickstart step 5, which previously meant opening GitHub,
downloading three files by hand, running a separate `curl` for the agent rules,
then hand-installing an MCP and a skill — several manual steps that silently
half-complete if any one is missed.

### Playwright MCP & the ui-ux skill

- **Playwright MCP** is registered by merging a project `.mcp.json` (and
  `.cursor/mcp.json` for Cursor) — non-destructively, so your other MCP servers
  are untouched. It gives the agent a real browser (navigate, click, fill, read
  accessibility snapshots) so it can check the UI it just built. Skip with
  `--no-mcp`. Restart your agent afterwards.
- **ui-ux-pro-max skill** (Claude Code) is cloned from
  [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
  into `~/.claude/skills/`. This is the one step that needs **git + network**, so
  it's best-effort and non-fatal — and skipped in non-interactive/CI runs unless
  you pass `--skills`. Skip entirely with `--no-skills`.

## Usage

```bash
npx vibekit-framework init                    # interactive — detects your agent
npx vibekit-framework init --agent cursor     # skip the prompt
npx vibekit-framework init --agent all        # write every agent's rules file
npx vibekit-framework init --global           # Claude skill to ~/.claude, not the project
npx vibekit-framework init --yes              # accept defaults, no prompts (CI)
npx vibekit-framework init --force            # overwrite existing files
npx vibekit-framework init --dir ./my-app     # target a different directory
npx vibekit-framework init --no-mcp           # don't register the Playwright MCP
npx vibekit-framework init --no-skills        # don't install the ui-ux skill
npx vibekit-framework init --skills           # install the skill even in CI
```

## Supported agents

| Agent | Rules file |
|---|---|
| Claude Code | `.claude/skills/vibekit/SKILL.md` (or `~/.claude/…` with `--global`) |
| Cursor | `.cursor/rules/vibekit.mdc` |
| Codex CLI / Aider / Continue | `AGENTS.md` |
| Cline | `.clinerules` |
| Windsurf | `.windsurfrules` |
| Gemini CLI | `GEMINI.md` |
| Cody | `.cody/instructions.md` |
| Junie | `.junie/guidelines.md` |

Claude Code gets `SKILL.md` (YAML frontmatter, registers the `/vibekit` slash
command). Everything else gets `AGENTS.md` — the same rules, no frontmatter.

## Behaviour

- **Idempotent.** Re-running reports "already up to date" and changes nothing.
- **Never clobbers your edits.** A file that exists with different content is
  left alone and listed in the summary; pass `--force` to overwrite.
- **Offline core.** The framework files are bundled at publish time and the MCP
  config is plain file I/O, so the core install makes no network calls. The
  **only** network step is cloning the ui-ux skill — it's best-effort, non-fatal,
  and skipped in CI unless you pass `--skills`.
- **Zero runtime dependencies.**

## Troubleshooting

### `npx` fails with "Cannot find module … \bin\vibekit.mjs" / "is not recognized as a command"

If your Windows username (and so your home folder) contains a special character
like `&`, `^`, `(`, or a space — e.g. `C:\Users\I&I\…` — `npx` builds a command
line that `cmd` mis-parses (it treats `&` as a separator), and **every** npx tool
breaks for that account, not just this one. Two fixes:

**A. Move npm's cache off the special-character path** (fixes `npx` for everything):

```bash
npm config set cache D:\npm-cache
npx vibekit-framework init
```

**B. Install it into your project and run it with `node` directly** (bypasses
`npx` and the shim entirely — your project path has no special characters):

```bash
npm install vibekit-framework
node node_modules/vibekit-framework/bin/vibekit.mjs init
```

Both avoid the `&`-in-path that trips up `cmd`. The permanent fix is a Windows
username without special characters, but that's rarely worth it.

## Development

```bash
node scripts/bundle.mjs   # copy framework files from the repo root into templates/
npm test                  # run the test suite
node bin/vibekit.mjs init --dir /tmp/scratch --agent all --yes
```

`templates/` is generated and gitignored — `prepack` regenerates it before
publish, so a release can never ship stale copies of the framework files.

To add a new agent, add an entry to `src/agents.mjs` and a row to the table
above and in `skill/README.md`.
