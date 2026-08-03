import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Claude Code vs Cursor vs Cline - which AI coding agent should you use?",
  description:
    "Honest comparison of Claude Code, Cursor, and Cline - features, pricing, model access, terminal-vs-IDE workflow, and which one fits VibeKit's project structure best.",
  alternates: { canonical: "/compare/claude-code-vs-cursor-vs-cline" },
  openGraph: {
    url: `${SITE.url}/compare/claude-code-vs-cursor-vs-cline`,
    images: ["/og.png"],
    type: "article",
  },
};

type Row = { feature: string; claudeCode: string | boolean; cursor: string | boolean; cline: string | boolean };

const rows: Row[] = [
  { feature: "Pricing", claudeCode: "Subscription ($20-200/mo) or pay-as-you-go", cursor: "Free / Pro $20/mo / Business $40/mo", cline: "Free OSS - pay your own model API costs" },
  { feature: "Default model", claudeCode: "Claude Sonnet/Opus (Anthropic)", cursor: "GPT-4 / Claude / Gemini (your choice)", cline: "BYOM - Anthropic, OpenAI, OpenRouter, Ollama" },
  { feature: "IDE integration", claudeCode: "Terminal + VS Code extension", cursor: "Standalone IDE (VS Code fork)", cline: "VS Code extension" },
  { feature: "Terminal-first workflow", claudeCode: true, cursor: false, cline: false },
  { feature: "Reads project context files", claudeCode: true, cursor: true, cline: true },
  { feature: "Auto-loads CLAUDE.md", claudeCode: true, cursor: false, cline: false },
  { feature: "Multi-step task planning", claudeCode: true, cursor: true, cline: true },
  { feature: "Background agent / async tasks", claudeCode: true, cursor: true, cline: false },
  { feature: "MCP server support", claudeCode: true, cursor: true, cline: true },
  { feature: "Skills / custom workflows", claudeCode: true, cursor: false, cline: false },
  { feature: "Works with VibeKit", claudeCode: true, cursor: true, cline: true },
  { feature: "Best for solo indie hackers", claudeCode: true, cursor: true, cline: true },
  { feature: "Best for teams / pair programming", claudeCode: false, cursor: true, cline: false },
  { feature: "Best for cost-conscious / open source", claudeCode: false, cursor: false, cline: true },
];

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--accent)]/15 text-[color:var(--accent)]">
        <Check className="h-3.5 w-3.5" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[color:var(--bg-muted)] text-[color:var(--text-tertiary)]">
        <X className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <span className="text-[13.5px] text-[color:var(--text-primary)]">{value}</span>;
}

