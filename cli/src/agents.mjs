/**
 * Where each supported agent expects its auto-loaded rules file.
 *
 * `source` picks which bundled rules file to write:
 *   - "skill"  → skill/SKILL.md  (YAML frontmatter; registers the /vibekit skill)
 *   - "agents" → skill/AGENTS.md (plain markdown; same rules, no frontmatter)
 *
 * Keep this table in sync with skill/README.md — it is the same mapping, and the
 * two drifting apart is exactly the manual-copy problem this CLI removes.
 */
export const AGENTS = {
  claude: {
    label: "Claude Code",
    source: "skill",
    project: ".claude/skills/vibekit/SKILL.md",
    global: "~/.claude/skills/vibekit/SKILL.md",
    note: "Registers as the /vibekit slash command.",
  },
  cursor: {
    label: "Cursor",
    source: "agents",
    project: ".cursor/rules/vibekit.mdc",
  },
  codex: {
    label: "Codex CLI",
    source: "agents",
    project: "AGENTS.md",
  },
  cline: {
    label: "Cline",
    source: "agents",
    project: ".clinerules",
  },
  windsurf: {
    label: "Windsurf",
    source: "agents",
    project: ".windsurfrules",
  },
  gemini: {
    label: "Gemini CLI",
    source: "agents",
    project: "GEMINI.md",
  },
  aider: {
    label: "Aider",
    source: "agents",
    project: "AGENTS.md",
  },
  continue: {
    label: "Continue",
    source: "agents",
    project: "AGENTS.md",
  },
  cody: {
    label: "Cody",
    source: "agents",
    project: ".cody/instructions.md",
  },
  junie: {
    label: "Junie",
    source: "agents",
    project: ".junie/guidelines.md",
  },
};

/**
 * Markers we can look for in a project to guess which agent is already in use.
 * Ordered by specificity — first hit wins.
 */
const DETECTION_MARKERS = [
  [".claude", "claude"],
  [".cursor", "cursor"],
  [".clinerules", "cline"],
  [".windsurfrules", "windsurf"],
  ["GEMINI.md", "gemini"],
  [".cody", "cody"],
  [".junie", "junie"],
];

/**
 * Best-effort guess at which agent this project already uses, so `init` can
 * offer a sensible default instead of making the user pick from ten options.
 * Returns null when nothing is recognisable.
 */
export function detectAgent(existsSync, join, cwd) {
  for (const [marker, agent] of DETECTION_MARKERS) {
    if (existsSync(join(cwd, marker))) return agent;
  }
  return null;
}

export const AGENT_KEYS = Object.keys(AGENTS);
