import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "FAQ — VibeKit Framework",
  description:
    "Frequently asked questions about VibeKit: which coding agents it supports, what's in the 4 generated files, how it differs from create-next-app, and more.",
  alternates: { canonical: "/faq" },
  openGraph: { url: `${SITE.url}/faq`, images: ["/og.png"] },
};

const faqs: { q: string; a: string }[] = [
  {
    q: "What is VibeKit?",
    a: "VibeKit is a structured framework for building production-grade Next.js applications with any AI coding agent. It generates four files (project-description.md, project-phases.md, design-style-guide.md, prompt.md) that lock the app's scope, build phases, and visual design before a single line of code is written. The agent then builds phase by phase using a locked tech stack: Next.js 16, Prisma v7, Better Auth, React Query, Zod, and Tailwind v4.",
  },
  {
    q: "Which AI coding agents does VibeKit work with?",
    a: "VibeKit works with any coding agent that reads project files. This includes Claude Code, Cursor, Kiro Code, Antigravity, Windsurf, Cline, Aider, Continue, Cody, v0, Lovable, and Bolt. The four generated files are agent-agnostic markdown — drop them into any project and the agent will read them as part of its context.",
  },
  {
    q: "How is VibeKit different from create-next-app?",
    a: "create-next-app gives you a blank Next.js project. VibeKit gives you a planned project: a customized design system, a phase-by-phase build plan, a coding constitution for the agent, a registry of 30+ pre-built components (auth, payments, file uploads, data tables, kanban, charts, org UI, multi-step forms, command palette, and more), and a pre-deploy security audit prompt. You start from a brief, not from boilerplate.",
  },
  {
    q: "Is VibeKit free?",
    a: "Yes, VibeKit is MIT licensed and free to use. You'll pay for the AI agent itself (Claude Code subscription, Cursor subscription, etc.) and for the cloud services your app uses (Neon Postgres, Vercel hosting, Resend for email, Stripe for payments). Most of those have generous free tiers for small projects.",
  },
  {
    q: "What tech stack does VibeKit lock you into?",
    a: "Next.js 16 (App Router), TypeScript 5.9, Tailwind CSS v4, shadcn/ui, Prisma v7 + Neon Postgres, Better Auth, React Query, React Hook Form + Zod, API Routes (Route Handlers), @react-pdf/renderer for PDFs, xlsx for Excel, Resend + React Email for transactional email, Stripe for payments, Cloudflare R2 or UploadThing for file storage, deployed on Vercel with Cloudflare DNS.",
  },
  {
    q: "Why lock the stack instead of letting the AI choose?",
    a: "Because AI agents are inconsistent. Without a locked stack, you'll get jsPDF in one project, react-pdf in the next; Drizzle here, Prisma there; useEffect for data fetching when React Query is right. The locked stack means every project is debuggable in the same way, every component is reusable across projects, and the agent never has to invent — it just builds.",
  },
  {
    q: "What does the pre-deploy review do?",
    a: "Before deploying, you paste pre-deploy-review.md into your coding agent. It performs a senior-level audit covering: high CPU tasks, performance bottlenecks (N+1 queries, missing pagination, memory leaks), background tasks (webhook idempotency, retry logic, distributed locks), and security (unauthenticated routes, SQL injection, missing rate limiting, exposed secrets). It writes findings as Critical / High / Medium to pre-deploy-review-report.md. You address Critical issues before going live.",
  },
  {
    q: "What's the component registry?",
    a: "A two-part registry of production-ready shadcn components: (1) the JB registry — Better Auth UI, File Storage UI (S3/R2), Stripe UI, Data Table, MDX Blog, Website UI, Zustand Cart, Searchable Select, Scalar API Docs, DGateway Shop (Mobile Money); and (2) the VibeKit in-house registry hosted at vibekit.desishub.com/r — Kanban Board, Rich Text Editor, Organization & Team UI, Charts & Dashboard Grid, Multi-Step Form, Command Palette, Notification Center, Advanced Form Elements, File Manager, Printable Templates, Ecommerce Product Grid, SaaS Subscription/Billing/Management. Your coding agent installs them with one command instead of writing from scratch — saving 60–80% of tokens per feature. Browse the full list at vibekit.desishub.com/components.",
  },
  {
    q: "Do I need to be a developer to use VibeKit?",
    a: "You need basic comfort with the command line, git, and reading code — but you don't need to write much code yourself. The agent does the writing. You'll review, confirm, and occasionally redirect. If you've successfully shipped anything with Cursor or Claude Code before, you can use VibeKit.",
  },
  {
    q: "How long does it take to build an app with VibeKit?",
    a: "A typical SaaS MVP — auth, dashboard, CRUD, payments, email, deploy — takes 8–20 hours of agent time spread across 3–7 days. Phase 1 (foundation: auth + layout + design system) is usually 1–2 hours. Each subsequent phase is 1–4 hours depending on feature complexity. The pre-deploy review and deployment take another 2–3 hours combined.",
  },
  {
    q: "Can I use VibeKit for something other than SaaS?",
    a: "Yes. The framework is opinionated about Next.js but agnostic about app type. People have used it for marketing sites (with the Website UI component), blogs (MDX Blog component), e-commerce stores (Stripe UI or DGateway Shop), internal admin tools, and learning platforms. Anything that fits the Next.js + Postgres + auth pattern.",
  },
  {
    q: "What if my agent gets stuck or loops on the same error?",
    a: "VibeKit ships with a rescue system. The troubleshooting.md guide has symptom-to-fix recipes, and prompt-engineering.md has three rescue techniques: the Hard Reset (start a new conversation with full context), the Decomposition (split a failing prompt into 3–4 small prompts), and the V0 Bypass (design visual issues in V0, hand off the result). The Phase-by-Phase build structure also limits how far things can drift between confirmations.",
  },
  {
    q: "Does VibeKit support dark mode?",
    a: "Yes — but only if you opt in. The planning interview asks if you want dark mode. If you say yes, the design-style-guide.md includes a dark palette, the master prompt enforces ThemeProvider + next-themes, and a toggle is added to the sidebar. If you say no, dark mode is skipped entirely — no extra code, no .dark classes, no toggle.",
  },
  {
    q: "Can I customize the design beyond the style guide?",
    a: "Absolutely. The design-style-guide.md is a starting point — once it's in your project, you and the agent can iterate on it. Change the primary color, swap fonts, adjust spacing. The master prompt enforces consistency across the app, but the tokens themselves are entirely yours to edit.",
  },
  {
    q: "Where do I get help if something breaks?",
    a: "Open an issue on the GitHub repo, reach out via the JB website (jb.desishub.com), or post in the Desishub community. For agent-specific issues (Claude Code limits, Cursor bugs), the agent's own Discord/Slack will be more responsive than us.",
  },
];

export default function FAQ() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow="FREQUENTLY ASKED"
          title={<>Common questions, <em className="not-italic gradient-text">direct answers</em>.</>}
          description="Everything you might want to know about VibeKit, the agents it supports, and how it compares to building from scratch."
          containerClassName="max-w-3xl"
        >
          <ol className="reveal divide-y divide-[color:var(--border)] rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
            {faqs.map((f, i) => (
              <li key={f.q} className="p-6 sm:p-8">
                <div className="flex items-start gap-5">
                  <span className="font-mono text-[24px] font-light leading-none text-[color:var(--accent)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-mono text-[16px] uppercase tracking-tight text-[color:var(--text-primary)]">
                      {f.q}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="reveal mt-12 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-6 text-center">
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              Still have a question?
            </h3>
            <p className="mt-2 text-[15px] text-[color:var(--text-primary)]">
              Open an issue on{" "}
              <a
                href={`${SITE.github}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] underline underline-offset-4"
              >
                GitHub
              </a>{" "}
              or read the{" "}
              <Link href="/docs" className="text-[color:var(--accent)] underline underline-offset-4">
                docs
              </Link>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />

      {/* FAQPage schema for AEO — direct lift in answer engines */}
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </>
  );
}
