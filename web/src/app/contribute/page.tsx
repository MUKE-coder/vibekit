import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowUpRight, Check, GitBranch, Github } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { CopyBlock } from "@/components/copy-block";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contribute — add your component to VibeKit",
  description:
    "Add a production-ready component to VibeKit. Open a pull request with the install command, env vars, files it creates, and when to use it. We review and merge contributions weekly.",
  alternates: { canonical: "/contribute" },
  openGraph: { url: `${SITE.url}/contribute`, images: ["/og.png"] },
};

const componentTemplate = `{
  slug: "my-component",
  name: "My Component",
  tagline: "One sentence — what it does, who it's for.",
  category: "data", // auth | marketing | data | commerce | files | content | api | forms | hero | saas | productivity | team | documents
  categoryLabel: "Data",
  install: "pnpm dlx shadcn@latest add https://your-registry.com/r/my-component.json",
  blogUrl: "https://your-domain.com/blog/my-component",

  prerequisites: [
    "Next.js 16 + shadcn/ui",
    "PostgreSQL database",
    // anything else that must be set up first
  ],

  envVars: [
    { name: "MY_API_KEY", description: "Where to get it (e.g. service dashboard)" },
    // omit this field entirely if no env vars are needed
  ],

  features: [
    "Bullet point — what it does (a feature, not marketing fluff)",
    "Another bullet",
    "3–6 bullets total is the sweet spot",
  ],

  whenToUse: "One sentence describing the project type or use case where this is the right tool.",
  whenNotToUse: "One sentence describing when a different approach is better.",

  filesAdded: [
    "/route-it-creates",
    "/api/endpoint-it-adds",
    "components/component-name.tsx",
    "Prisma schema additions: ModelName",
    // list every file or route the install command produces
  ],
}`;

const checklistItems = [
  "Component is production-ready and documented (not a half-built prototype).",
  "Install command works end-to-end on a fresh Next.js 16 project.",
  "Schema entry includes every required field (see template below).",
  "Files-added list is accurate — every route, API, component, schema change.",
  "Env vars are enumerated with where to obtain them.",
  "Component category fits one of the existing categories OR you propose a new one in the PR.",
  "Component does not duplicate an existing JB component (check /components first).",
];

