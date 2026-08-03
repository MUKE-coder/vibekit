import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, X } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  components,
  getAllComponentSlugs,
  getComponentBySlug,
} from "@/lib/components-data";
import { SITE } from "@/lib/utils";

export function generateStaticParams() {
  return getAllComponentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getComponentBySlug(slug);
  if (!c) return { title: "Component not found" };

  const title = `${c.name} - VibeKit component`;
  const description = c.tagline;

  return {
    title,
    description,
    alternates: { canonical: `/components/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE.url}/components/${slug}`,
      images: ["/og.png"],
    },
    twitter: {
      title,
      description,
      images: ["/og.png"],
    },
  };
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getComponentBySlug(slug);
  if (!c) notFound();

  // Find related components (same category, excluding current)
  const related = components
    .filter((other) => other.category === c.category && other.slug !== c.slug)
    .slice(0, 3);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/components"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to components
          </Link>

          {/* Header */}
          <header className="mt-8 border-b border-[color:var(--border)] pb-12">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
              {c.categoryLabel} component
            </div>
            <h1 className="mt-3 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
              {c.name}
            </h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              {c.tagline}
            </p>

            {c.sourceLabel ? (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
                Source: {c.sourceLabel}
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              {c.blogUrl ? (
                <Button href={c.blogUrl} variant="accent" size="md">
                  Read full guide
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ) : null}
              <Button href="/components" variant={c.blogUrl ? "outline" : "accent"} size="md">
                Browse all components
              </Button>
            </div>
          </header>

          {/* Install command */}
          <Block title="Install">
            <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
              <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                $ Run in your project root
              </div>
              <pre className="mt-3 overflow-x-auto font-mono text-[13px] leading-relaxed text-[color:var(--text-primary)]">
                <code>{c.install}</code>
              </pre>
            </div>
          </Block>

          {/* Features */}
          <Block title="What it does">
            <ul className="space-y-3">
              {c.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px] leading-relaxed text-[color:var(--text-primary)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" aria-hidden />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Block>

          {/* When to use / not to use */}
          <Block title="When to use">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
                  <Check className="h-3.5 w-3.5" aria-hidden /> Use it
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--text-primary)]">
                  {c.whenToUse}
                </p>
              </div>
              <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  <X className="h-3.5 w-3.5" aria-hidden /> Skip it
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--text-primary)]">
                  {c.whenNotToUse}
                </p>
              </div>
            </div>
          </Block>

          {/* Prerequisites */}
          {c.prerequisites && c.prerequisites.length > 0 ? (
            <Block title="Prerequisites">
              <ul className="grid gap-2 sm:grid-cols-2">
                {c.prerequisites.map((p) => (
                  <li
                    key={p}
                    className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 font-mono text-[13px] text-[color:var(--text-primary)]"
                  >
                    {p}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {/* Env vars */}
          {c.envVars && c.envVars.length > 0 ? (
            <Block title="Environment variables">
              <div className="overflow-hidden rounded-md border border-[color:var(--border)]">
                <table className="w-full text-left">
                  <thead className="border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
                    <tr>
                      <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Name
                      </th>
                      <th className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.envVars.map((e, i) => (
                      <tr
                        key={e.name}
                        className={
                          i !== c.envVars!.length - 1
                            ? "border-b border-[color:var(--border)]"
                            : ""
                        }
                      >
                        <td className="px-5 py-3 font-mono text-[13px] text-[color:var(--text-primary)]">
                          {e.name}
                        </td>
                        <td className="px-5 py-3 text-[14px] text-[color:var(--text-secondary)]">
                          {e.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Block>
          ) : null}

          {/* Files added */}
          {c.filesAdded && c.filesAdded.length > 0 ? (
            <Block title="Files & routes added">
              <ul className="space-y-2">
                {c.filesAdded.map((f) => (
                  <li
                    key={f}
                    className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-2.5 font-mono text-[13px] text-[color:var(--text-primary)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </Block>
          ) : null}

          {/* Related */}
          {related.length > 0 ? (
            <Block title="Related components">
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/components/${r.slug}`}
                    className="group rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:border-[color:var(--border-strong)]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                        {r.categoryLabel}
                      </span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
                    </div>
                    <h4 className="mt-2 font-mono text-[13px] uppercase text-[color:var(--text-primary)]">
                      {r.name}
                    </h4>
                  </Link>
                ))}
              </div>
            </Block>
          ) : null}
        </div>
      </main>
      <Footer />

      {/* Structured data */}
      <Script
        id={`ld-component-${c.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: c.name,
            description: c.tagline,
            url: `${SITE.url}/components/${c.slug}`,
            programmingLanguage: "TypeScript",
            codeRepository: SITE.github,
            applicationCategory: "DeveloperApplication",
          }),
        }}
      />
      <Script
        id={`ld-breadcrumb-${c.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Components", item: `${SITE.url}/components` },
              { "@type": "ListItem", position: 3, name: c.name, item: `${SITE.url}/components/${c.slug}` },
            ],
          }),
        }}
      />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
