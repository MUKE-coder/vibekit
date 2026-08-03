import type { Metadata } from "next";
import Script from "next/script";
import { ArrowUpRight, Plus } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { showcaseProjects } from "@/lib/showcase-data";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Showcase - apps built with VibeKit",
  description:
    "A gallery of real applications built with the VibeKit framework. Browse what the community has shipped, then submit your own project.",
  alternates: { canonical: "/showcase" },
  openGraph: {
    title: "VibeKit Showcase - apps built with VibeKit",
    description: "Real apps shipped with VibeKit. Browse the community gallery and submit yours.",
    url: `${SITE.url}/showcase`,
    images: ["/og.png"],
  },
};

// Opens the GitHub issue form so anyone can submit a project in a few fields.
const SUBMIT_URL = `${SITE.github}/issues/new?template=showcase-submission.yml`;

export default function ShowcasePage() {
  const projects = [...showcaseProjects].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
  );

  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow="COMMUNITY SHOWCASE"
          title={
            <>
              Shipped with <em className="not-italic gradient-text">VibeKit</em>.
            </>
          }
          description="Real applications built with the framework. Browse what the community has shipped for inspiration - then add your own. New here? Start with the quickstart and come back when you've launched."
          containerClassName="max-w-6xl"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.slug}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
              >
                {/* Preview */}
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)]">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={`${p.name} screenshot`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div
                      className="grid h-full w-full place-items-center"
                      style={{
                        background:
                          "radial-gradient(ellipse 70% 60% at 50% 30%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
                      }}
                    >
                      <span className="font-display text-5xl tracking-tight text-[color:var(--text-primary)] opacity-80">
                        {p.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {p.featured ? (
                    <span className="absolute left-3 top-3 rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                      Featured
                    </span>
                  ) : null}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-mono text-[16px] uppercase tracking-tight text-[color:var(--text-primary)]">
                      {p.name}
                    </h2>
                    <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
                  </div>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--text-tertiary)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-[12.5px] text-[color:var(--text-tertiary)]">
                    by <span className="text-[color:var(--text-secondary)]">{p.author}</span>
                  </div>
                </div>
              </a>
            ))}

            {/* Submit-your-project card - always the last cell */}
            <a
              href={SUBMIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-[var(--radius-lg)] border border-dashed border-[color:var(--border-strong)] bg-[color:var(--bg-subtle)] p-8 text-center transition-colors hover:border-[color:var(--accent)] hover:bg-[color:var(--bg-elevated)]"
            >
              <div className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--bg-elevated)] text-[color:var(--accent)] transition-transform group-hover:scale-110">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <div className="font-mono text-[15px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  Add your project
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
                  Built something with VibeKit? Submit it in a few fields and
                  we&rsquo;ll add it to the gallery.
                </p>
              </div>
            </a>
          </div>

          {/* Submit banner */}
          <div className="reveal mt-16 flex flex-col items-center justify-between gap-5 rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="font-display text-[22px] tracking-tight text-[color:var(--text-primary)]">
                Shipped an app with VibeKit?
              </h3>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[color:var(--text-secondary)]">
                Get it featured here. Submissions go through a short GitHub issue
                form - name, link, a screenshot, and the stack. No account tricks,
                no fees.
              </p>
            </div>
            <a
              href={SUBMIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[color:var(--accent)] px-7 text-base font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter] duration-150 hover:brightness-110 active:brightness-95"
            >
              <Plus className="h-4 w-4" />
              Submit your project
            </a>
          </div>
        </Section>
      </main>
      <Footer />

      {/* JSON-LD: ItemList for AEO */}
      <Script
        id="ld-showcase"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Apps built with VibeKit",
            url: `${SITE.url}/showcase`,
            numberOfItems: projects.length,
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: p.name,
              description: p.tagline,
              url: p.url,
            })),
          }),
        }}
      />
    </>
  );
}
