import { Section } from "./section";

const tree = `vibekit/
├── README.md                    ← Framework overview
├── CLAUDE_PROMPT.md             ← Paste into Claude.ai to plan your project
│
├── master_prompt.md             ← Coding standards for Claude Code (copy to your project)
├── design-style-guide.md        ← Design style guide template
├── jb-components.md             ← JB component registry reference (copy to your project)
├── pre-deploy-review.md         ← Paste into Claude Code before deploying — security/perf audit
│
├── prompt-engineering.md        ← Token economy, 5-part formula, rescue system
├── deployment.md                ← Vercel, Netlify, Cloudflare, SSL
├── environment-variables.md     ← Step-by-step for every secret
├── database-guide.md            ← Neon, Prisma, schema patterns, migrations
├── design-system-guide.md       ← Design principles, color palettes, component styles
├── troubleshooting.md           ← Symptoms → fixes, AI rescue protocols
├── monetization-guide.md        ← Stripe, webhooks, feature gating, billing
├── dgateway-guide.md            ← Mobile Money + card checkout (African markets)
├── multi-tenant.md              ← Orgs + RBAC + scoped queries (B2B SaaS)
├── audit-log.md                 ← Hash-chained tamper-evident log (SOC2)
├── ai-guide.md                  ← Vercel AI SDK + pgvector RAG + credit packs
├── agent-tooling.md             ← ui-ux-pro-max-skill + 21st.dev Magic MCP (user-level)
├── vibekit-primitives.md        ← Roadmap: 150 primitives — 100% complete ✨ (144 GitHub + 6 JB legacy)
├── registry.json                ← Root index for the GitHub registry
└── registry/                    ← Source for installable primitives (auth, hooks, ...)`;

const copyFiles = [
  { file: "master_prompt.md", purpose: "Claude Code reads this first — tech stack + coding rules" },
  { file: "jb-components.md", purpose: "Reference for when to install which JB component" },
  { file: "pre-deploy-review.md", purpose: "Paste into Claude Code before deploying for an audit" },
];

export function FrameworkFiles() {
  return (
    <Section
      id="files-tree"
      eyebrow="The repo at a glance"
      title="One repo. Everything you need."
      description="Reference guides for every layer of the stack — database, deployment, design, monetization, troubleshooting — plus the core prompts Claude Code reads while building."
    >
      <div className="reveal overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
        <div className="flex items-center gap-2 border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--text-tertiary)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--text-tertiary)]/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--text-tertiary)]/40" />
          <span className="ml-3 font-mono text-[12px] text-[color:var(--text-tertiary)]">
            github.com/MUKE-coder/vibekit
          </span>
        </div>
        <pre className="overflow-x-auto p-5 sm:p-7 font-mono text-[12.5px] leading-[1.7] text-[color:var(--text-primary)]">
          <code>{tree}</code>
        </pre>
      </div>

      <div className="reveal mt-10 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-6">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
          Copy these into every project root
        </div>
        <ul className="mt-4 divide-y divide-[color:var(--border)]">
          {copyFiles.map((c) => (
            <li key={c.file} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <code className="font-mono text-[14px] text-[color:var(--text-primary)]">
                {c.file}
              </code>
              <span className="text-[14px] text-[color:var(--text-secondary)]">
                {c.purpose}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[13px] text-[color:var(--text-tertiary)]">
          Claude generates <code className="font-mono">project-description.md</code>, <code className="font-mono">project-phases.md</code>, <code className="font-mono">design-style-guide.md</code>, and <code className="font-mono">prompt.md</code> for you in the planning step.
        </p>
      </div>
    </Section>
  );
}
