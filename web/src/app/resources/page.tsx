import type { Metadata } from "next";
import Script from "next/script";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { GuideDownload } from "@/components/guide-download";
import { ResourcesBrowser } from "@/components/resources-browser";
import { resources } from "@/lib/resources-data";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resources — curated shadcn/ui ecosystem",
  description:
    "Searchable index of the best shadcn/ui registries, blocks, templates, themes, animation libraries, AI primitives, and tools. Curated from awesome-shadcn-ui for production builders.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "VibeKit Resources — curated shadcn/ui ecosystem",
    description: "Hand-picked registries, blocks, templates, animations, AI primitives, and tools.",
    url: `${SITE.url}/resources`,
    images: ["/og.png"],
  },
};

export default function ResourcesPage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow={`THE ECOSYSTEM · ${resources.length} RESOURCES`}
          title={
            <>
              Everything that pairs well with <em className="not-italic gradient-text">VibeKit</em>.
            </>
          }
          description="Hand-picked from the awesome-shadcn-ui list and our own builds. Registries, blocks, templates, themes, animations, AI primitives, deployment platforms — all curated for production use."
          containerClassName="max-w-6xl"
        >
          <GuideDownload variant="inline" className="reveal mb-10" />

          <ResourcesBrowser />

          <p className="mt-12 text-center text-[13px] text-[color:var(--text-tertiary)]">
            Source: <a
              href="https://github.com/birobirobiro/awesome-shadcn-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--text-secondary)] underline underline-offset-4 hover:text-[color:var(--text-primary)]"
            >github.com/birobirobiro/awesome-shadcn-ui</a> · curated and tagged for VibeKit users. Spotted a missing resource? <a
              href={`${SITE.github}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--accent)] underline underline-offset-4"
            >Open an issue</a>.
          </p>
        </Section>
      </main>
      <Footer />

      {/* JSON-LD: ItemList for AEO */}
      <Script
        id="ld-resources"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "VibeKit Curated shadcn/ui Resources",
            url: `${SITE.url}/resources`,
            numberOfItems: resources.length,
            itemListElement: resources.slice(0, 50).map((r, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: r.name,
              description: r.description,
              url: r.url,
            })),
          }),
        }}
      />
    </>
  );
}
