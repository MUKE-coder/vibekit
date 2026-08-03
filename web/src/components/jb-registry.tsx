import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Section } from "./section";
import { Button } from "./ui/button";
import { components } from "@/lib/components-data";

// Curated featured set - the most commonly installed JB + in-house components.
// The full list lives at /components.
const featuredSlugs = [
  "better-auth-ui",
  "website-ui",
  "stripe-ui",
  "data-table",
  "file-storage",
  "mdx-blog",
  "kanban-board",
  "charts-grid",
  "org-team-ui",
  "command-palette",
  "multi-step-form",
  "rich-text-editor",
] as const;

const featured = featuredSlugs
  .map((slug) => components.find((c) => c.slug === slug))
  .filter((c): c is NonNullable<typeof c> => Boolean(c));

export function JBRegistry() {
  return (
    <Section
      id="features"
      title={<>Don't write what already exists. <em className="not-italic text-[color:var(--accent)]">Install it.</em></>}
      description="Production-ready shadcn components for every primitive - auth, tables, forms, file uploads, e-commerce, kanban, charts, org/team UI. Claude Code (and Cursor, Cline, Codex) checks the registry before writing from scratch, so it installs and wires components up instead of re-generating them, saving tokens."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((c) => (
          <Link
            key={c.slug}
            href={`/components/${c.slug}`}
            className="reveal group flex items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                {c.categoryLabel}
              </div>
              <h3 className="mt-1.5 font-display text-[18px] leading-tight text-[color:var(--text-primary)]">
                {c.name}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
                {c.tagline}
              </p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
          </Link>
        ))}
      </div>

      <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button href="/components" variant="accent" size="md">
          Browse all {components.length} components
        </Button>
      </div>
    </Section>
  );
}
