import { FileStack, PhaseLines, CodeBrackets, CubeStack } from "./graphics/icons";
import { CpuArchitecture } from "./ui/cpu-architecture";
import { Section } from "./section";

const files = [
  {
    Icon: FileStack,
    name: "project-description.md",
    body: "Complete description of your app - features, data model, pages, integrations.",
  },
  {
    Icon: PhaseLines,
    name: "project-phases.md",
    body: "Build blueprint with phases, tasks, and install commands. Your agent checks them off.",
  },
  {
    Icon: CubeStack,
    name: "design-style-guide.md",
    body: "Fully customized visual design system - colors, typography, spacing, component specs.",
  },
  {
    Icon: CodeBrackets,
    name: "prompt.md",
    body: "The prompt you paste into your coding agent to start building.",
  },
];

export function FourFiles() {
  return (
    <Section
      id="files"
      eyebrow="THE 4-FILE OUTPUT · AGENT-AGNOSTIC"
      title={<>Four files. One coherent <em className="not-italic gradient-text">build plan</em>.</>}
      description="The planning step generates everything any coding agent needs - Claude Code, Cursor, Kiro, Antigravity, Windsurf, Cline, Aider - anything that reads files. No vague briefs. No guessing. Each file has a single job."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {files.map(({ Icon, name, body }) => (
          <div
            key={name}
            className="reveal group relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-start gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] transition-colors group-hover:text-[color:var(--text-primary)]">
                <Icon size={32} />
              </span>
              <div className="flex-1">
                <code className="font-mono text-[13px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  {name}
                </code>
                <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--text-primary)]">
                  {body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Data flow visualization */}
      <div className="reveal mt-12 overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 sm:p-8">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-[color:var(--border)] pb-4">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            4 files → agent → production app
          </span>
        </div>
        <div className="aspect-[2/1] w-full">
          <CpuArchitecture />
        </div>
      </div>
    </Section>
  );
}
