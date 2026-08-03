import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Compare - VibeKit vs other approaches",
  description:
    "Side-by-side comparisons of VibeKit against popular AI coding agents and Next.js starters. See where each approach wins.",
  alternates: { canonical: "/compare" },
  openGraph: { url: `${SITE.url}/compare`, images: ["/og.png"] },
};

const comparisons = [
  {
    slug: "claude-code-vs-cursor-vs-cline",
    title: "Claude Code vs Cursor vs Cline",
    blurb: "Three top AI coding agents - feature, cost, and workflow comparison. All three work with VibeKit.",
  },
  {
    slug: "vibekit-vs-create-next-app",
    title: "VibeKit vs create-next-app",
    blurb: "Blank Next.js project vs a planned VibeKit project. When to use each.",
  },
];

export default function CompareHub() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow="COMPARISONS"
          title={<>Side-by-side, <em className="not-italic gradient-text">no marketing fluff</em>.</>}
          description="Every approach has tradeoffs. These pages show them honestly - when VibeKit wins, when something else does."
          containerClassName="max-w-4xl"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="group flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                    Compare
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
                </div>
                <h2 className="mt-3 font-mono text-[18px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  {c.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                  {c.blurb}
                </p>
              </Link>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
