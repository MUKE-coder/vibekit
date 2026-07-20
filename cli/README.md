# `vibekit` CLI

One command to set up the VibeKit framework in a project.

```bash
npx @vibekit/cli init
```

It installs:

| What | Where |
|---|---|
| `master_prompt.md` | project root — the coding constitution |
| `jb-components.md` | project root — component registry reference |
| `pre-deploy-review.md` | project root — the pre-deploy security audit prompt |
| Agent rules | your agent's auto-loaded path (see below) |

This replaces quickstart step 5, which previously meant opening GitHub,
downloading three files by hand, dropping them in the right folder, then running
a separate `curl` command for the agent rules — four manual steps that silently
half-complete if any one is missed.

## Usage

```bash
npx @vibekit/cli init                    # interactive — detects your agent
npx @vibekit/cli init --agent cursor     # skip the prompt
npx @vibekit/cli init --agent all        # write every agent's rules file
npx @vibekit/cli init --global           # Claude skill to ~/.claude, not the project
npx @vibekit/cli init --yes              # accept defaults, no prompts (CI)
npx @vibekit/cli init --force            # overwrite existing files
npx @vibekit/cli init --dir ./my-app     # target a different directory
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
- **Offline.** The framework files are bundled into the package at publish time,
  so `init` makes no network calls and installs the exact versions this CLI
  version was tested against.
- **Zero runtime dependencies.**

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
