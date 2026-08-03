import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink, GitBranch, X } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CopyBlock } from "@/components/copy-block";
import {
  templates,
  getAllTemplateSlugs,
  getTemplateBySlug,
} from "@/lib/templates-data";
import { SITE } from "@/lib/utils";

export function generateStaticParams() {
  return getAllTemplateSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplateBySlug(slug);
  if (!t) return { title: "Template not found" };

  const title = `${t.name} - VibeKit template`;
  return {
    title,
    description: t.tagline,
    alternates: { canonical: `/templates/${slug}` },
    openGraph: {
      title,
      description: t.tagline,
      url: `${SITE.url}/templates/${slug}`,
      images: ["/og.png"],
    },
  };
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = getTemplateBySlug(slug);
  if (!t) notFound();

  const related = templates
    .filter((other) => other.category === t.category && other.slug !== t.slug)
    .slice(0, 3);

  // Customization prompt the user can paste into their agent
  const customizePrompt = `I want to customize the "${t.name}" template using the VibeKit customization guide.

Walk me through the ${t.sections.length} sections one at a time. For each section, ask the questions defined in the guide below, wait for my answers, then move on.

After all sections are answered, edit ONLY the files needed to apply my answers - config files, content, branding. Don't restructure the project.

CUSTOMIZATION GUIDE:
${t.customizationGuide}

SECTIONS:
${t.sections.map((s, i) => `${i + 1}. ${s.name} - ${s.description}\n   Questions: ${s.customizationQuestions.map((q) => `\n     - ${q}`).join("")}`).join("\n\n")}

Begin with section 1 now.`;

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)] transition-colors hover:text-[color:var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to templates
          </Link>

          <header className="mt-8 border-b border-[color:var(--border)] pb-12">
            <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
              {t.categoryLabel} template
            </div>
            <h1 className="mt-3 font-mono text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
              {t.name}
            </h1>
            <p className="mt-5 max-w-2xl text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              {t.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {t.stack.map((s) => (
                <span
                  key={s}
                  className="rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2 py-0.5 font-mono text-[11px] text-[color:var(--text-secondary)]"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={t.cloneUrl} variant="accent" size="md">
                <GitBranch className="h-4 w-4" />
                View on GitHub
                <ExternalLink className="h-4 w-4" />
              </Button>
              {t.upstreamUrl ? (
                <Button href={t.upstreamUrl} variant="outline" size="md">
                  Upstream source
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ) : null}
              {t.demoUrl ? (
                <Button href={t.demoUrl} variant="outline" size="md">
                  Live demo
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </header>

          {/* Clone command */}
          <Block title="Clone it">
            <CopyBlock
              filename="terminal"
              label="Clone the template"
              code={`git clone https://github.com/MUKE-coder/vibekit.git /tmp/vibekit-templates
cp -r /tmp/vibekit-templates/public-templates/${t.slug === "personal-portfolio" ? "portfolio" : "blog-template"} ./${t.slug}
cd ${t.slug}
pnpm install
pnpm dev`}
            />
          </Block>

          {/* Features */}
          <Block title="What's in the box">
            <ul className="space-y-3">
              {t.features.map((f) => (
                <li
                  key={f}
                  className="flex gap-3 text-[15px] leading-relaxed text-[color:var(--text-primary)]"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
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
                  <Check className="h-3.5 w-3.5" /> Use it
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--text-primary)]">
                  {t.whenToUse}
                </p>
              </div>
              <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  <X className="h-3.5 w-3.5" /> Skip it
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--text-primary)]">
                  {t.whenNotToUse}
                </p>
              </div>
            </div>
          </Block>

          {/* Sections */}
          <Block title={`The ${t.sections.length} customization sections`}>
            <p className="mb-5 text-[14.5px] leading-relaxed text-[color:var(--text-secondary)]">
              When you ask your AI agent to customize this template, it will walk through these sections in order, asking you the questions for each. The agent only edits the files needed to apply your answers - no restructuring.
            </p>
            <ol className="space-y-3">
              {t.sections.map((s, i) => (
                <li
                  key={s.id}
                  className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)] tabular-nums">
                      {String(i + 1).padStart(2, "0")} · {s.name}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                      {s.customizationQuestions.length} q
                    </span>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                    {s.description}
                  </p>
                  <ul className="mt-3 space-y-1.5 border-t border-[color:var(--border)] pt-3">
                    {s.customizationQuestions.map((q) => (
                      <li
                        key={q}
                        className="flex gap-2 text-[13.5px] leading-relaxed text-[color:var(--text-primary)]"
                      >
                        <span className="text-[color:var(--text-tertiary)]">→</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Block>

          {/* Customization prompt to paste */}
          <Block title="Customization prompt - paste into your AI agent">
            <p className="mb-4 text-[14.5px] leading-relaxed text-[color:var(--text-secondary)]">
              After you clone, open the project in Claude Code, Cursor, Cline, or any agent that reads files. Paste this prompt to start the section-by-section interview:
            </p>
            <CopyBlock
              filename="paste into your AI agent"
              label="Customization interview prompt"
              code={customizePrompt}
            />
          </Block>

          {/* Related */}
          {related.length > 0 ? (
            <Block title="Other templates">
              <div className="grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/templates/${r.slug}`}
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

      <Script
        id={`ld-template-${t.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareSourceCode",
            name: t.name,
            description: t.tagline,
            url: `${SITE.url}/templates/${t.slug}`,
            programmingLanguage: "TypeScript",
            codeRepository: t.cloneUrl,
            applicationCategory: "DeveloperApplication",
          }),
        }}
      />
      <Script
        id={`ld-breadcrumb-${t.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Templates", item: `${SITE.url}/templates` },
              { "@type": "ListItem", position: 3, name: t.name, item: `${SITE.url}/templates/${t.slug}` },
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
