// Community showcase — real apps built with VibeKit.
//
// New entries are added by users via the GitHub issue template
// (.github/ISSUE_TEMPLATE/showcase-submission.yml); a maintainer then appends
// the approved project here. Keep entries HONEST — only list projects that were
// genuinely built with VibeKit, and never invent metrics or testimonials.

export type ShowcaseProject = {
  slug: string;
  /** Project name. */
  name: string;
  /** One-line description of what it does. */
  tagline: string;
  /** Live URL. */
  url: string;
  /** Who built it. */
  author: string;
  /** Optional link to the builder (portfolio, GitHub, X). */
  authorUrl?: string;
  /** Optional screenshot — a path under /public, or a remote URL. Falls back to
   *  a branded placeholder when omitted. */
  image?: string;
  /** Stack / notable features, shown as chips. */
  tags: string[];
  /** Flagship entries render first. */
  featured?: boolean;
};

export const showcaseProjects: ShowcaseProject[] = [
  {
    slug: "vibekit",
    name: "VibeKit",
    tagline:
      "The VibeKit framework's own site and docs — built with VibeKit, Next.js 16, Tailwind v4 and shadcn/ui.",
    url: "https://vibekit.desishub.com",
    author: "JB (Muke Johnbaptist)",
    authorUrl: "https://jb.desishub.com",
    image: "/og.png",
    tags: ["Next.js 16", "Tailwind v4", "shadcn/ui", "Docs site"],
    featured: true,
  },
];