const steps = [
  {
    title: "Build & host the component",
    body: (
      <>
        Build a working component and publish it to a shadcn-compatible registry (your own
        domain works — e.g. <code>https://yourdomain.com/r/your-component.json</code>).
        Verify <code>pnpm dlx shadcn@latest add &lt;url&gt;</code> works on a fresh Next.js 16
        project.
      </>
    ),
  },
  {
    title: "Write a doc page",
    body: (
      <>
        Document what the component does. A blog post on your own site or a markdown file
        in the PR description both work — but it has to exist. Link it via the
        <code>blogUrl</code> field. This becomes the "Read full guide" button on the
        component's detail page.
      </>
    ),
  },
  {
    title: "Open a PR",
    body: (
      <>
        Fork the repo, edit{" "}
        <code>web/src/lib/components-data.ts</code>, add your entry using the schema below,
        and open a pull request. The PR template walks you through the checklist.
      </>
    ),
  },
  {
    title: "Review & merge",
    body: (
      <>
        We review weekly. Most PRs need one or two iterations on copy or schema. Once
        merged, your component appears at <code>/components/&lt;your-slug&gt;</code> and is
        loaded by every Claude Code agent reading the registry.
      </>
    ),
  },
];

export default function ContributePage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow="OPEN SOURCE · MIT"
          title={
            <>
              Got a component? <em className="not-italic gradient-text">Add it to the registry.</em>
            </>
          }
          description="VibeKit is community-driven. If you've built a production-grade component for auth, payments, file uploads, search, dashboards — anything reusable across projects — open a PR. We merge weekly."
          containerClassName="max-w-4xl"
        >
          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              href={`${SITE.github}/blob/main/CONTRIBUTING.md`}
              variant="accent"
              size="md"
            >
              <GitBranch className="h-4 w-4" />
              Read the contribution guide
            </Button>
            <Button
              href={`${SITE.github}/compare/main...main?expand=1&template=new-component.md`}
              variant="outline"
              size="md"
            >
              <Github className="h-4 w-4" />
              Open a new-component PR
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </Section>

        {/* Why contribute */}
        <Section
          eyebrow="WHY CONTRIBUTE"
          title="Build once. Ship in every project."
          description="A merged component is loaded by every developer using VibeKit — not just yours."
          containerClassName="max-w-4xl"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Distribution",
                body: "Your component gets a permanent doc page at /components/<slug>, indexed by search engines and AI answer engines.",
              },
              {
                title: "Credibility",
                body: "VibeKit is opinionated — making the cut signals your component is production-ready, not a weekend hack.",
              },
              {
                title: "Compounds",
                body: "Every Claude Code session reads jb-components.md. Your component becomes part of the agent's default toolkit across thousands of builds.",
              },
            ].map((c) => (
              <div
                key={c.title}
                className="reveal rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6"
              >
                <h3 className="font-mono text-[13px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  {c.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Steps */}
        <Section
          eyebrow="THE PROCESS"
          title="From idea to merged in 4 steps."
          description="No bureaucracy. Just a clear schema and a PR template."
          containerClassName="max-w-3xl"
        >
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <li key={s.title} className="reveal grid gap-5 sm:grid-cols-[auto_1fr]">
                <div className="font-mono text-[36px] font-light leading-none text-[color:var(--accent)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="min-w-0">
                  <h3 className="font-mono text-[16px] uppercase tracking-tight text-[color:var(--text-primary)]">
                    {s.title}
                  </h3>
                  <div className="mt-2 text-[15px] leading-[1.75] text-[color:var(--text-secondary)] [&_code]:font-mono [&_code]:text-[13px] [&_code]:rounded [&_code]:border [&_code]:border-[color:var(--border)] [&_code]:bg-[color:var(--bg-elevated)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[color:var(--text-primary)]">
                    {s.body}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Schema + template */}
        <Section
          eyebrow="THE SCHEMA"
          title="One file. One entry. Done."
          description={
            <>
              All component metadata lives in <code>web/src/lib/components-data.ts</code>.
              Copy this template, fill it in, and push to a new branch.
            </>
          }
          containerClassName="max-w-3xl"
        >
          <div className="reveal min-w-0">
            <CopyBlock
              filename="web/src/lib/components-data.ts"
              label="Append to the components array"
              language="ts"
              code={componentTemplate}
            />
          </div>

          <div className="reveal mt-10">
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              Each field, explained
            </h3>
            <dl className="mt-4 divide-y divide-[color:var(--border)] rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
              {[
                ["slug", "URL-safe identifier. Becomes /components/<slug>. Lowercase, hyphens, no spaces."],
                ["name", "Display name. Title case. Brief — 'JB Better Auth UI' beats 'The JB Better Auth UI Component System'."],
                ["tagline", "One sentence under 100 characters. What it does + who it's for."],
                ["category", "One of: auth | marketing | data | commerce | files | content | api | forms. Propose a new one in the PR if none fit."],
                ["categoryLabel", "Display label for the category tag."],
                ["install", "The exact command users run. Must be tested on a fresh Next.js 16 project."],
                ["blogUrl", "URL to a doc page explaining the component (your own blog, GitHub README, anywhere accessible)."],
                ["prerequisites", "Things that must exist before installing (database, other components, accounts). Optional."],
                ["envVars", "Each env var with name + description of where to obtain it. Omit field if none."],
                ["features", "3–6 bullet points describing capabilities. No marketing fluff."],
                ["whenToUse / whenNotToUse", "One sentence each. Honest about tradeoffs — readers respect that."],
                ["filesAdded", "Every route, API endpoint, component, and schema change the install creates. This is the most-checked field — be exhaustive."],
              ].map(([key, desc]) => (
                <div key={key} className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
                  <code className="font-mono text-[13px] text-[color:var(--accent)]">{key}</code>
                  <span className="text-[14px] leading-relaxed text-[color:var(--text-secondary)]">{desc}</span>
                </div>
              ))}
            </dl>
          </div>
        </Section>

        {/* Checklist */}
        <Section
          eyebrow="BEFORE YOU OPEN THE PR"
          title="Quality bar."
          description="We review for these. Hitting them is the fastest path to merge."
          containerClassName="max-w-3xl"
        >
          <ul className="reveal space-y-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6">
            {checklistItems.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[15px] leading-relaxed text-[color:var(--text-primary)]"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Final CTA */}
        <Section
          title="Ready to ship?"
          description="Fork the repo, add your entry, open a PR. We'll review within a week."
          containerClassName="max-w-3xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              href={`${SITE.github}/fork`}
              variant="accent"
              size="lg"
            >
              <Github className="h-4 w-4" />
              Fork on GitHub
              <ArrowUpRight className="h-4 w-4" />
            </Button>
            <Button
              href={`${SITE.github}/blob/main/web/src/lib/components-data.ts`}
              variant="outline"
              size="lg"
            >
              View components-data.ts
            </Button>
          </div>

          <div className="reveal mt-12 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-6 text-center">
            <p className="text-[14px] text-[color:var(--text-secondary)]">
              Not ready to PR? Join the{" "}
              <a
                href={SITE.community}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] underline underline-offset-4"
              >
                WhatsApp community
              </a>
              , star the{" "}
              <Link
                href={SITE.github}
                className="text-[color:var(--accent)] underline underline-offset-4"
              >
                GitHub repo
              </Link>
              , or chime in on{" "}
              <a
                href={`${SITE.github}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[color:var(--accent)] underline underline-offset-4"
              >
                GitHub Discussions
              </a>
              .
            </p>
          </div>
        </Section>
      </main>
      <Footer />

      {/* HowTo schema for AEO */}
      <Script
        id="ld-contribute"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Contribute a component to VibeKit",
            description:
              "Add a production-grade component to the VibeKit registry by opening a pull request.",
            totalTime: "PT30M",
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: typeof s.body === "string" ? s.body : `Step ${i + 1}: ${s.title}`,
            })),
          }),
        }}
      />
    </>
  );
}
