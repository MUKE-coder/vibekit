import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CopyBlock } from "@/components/copy-block";
import { GuideDownload } from "@/components/guide-download";
import { AgentInstallTabs } from "@/components/agent-install-tabs";
import { readPrompt } from "@/lib/read-prompt";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quickstart — set up VibeKit in 8 steps",
  description:
    "Step-by-step quickstart for VibeKit: copy the planning prompt, generate 4 project files, build with any agent, then run the design and pre-deploy reviews before launch. All prompts copyable inline.",
  alternates: { canonical: "/docs/quickstart" },
  openGraph: {
    url: `${SITE.url}/docs/quickstart`,
    images: ["/og.png"],
    type: "article",
  },
};

const steps = [
  {
    n: 1,
    title: "Copy the planning prompt",
    body: "Use the copy button below to grab the full CLAUDE_PROMPT.md content. No need to leave this page.",
  },
  {
    n: 2,
    title: "Open Claude (claude.ai)",
    body: "Go to claude.ai and start a new conversation. Paste the prompt as your first message, then add your app idea on a new line. Be specific about who the app is for and what it does.",
  },
  {
    n: 3,
    title: "Answer 6–10 questions",
    body: "Claude will interview you about features, user roles, data model, monetization, file uploads, email, and visual design. Answer honestly — vague answers produce vague output.",
  },
  {
    n: 4,
    title: "Save the 4 generated files",
    body: "Claude produces project-description.md, project-phases.md, design-style-guide.md, and prompt.md. Save all four in your project root folder.",
  },
  {
    n: 5,
    title: "Run npx vibekit-framework init",
    body: "One command installs everything: master_prompt.md (the coding constitution), jb-components.md (component registry reference), pre-deploy-review.md and pre-design-review.md (the two audit prompts — embedded below), plus the rules file for your agent, so they auto-load every session. It also sets up the Playwright MCP so your agent can check its own UI in a real browser. It detects your agent, never overwrites your edits, and is safe to re-run.",
  },
  {
    n: 6,
    title: "Open your coding agent & paste prompt.md",
    body: "Works with Claude Code, Cursor, Kiro Code, Antigravity, Windsurf, Cline, Aider, or any agent that reads files. The agent will read everything and start Phase 1, stopping for your confirmation between phases.",
  },
  {
    n: 7,
    title: "Run the design review",
    body: "Once the UI is built, paste the pre-design-review prompt (embedded below). It compares your app against your own design-style-guide.md plus universal design principles — hierarchy, spacing, type, color/contrast, states, accessibility — and writes a Critical / High / Medium report. With the Playwright MCP (installed in step 5) the agent reviews the rendered pages in a real browser, not just the code.",
  },
  {
    n: 8,
    title: "Run pre-deploy review, then ship",
    body: "Before deploying, paste the pre-deploy-review prompt (embedded below) into your agent. It writes a Critical / High / Medium report on performance and security. Address every Critical issue, then deploy.",
  },
];