export default function CompareClaudeCursorCline() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        <article className="mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All comparisons
          </Link>

          <header className="mt-8 border-b border-[color:var(--border)] pb-10">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
              Comparison
            </div>
            <h1 className="mt-3 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
              Claude Code vs Cursor vs Cline
            </h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              Three popular AI coding agents. All three read project files. All three work with VibeKit. The differences come down to <strong className="font-medium text-[color:var(--text-primary)]">workflow</strong>, <strong className="font-medium text-[color:var(--text-primary)]">cost structure</strong>, and <strong className="font-medium text-[color:var(--text-primary)]">where you do your work</strong>.
            </p>
          </header>

          {/* TL;DR */}
          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            <Pick
              title="Pick Claude Code if..."
              points={[
                "You live in the terminal",
                "You want the best multi-step planning",
                "You're already paying for Anthropic",
                "You want auto-loaded CLAUDE.md + Skills",
              ]}
            />
            <Pick
              title="Pick Cursor if..."
              points={[
                "You want a polished IDE",
                "You work with a team / pair programming",
                "You want flexible model choice",
                "Tab autocomplete is non-negotiable",
              ]}
            />
            <Pick
              title="Pick Cline if..."
              points={[
                "You want it free / open source",
                "You want full control over model + API costs",
                "You're fine with VS Code extension UX",
                "You like seeing every API call",
              ]}
            />
          </section>

          {/* Comparison table */}
          <section className="mt-14">
            <h2 className="font-mono text-[14px] uppercase tracking-tight text-[color:var(--text-primary)]">
              Feature-by-feature
            </h2>
            <div className="mt-5 overflow-hidden rounded-md border border-[color:var(--border)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
                    <tr>
                      <th className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Feature
                      </th>
                      <th className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Claude Code
                      </th>
                      <th className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Cursor
                      </th>
                      <th className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Cline
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr
                        key={r.feature}
                        className={i !== rows.length - 1 ? "border-b border-[color:var(--border)]" : ""}
                      >
                        <td className="px-5 py-3 font-medium text-[14px] text-[color:var(--text-primary)]">
                          {r.feature}
                        </td>
                        <td className="px-5 py-3"><Cell value={r.claudeCode} /></td>
                        <td className="px-5 py-3"><Cell value={r.cursor} /></td>
                        <td className="px-5 py-3"><Cell value={r.cline} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Working with VibeKit */}
          <section className="mt-14">
            <h2 className="font-mono text-[14px] uppercase tracking-tight text-[color:var(--text-primary)]">
              Using VibeKit with each
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
              VibeKit doesn't care which agent you use - the four files (<code className="font-mono text-[13px]">project-description.md</code>, <code className="font-mono text-[13px]">project-phases.md</code>, <code className="font-mono text-[13px]">design-style-guide.md</code>, <code className="font-mono text-[13px]">prompt.md</code>) are agent-agnostic markdown.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Tip
                agent="Claude Code"
                instruction={`Drop master_prompt.md into your project as CLAUDE.md (or alongside it). Claude Code auto-loads it. Then paste prompt.md to start Phase 1.`}
              />
              <Tip
                agent="Cursor"
                instruction={`Save master_prompt.md as .cursorrules (or in /Rules for newer versions). Reference project-description.md and project-phases.md from the chat. Open prompt.md and run.`}
              />
              <Tip
                agent="Cline"
                instruction={`Reference master_prompt.md in your custom instructions. Open prompt.md and ask Cline to read all five framework files before starting Phase 1.`}
              />
            </div>
          </section>

          {/* Verdict */}
          <section className="mt-14 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8">
            <h2 className="font-mono text-[14px] uppercase tracking-tight text-[color:var(--text-primary)]">
              Our take
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
              For most VibeKit users we recommend <strong className="font-medium text-[color:var(--text-primary)]">Claude Code</strong> - the auto-loaded CLAUDE.md + Skills system fits VibeKit's "lock the rules at the start of every session" philosophy perfectly, and Claude's planning quality on multi-phase work is currently best-in-class.
            </p>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
              Pick <strong className="font-medium text-[color:var(--text-primary)]">Cursor</strong> if you do most of your work in an IDE and want pair-programming-style collaboration. Pick <strong className="font-medium text-[color:var(--text-primary)]">Cline</strong> if you want full control and are willing to manage your own model + API costs. All three will produce excellent VibeKit projects.
            </p>
          </section>

          <div className="mt-12 flex flex-wrap gap-3">
            <Button href="/docs/quickstart" variant="accent" size="md">
              Read the quickstart
            </Button>
            <Button href="/components" variant="outline" size="md">
              Browse components
            </Button>
          </div>
        </article>
      </main>
      <Footer />

      {/* Article schema for AEO */}
      <Script
        id="ld-article-compare"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Claude Code vs Cursor vs Cline - which AI coding agent should you use?",
            description: "Honest comparison of Claude Code, Cursor, and Cline.",
            author: { "@type": "Person", name: "JB (Muke Johnbaptist)", url: SITE.authorUrl },
            publisher: { "@type": "Organization", name: "Desishub Technologies", url: "https://desishub.com" },
            mainEntityOfPage: `${SITE.url}/compare/claude-code-vs-cursor-vs-cline`,
          }),
        }}
      />
    </>
  );
}

function Pick({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
      <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
        {title}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex gap-2 text-[13.5px] leading-relaxed text-[color:var(--text-primary)]">
            <span className="text-[color:var(--text-tertiary)]">·</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tip({ agent, instruction }: { agent: string; instruction: string }) {
  return (
    <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-5">
      <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
        {agent}
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--text-primary)]">
        {instruction}
      </p>
    </div>
  );
}
