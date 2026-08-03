import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowUpRight, GitBranch } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { templates } from "@/lib/templates-data";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Templates - clone, customize, ship",
  description:
    "Public template repos for VibeKit users. Clone a portfolio, blog, or SaaS starter, then let your AI agent walk you through a customization interview.",
  alternates: { canonical: "/templates" },
  openGraph: {
    title: "VibeKit Templates - clone, customize, ship",
    description: "Production templates for portfolios, blogs, SaaS - with built-in customization guides.",
    url: `${SITE.url}/templates`,
    images: ["/og.png"],
  },
};

export default function TemplatesPage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow={`THE TEMPLATES · ${templates.length} READY TO CLONE`}
          title={
            <>
              Don't start from a blank repo. <em className="not-italic gradient-text">Clone a finished one.</em>
            </>
          }
          description="When the project type is well-known (portfolio, blog, SaaS dashboard), it's faster to clone a real working repo and customize it than to build from scratch. Each template ships with a built-in customization guide that your AI agent uses to interview you and edit only the parts that change between projects."
          containerClassName="max-w-5xl"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {templates.map((t) => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}`}
                className="group flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                    {t.categoryLabel}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
                </div>
                <h2 className="mt-3 font-mono text-[18px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  {t.name}
                </h2>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                  {t.tagline}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {t.stack.slice(0, 5).map((s) => (
                    <span
                      key={s}
                      className="rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--text-tertiary)]"
                    >
                      {s}
                    </span>
                  ))}
                  {t.stack.length > 5 ? (
                    <span className="font-mono text-[10px] text-[color:var(--text-tertiary)] py-0.5">
                      +{t.stack.length - 5}
                    </span>
                  ) : null}
                </div>

                <div className="mt-5 flex items-center gap-2 border-t border-[color:var(--border)] pt-4 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  <GitBranch className="h-3 w-3" />
                  {t.sections.length} customization sections
                </div>
              </Link>
            ))}
          </div>

          <div className="reveal mt-16 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-6">
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
              How it works
            </h3>
            <ol className="mt-4 space-y-2 text-[14.5px] text-[color:var(--text-primary)] [&_code]:font-mono [&_code]:text-[12.5px] [&_code]:rounded [&_code]:border [&_code]:border-[color:var(--border)] [&_code]:bg-[color:var(--bg-elevated)] [&_code]:px-1 [&_code]:py-0.5">
              <li>1. Pick a template that fits your project (portfolio, blog, SaaS, etc.).</li>
              <li>2. Clone it: <code>git clone &lt;cloneUrl&gt;</code></li>
              <li>3. Tell your AI agent: <em className="not-italic">"I want to customize this template using the customization guide. Walk me through the sections."</em></li>
              <li>4. The agent asks you the section-by-section questions defined in the template, then edits only what changes between projects (config files, copy, branding).</li>
              <li>5. <code>pnpm install &amp;&amp; pnpm dev</code> - yours.</li>
            </ol>
          </div>

          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contribute" variant="outline" size="md">
              <GitBranch className="h-4 w-4" />
              Contribute a template
            </Button>
            <Button href="/components" variant="outline" size="md">
              Browse components
            </Button>
          </div>
        </Section>
      </main>
      <Footer />

      <Script
        id="ld-templates"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "VibeKit Templates",
            url: `${SITE.url}/templates`,
            numberOfItems: templates.length,
            itemListElement: templates.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: t.name,
              description: t.tagline,
              url: `${SITE.url}/templates/${t.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
