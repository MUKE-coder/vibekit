import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "What is VibeKit? — the Claude Code framework explained",
  description:
    "VibeKit is a structured framework for building production-grade Next.js apps with Claude Code. Learn what it is, what problem it solves, and why every vibe coder should use it.",
  alternates: { canonical: "/docs/what-is-vibekit" },
  openGraph: {
    url: `${SITE.url}/docs/what-is-vibekit`,
    images: ["/og.png"],
    type: "article",
  },
};

export default function WhatIsVibeKit() {
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
              Guide
            </div>
            <h1 className="mt-3 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
              What is VibeKit?
            </h1>
            <p className="mt-5 text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              VibeKit is a structured framework for vibe coders building production-grade Next.js applications with Claude Code or any AI agent — without burning tokens, shipping broken auth, or getting stuck in fix loops.
            </p>
          </header>

          <Prose>
            <h2>The short version</h2>
            <p>
              VibeKit gives Claude Code an opinionated tech stack, a phase-by-phase build plan, a customized design style guide, a pre-deploy security audit, and a registry of production-ready components. It eliminates the unpredictability of AI-generated code by locking every important decision before a single line of code is written.
            </p>

            <h2>What problem does it solve?</h2>
            <p>
              When you ask an AI to "build a SaaS", you get one of three outcomes — all bad:
            </p>
            <ol>
              <li><strong>Generic AI slop:</strong> purple gradients, default shadcn cards, every app looks identical.</li>
              <li><strong>Token burn:</strong> $100–$200 per project because the AI rewrites auth, tables, and forms from scratch every session.</li>
              <li><strong>Stuck builds:</strong> AI loops on the same broken fix for 30 minutes, context fills with junk, progress stalls.</li>
            </ol>
            <p>
              VibeKit removes all three failure modes by giving the agent everything it needs — locked stack, validated patterns, pre-built components — before the first prompt.
            </p>

            <h2>Who is it for?</h2>
            <ul>
              <li><strong>Vibe coders</strong> who use Claude Code (or any AI agent) and want production-quality output, not prototypes.</li>
              <li><strong>Solo founders</strong> shipping their first SaaS who can't afford to burn tokens debugging.</li>
              <li><strong>Indie hackers</strong> launching multiple apps and tired of reinventing auth, payments, file uploads.</li>
              <li><strong>Agencies</strong> using AI to deliver client work and needing consistent quality across projects.</li>
            </ul>

            <h2>What's in the framework?</h2>
            <p>VibeKit is two things working together:</p>
            <ol>
              <li>
                <strong>A planning prompt</strong> you paste into Claude (the chat web UI) along with your app idea. Claude interviews you and generates 4 files: <code>project-description.md</code>, <code>project-phases.md</code>, <code>design-style-guide.md</code>, and <code>prompt.md</code>.
              </li>
              <li>
                <strong>A coding constitution</strong> (<code>master_prompt.md</code>) that Claude Code follows during the build. It locks the stack — Next.js 16, Prisma v7, Better Auth, React Query, Tailwind v4, shadcn/ui — and enforces patterns like server-side pagination, Zod validation, and the JB component registry.
              </li>
            </ol>

            <h2>How does it work in practice?</h2>
            <p>The end-to-end flow is seven steps:</p>
            <ol>
              <li>Copy <code>CLAUDE_PROMPT.md</code> from the GitHub repo.</li>
              <li>Open Claude (claude.ai), paste the prompt, append your app idea.</li>
              <li>Answer 6–10 questions about features, data, integrations, and design.</li>
              <li>Receive 4 generated files. Save them in your project root.</li>
              <li>Run <code>npx @vibekit/cli init</code> — installs <code>master_prompt.md</code>, <code>jb-components.md</code>, <code>pre-deploy-review.md</code> and your agent&rsquo;s rules file.</li>
              <li>Open Claude Code and paste <code>prompt.md</code>. Claude Code builds phase by phase, stopping for confirmation between phases.</li>
              <li>Before deploying, run <code>pre-deploy-review.md</code> for a senior-level audit covering performance, security, and resource usage.</li>
            </ol>

            <h2>Why this approach beats "just prompt better"</h2>
            <p>
              Prompt engineering helps, but it doesn't solve the real problem: AI agents have no persistent memory between conversations and no opinion about <em>what good code looks like</em>. They default to whatever they saw most in training — which means generic, inconsistent, often insecure output.
            </p>
            <p>
              A framework is different. The rules persist across sessions. The component library means the AI never has to invent auth or file uploads from scratch. The pre-deploy review catches the security gaps that AI agents systematically miss (unauthenticated routes, missing webhook signature verification, mass assignment vulnerabilities).
            </p>
            <p>
              You're not making the AI smarter. You're making it impossible for the AI to take the wrong shortcut.
            </p>

            <h2>Is it free?</h2>
            <p>
              Yes. MIT licensed, open source, and free to use. You'll pay for Claude Code itself (Anthropic's subscription) and for the cloud services your app uses (Neon, Vercel, Resend, Stripe — most have free tiers).
            </p>

            <h2>Where do I start?</h2>
            <p>
              Read the <Link href="/docs/quickstart">quickstart guide</Link>, then head to the <a href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub repo</a> and copy <code>CLAUDE_PROMPT.md</code>.
            </p>
          </Prose>

          <div className="mt-12 flex flex-wrap gap-3 border-t border-[color:var(--border)] pt-8">
            <Button href="/docs/quickstart" variant="accent" size="md">
              Read the quickstart
            </Button>
            <Button href={SITE.github} variant="outline" size="md">
              Open the GitHub repo
            </Button>
          </div>
        </article>
      </main>
      <Footer />

      {/* Article schema for AEO */}
      <Script
        id="ld-article-what-is"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "What is VibeKit?",
            description: "A structured framework for building production-grade Next.js apps with Claude Code or any AI agent.",
            author: { "@type": "Person", name: "JB (Muke Johnbaptist)", url: SITE.authorUrl },
            publisher: { "@type": "Organization", name: "Desishub Technologies", url: "https://desishub.com" },
            mainEntityOfPage: `${SITE.url}/docs/what-is-vibekit`,
          }),
        }}
      />
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mt-10 space-y-6 text-[16px] leading-[1.75] text-[color:var(--text-primary)]
        [&_h2]:font-mono [&_h2]:text-[20px] [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-[color:var(--text-primary)] [&_h2]:mt-12 [&_h2]:mb-2
        [&_p]:text-[color:var(--text-secondary)]
        [&_strong]:text-[color:var(--text-primary)] [&_strong]:font-medium
        [&_a]:text-[color:var(--accent)] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:no-underline
        [&_code]:font-mono [&_code]:text-[13.5px] [&_code]:rounded [&_code]:border [&_code]:border-[color:var(--border)] [&_code]:bg-[color:var(--bg-elevated)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[color:var(--text-primary)]
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:my-2 [&_ol_li]:text-[color:var(--text-secondary)]
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:my-2 [&_ul_li]:text-[color:var(--text-secondary)]"
    >
      {children}
    </div>
  );
}
