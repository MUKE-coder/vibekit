import type { MetadataRoute } from "next";
import { components } from "@/lib/components-data";
import { templates } from "@/lib/templates-data";
import { SITE } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/components`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/docs`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/docs/what-is-vibekit`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/docs/quickstart`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/compare`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/compare/claude-code-vs-cursor-vs-cline`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE.url}/compare/vibekit-vs-create-next-app`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE.url}/contribute`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE.url}/tutorial`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE.url}/resources`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/templates`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/setup`, lastModified: now, changeFrequency: "monthly", priority: 0.95 },
    { url: `${SITE.url}/performance`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const componentRoutes: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${SITE.url}/components/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const templateRoutes: MetadataRoute.Sitemap = templates.map((t) => ({
    url: `${SITE.url}/templates/${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticRoutes, ...componentRoutes, ...templateRoutes];
}
