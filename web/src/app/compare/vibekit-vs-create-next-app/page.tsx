import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "VibeKit vs create-next-app — when to use each",
  description:
    "create-next-app gives you a blank Next.js project. VibeKit gives you a planned project: design system, build phases, coding rules, and components. See which fits your project.",
  alternates: { canonical: "/compare/vibekit-vs-create-next-app" },
  openGraph: {
    url: `${SITE.url}/compare/vibekit-vs-create-next-app`,
    images: ["/og.png"],
    type: "article",
  },
};

type Row = { feature: string; cna: string | boolean; vibekit: string | boolean };

const rows: Row[] = [
  { feature: "Initial scaffold", cna: "Blank Next.js project", vibekit: "Planned project: 4 generated files + locked stack" },
  { feature: "Tech stack picked for you", cna: false, vibekit: true },
  { feature: "Auth ready out of the box", cna: false, vibekit: "JB Better Auth UI · one command" },
  { feature: "Database + ORM configured", cna: false, vibekit: "Neon + Prisma v7 in Phase 1" },
  { feature: "Design system applied", cna: false, vibekit: "Customized design-style-guide.md per project" },
  { feature: "Phase-by-phase build plan", cna: false, vibekit: true },
  { feature: "Pre-built components for common needs", cna: false, vibekit: "30+ in the JB + VibeKit registry (auth, files, Stripe, tables, kanban, charts, org UI, command palette)" },
  { feature: "Pre-deploy security audit", cna: false, vibekit: true },
  { feature: "Works with any AI coding agent", cna: "Yes, but agent has to figure out everything", vibekit: "Yes, with framework rules locked in" },
  { feature: "Time to first feature", cna: "Hours of setup before you can build", vibekit: "Phase 1 done in ~1–2 hours" },
  { feature: "Maintenance across projects", cna: "Each project drifts in its own direction", vibekit: "Same stack + patterns across every project" },
  { feature: "MIT licensed", cna: true, vibekit: true },
  { feature: "Free to use", cna: true, vibekit: true },
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

export default function CompareVibeKitCNA() {
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
              VibeKit vs create-next-app
            </h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              <code className="font-mono text-[15px] rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-1.5 py-0.5">create-next-app</code> gives you a blank Next.js project — every decision is still ahead of you. <strong className="font-medium text-[color:var(--text-primary)]">VibeKit</strong> gives you a <em className="not-italic font-medium text-[color:var(--text-primary)]">planned</em> project: stack locked, auth ready, design system customized, components installed, security audited.
            </p>
          </header>

          {/* TL;DR */}
          <section className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6">
              <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                Pick create-next-app if...
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                <li className="flex gap-2"><span className="text-[color:var(--text-tertiary)]">·</span>You're learning Next.js and want to make every decision yourself</li>
                <li className="flex gap-2"><span className="text-[color:var(--text-tertiary)]">·</span>You enjoy configuring tools and don't want opinions</li>
                <li className="flex gap-2"><span className="text-[color:var(--text-tertiary)]">·</span>Your project doesn't need auth, payments, file uploads, or a database</li>
                <li className="flex gap-2"><span className="text-[color:var(--text-tertiary)]">·</span>You're building a one-page brochure site with no backend</li>
              </ul>
            </div>
            <div className="rounded-md border border-[color:var(--accent)]/40 bg-[color:var(--accent-soft)] p-6">
              <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
                Pick VibeKit if...
              </h3>
              <ul className="mt-4 space-y-2 text-[14px] leading-relaxed text-[color:var(--text-primary)]">
                <li className="flex gap-2"><span className="text-[color:var(--accent)]">✓</span>You're shipping a real SaaS or production app</li>
                <li className="flex gap-2"><span className="text-[color:var(--accent)]">✓</span>You want auth, payments, file uploads, and email working in days, not weeks</li>
                <li className="flex gap-2"><span className="text-[color:var(--accent)]">✓</span>You use AI coding agents and want consistent output</li>
                <li className="flex gap-2"><span className="text-[color:var(--accent)]">✓</span>You build multiple projects and want a repeatable workflow</li>
              </ul>
            </div>
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
                        create-next-app
                      </th>
                      <th className="px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        VibeKit
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
                        <td className="px-5 py-3"><Cell value={r.cna} /></td>
                        <td className="px-5 py-3"><Cell value={r.vibekit} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Combined approach */}
          <section className="mt-14 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8">
            <h2 className="font-mono text-[14px] uppercase tracking-tight text-[color:var(--text-primary)]">
              They're not mutually exclusive
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
              VibeKit doesn't replace <code className="font-mono text-[13.5px] rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5">create-next-app</code> — it sits on top of it. Phase 1 of every VibeKit build literally starts with <code className="font-mono text-[13.5px] rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5">npx create-next-app@latest</code>. The difference is what happens next: instead of an empty <code className="font-mono text-[13.5px] rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5">app/page.tsx</code> staring at you, you have a phase-by-phase plan and an agent that knows exactly what to build.
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
        id="ld-article-vk-vs-cna"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "VibeKit vs create-next-app",
            description: "Comparison of VibeKit framework against the default Next.js scaffolder.",
            author: { "@type": "Person", name: "JB (Muke Johnbaptist)", url: SITE.authorUrl },
            publisher: { "@type": "Organization", name: "Desishub Technologies", url: "https://desishub.com" },
            mainEntityOfPage: `${SITE.url}/compare/vibekit-vs-create-next-app`,
          }),
        }}
      />
    </>
  );
}
