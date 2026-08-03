"use client";

import { useState } from "react";
import { CopyBlock } from "./copy-block";
import { cn } from "@/lib/utils";

type AgentKey =
  | "claude-code"
  | "cursor"
  | "codex"
  | "cline"
  | "windsurf"
  | "gemini"
  | "aider";

const tabs: { value: AgentKey; label: string }[] = [
  { value: "claude-code", label: "Claude Code" },
  { value: "cursor", label: "Cursor" },
  { value: "codex", label: "Codex CLI" },
  { value: "cline", label: "Cline" },
  { value: "windsurf", label: "Windsurf" },
  { value: "gemini", label: "Gemini CLI" },
  { value: "aider", label: "Aider" },
];

const installs: Record<AgentKey, { label: string; code: string; note?: string }> = {
  "claude-code": {
    label: "Project-local install (recommended)",
    code: `mkdir -p .claude/skills/vibekit
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/SKILL.md \\
  -o .claude/skills/vibekit/SKILL.md`,
    note: "Restart Claude Code. Type /vibekit to invoke, or it auto-loads when framework files are detected.",
  },
  cursor: {
    label: "Cursor - .cursor/rules/vibekit.mdc",
    code: `mkdir -p .cursor/rules
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o .cursor/rules/vibekit.mdc`,
    note: "Restart Cursor or reload rules from Settings → Cursor Settings → Rules.",
  },
  codex: {
    label: "OpenAI Codex CLI - AGENTS.md (auto-loaded)",
    code: `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o AGENTS.md`,
    note: "Auto-loads on next codex run. If you already have AGENTS.md, append instead of overwriting.",
  },
  cline: {
    label: "Cline - .clinerules (auto-loaded)",
    code: `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o .clinerules`,
    note: "Reload Cline.",
  },
  windsurf: {
    label: "Windsurf - .windsurfrules (auto-loaded)",
    code: `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o .windsurfrules`,
    note: "Restart Windsurf.",
  },
  gemini: {
    label: "Gemini CLI - GEMINI.md (auto-loaded)",
    code: `curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o GEMINI.md`,
  },
  aider: {
    label: "Aider - add to .aider.conf.yml read: list",
    code: `# 1. Download the rules
curl -fsSL https://raw.githubusercontent.com/MUKE-coder/vibekit/main/skill/AGENTS.md \\
  -o AGENTS.md

# 2. Add to .aider.conf.yml
cat >> .aider.conf.yml << 'EOF'
read:
  - AGENTS.md
  - master_prompt.md
  - jb-components.md
EOF`,
    note: "Aider doesn't auto-load - the read: config tells it which files are always in context.",
  },
};

export function AgentInstallTabs() {
  const [active, setActive] = useState<AgentKey>("claude-code");
  const current = installs[active];

  return (
    <div className="not-prose">
      <div className="flex flex-wrap gap-1 border-b border-[color:var(--border)]">
        {tabs.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setActive(t.value)}
            className={cn(
              "relative px-3 sm:px-4 py-2 font-mono text-[11px] sm:text-[12px] uppercase tracking-wider transition-colors",
              active === t.value
                ? "text-[color:var(--text-primary)]"
                : "text-[color:var(--text-tertiary)] hover:text-[color:var(--text-secondary)]"
            )}
          >
            {t.label}
            {active === t.value ? (
              <span className="absolute -bottom-px left-0 right-0 h-[2px] bg-[color:var(--accent)]" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-5">
        <CopyBlock filename="terminal" label={current.label} code={current.code} />
        {current.note ? (
          <p className="mt-3 text-[12.5px] text-[color:var(--text-tertiary)]">
            {current.note}
          </p>
        ) : null}
      </div>

      <p className="mt-4 text-[12.5px] text-[color:var(--text-tertiary)]">
        Using a different agent (Continue, Cody, Junie, etc.)? See{" "}
        <a
          href="https://github.com/MUKE-coder/vibekit/blob/main/skill/README.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--accent)] underline underline-offset-4"
        >
          skill/README.md
        </a>
        {" "}for the full install table - same one-line curl, just a different filename.
      </p>
    </div>
  );
}
