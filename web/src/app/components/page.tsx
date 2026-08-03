import type { Metadata } from "next";
import Script from "next/script";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Section } from "@/components/section";
import { ComponentsBrowser } from "@/components/components-browser";
import { components } from "@/lib/components-data";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Components - production-ready primitives for VibeKit projects",
  description:
    "Browse the JB Component Registry: production-ready shadcn components for auth, file uploads, Stripe checkout, data tables, blogs, e-commerce, and more. Install with one command.",
  alternates: { canonical: "/components" },
  openGraph: {
    title: "VibeKit Components - production-ready primitives",
    description:
      "Production-ready shadcn components for auth, payments, data tables, file uploads, e-commerce, and more.",
    url: `${SITE.url}/components`,
    images: ["/og.png"],
  },
};

export default function ComponentsPage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow={`THE REGISTRY · ${components.length} COMPONENTS`}
          title={<>Production-ready primitives. <em className="not-italic gradient-text">One command.</em></>}
          description="Don't write what already exists. Each component ships with full source, env var setup, and Prisma schema additions where needed. Claude Code installs them on demand."
          containerClassName="max-w-6xl"
        >
          <ComponentsBrowser />
        </Section>
      </main>
      <Footer />

      {/* JSON-LD: ItemList for AEO */}
      <Script
        id="ld-components"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "VibeKit Component Registry",
            url: `${SITE.url}/components`,
            numberOfItems: components.length,
            itemListElement: components.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              description: c.tagline,
              url: `${SITE.url}/components/${c.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