export default function Quickstart() {
  // Read prompts at build time
  const claudePrompt = readPrompt("CLAUDE_PROMPT.md");
  const preDeployReview = readPrompt("pre-deploy-review.md");
  const preDesignReview = readPrompt("pre-design-review.md");

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        <article className="mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Documentation
          </Link>

          <header className="mt-8 border-b border-[color:var(--border)] pb-10">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
              Guide · 8 steps · ~12 min read
            </div>
            <h1 className="mt-3 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
              Quickstart
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              From a one-line idea to a deployed Next.js app, with an opinionated workflow that prevents the usual AI failure modes. <strong className="font-medium text-[color:var(--text-primary)]">No GitHub round-trip needed</strong> — every prompt is copyable right here.
            </p>
          </header>

          {/* Prefer a linear read? The PDF guide covers the same path end to end. */}
          <GuideDownload variant="inline" className="mt-10" />

          {/* Step 0 — environment pre-flight. Lives on its own page because it's
              OS-specific; linking it here stops people hitting step 6 with no pnpm. */}
          <Link
            href="/setup"
            className="mt-10 flex items-start gap-4 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition-colors hover:border-[color:var(--border-strong)]"
          >
            <div className="font-mono text-[28px] font-light leading-none text-[color:var(--text-tertiary)] tabular-nums">
              00
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-mono text-[15px] uppercase tracking-tight text-[color:var(--text-primary)]">
                First time? Check your environment
                <ArrowUpRight className="ml-1.5 inline h-3.5 w-3.5 text-[color:var(--accent)]" />
              </h2>
              <p className="mt-2 text-[14.5px] leading-relaxed text-[color:var(--text-secondary)]">
                A one-paste prompt that scans your machine for Node, pnpm, git and gh, then tells you exactly what to install. Takes a minute and saves a broken step 6.
              </p>
            </div>
          </Link>

          {/* Steps + embedded prompts */}
          <ol className="mt-10 space-y-10">
            {steps.map((s) => (
              <li key={s.n} className="grid gap-5 sm:grid-cols-[auto_1fr]">
                <div className="font-mono text-[40px] font-light leading-none text-[color:var(--accent)] tabular-nums">
                  {String(s.n).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h2 className="font-mono text-[18px] uppercase tracking-tight text-[color:var(--text-primary)]">
                    {s.title}
                  </h2>
                  <p className="mt-3 text-[15.5px] leading-[1.75] text-[color:var(--text-secondary)]">
                    {s.body}
                  </p>

                  {/* Inline prompt for step 1 */}
                  {s.n === 1 ? (
                    <div className="mt-5">
                      <CopyBlock
                        filename="CLAUDE_PROMPT.md"
                        label="Paste into claude.ai"
                        code={claudePrompt}
                      />
                      <p className="mt-3 text-[13px] text-[color:var(--text-tertiary)]">
                        Click <span className="font-mono uppercase">Copy</span> above, then go to{" "}
                        <a
                          href="https://claude.ai/new"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--accent)] underline underline-offset-4"
                        >
                          claude.ai/new
                        </a>{" "}
                        and paste it as your first message.
                      </p>
                    </div>
                  ) : null}

                  {/* Inline framework files for step 5 */}
                  {s.n === 5 ? (
                    <div className="mt-5 space-y-4">
                      <CopyBlock
                        filename="terminal"
                        label="Run in your project root"
                        code={"npx vibekit-framework init"}
                      />

                      <p className="text-[13px] text-[color:var(--text-tertiary)]">
                        Powered by the{" "}
                        <a
                          href="https://www.npmjs.com/package/vibekit-framework"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[color:var(--accent)] underline underline-offset-4 hover:no-underline"
                        >
                          vibekit-framework
                        </a>{" "}
                        npm package — zero dependencies, runs offline, safe to re-run.
                      </p>

                      <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                        <h3 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          What it installs
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {[
                            { file: "master_prompt.md", purpose: "Coding constitution your agent reads" },
                            { file: "jb-components.md", purpose: "When to install which JB component" },
                            { file: "pre-design-review.md", purpose: "Design audit prompt for step 7" },
                            { file: "pre-deploy-review.md", purpose: "Security + performance audit for step 8" },
                            { file: "your agent's rules file", purpose: "Auto-loads the rules every session" },
                          ].map((f) => (
                            <li key={f.file} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                              <span className="font-mono text-[13px] text-[color:var(--accent)]">{f.file}</span>
                              <span className="text-[13px] text-[color:var(--text-secondary)]">{f.purpose}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-4 text-[12.5px] text-[color:var(--text-tertiary)]">
                          It detects your agent — Claude Code, Cursor, Codex, Cline, Windsurf, Gemini CLI, Aider, Continue, Cody or Junie. Pass <code className="font-mono text-[12px] rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5">--agent all</code> to write every rules file, or <code className="font-mono text-[12px] rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5">--global</code> to install the Claude skill for every project. Re-running never overwrites your edits.
                        </p>
                      </div>

                      {/* Manual fallback for anyone who can't or won't run the CLI */}
                      <details className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                        <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          Prefer to install by hand?
                        </summary>
                        <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                          Copy{" "}
                          {["master_prompt.md", "jb-components.md", "pre-design-review.md", "pre-deploy-review.md"].map((f, i, arr) => (
                            <span key={f}>
                              <a
                                href={`https://github.com/MUKE-coder/vibekit/blob/main/${f}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[13px] text-[color:var(--accent)] underline underline-offset-4 hover:no-underline"
                              >
                                {f}
                              </a>
                              {i < arr.length - 1 ? ", " : " "}
                            </span>
                          ))}
                          into your project root, then install the rules file for your agent:
                        </p>
                        <div className="mt-4">
                          <AgentInstallTabs />
                        </div>
                      </details>
                    </div>
                  ) : null}

                  {/* Inline pre-design prompt for step 7 */}
                  {s.n === 7 ? (
                    <div className="mt-5">
                      <CopyBlock
                        filename="pre-design-review.md"
                        label="Paste into your coding agent"
                        code={preDesignReview}
                      />
                      <p className="mt-3 text-[13px] text-[color:var(--text-tertiary)]">
                        Findings go to <code className="font-mono text-[12px] rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-1.5 py-0.5">pre-design-review-report.md</code>. Every fix uses your <code className="font-mono text-[12px] rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-1.5 py-0.5">design-style-guide.md</code> tokens.
                      </p>
                    </div>
                  ) : null}

                  {/* Inline pre-deploy prompt for step 8 */}
                  {s.n === 8 ? (
                    <div className="mt-5">
                      <CopyBlock
                        filename="pre-deploy-review.md"
                        label="Paste into your coding agent"
                        code={preDeployReview}
                      />
                      <p className="mt-3 text-[13px] text-[color:var(--text-tertiary)]">
                        After the audit, your agent writes findings to <code className="font-mono text-[12px] rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-1.5 py-0.5">pre-deploy-review-report.md</code>. Address every Critical issue before deploying.
                      </p>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6">
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
              That's it
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-primary)]">
              Seven steps from idea to production. Bookmark this page — you'll repeat the flow for every new project.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/components" variant="accent" size="md">
                Browse JB components
              </Button>
              <Button href="/faq" variant="outline" size="md">
                Read the FAQ
              </Button>
            </div>
          </div>
        </article>
      </main>
      <Footer />

      {/* HowTo schema for AEO */}
      <Script
        id="ld-howto-quickstart"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Set up VibeKit",
            description: "Set up VibeKit and build a production-grade Next.js app with any AI coding agent in 8 steps.",
            totalTime: "PT15M",
            step: steps.map((s) => ({
              "@type": "HowToStep",
              position: s.n,
              name: s.title,
              text: s.body,
            })),
          }),
        }}
      />
    </>
  );
}
