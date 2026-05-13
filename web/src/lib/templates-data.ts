export type TemplateCategory =
  | "portfolio"
  | "blog"
  | "saas"
  | "ecommerce"
  | "dashboard"
  | "landing"
  | "auth"
  | "admin"
  | "agency"
  | "coming-soon";

export type TemplateSection = {
  id: string;
  name: string;
  description: string;
  /** Questions Claude should ask to customize this section. */
  customizationQuestions: string[];
};

export type Template = {
  slug: string;
  name: string;
  tagline: string;
  category: TemplateCategory;
  categoryLabel: string;
  /** Public Git URL someone can clone. */
  cloneUrl: string;
  /** Optional original-author URL. */
  upstreamUrl?: string;
  /** Optional one-line live demo URL. */
  demoUrl?: string;
  /** Tech the template uses. */
  stack: string[];
  /** When this template is the right choice. */
  whenToUse: string;
  /** When NOT to use it (recommend a different starting point). */
  whenNotToUse: string;
  /** Top-level features the template ships with. */
  features: string[];
  /** Sections the template contains, with the questions Claude should ask to customize. */
  sections: TemplateSection[];
  /** Brief Claude should follow when an interview is matched to this template. */
  customizationGuide: string;
};

export const templates: Template[] = [
  {
    slug: "personal-portfolio",
    name: "Personal Developer Portfolio",
    tagline: "A polished single-page developer portfolio with blog support, animated sections, and a single-config-file edit point.",
    category: "portfolio",
    categoryLabel: "Portfolio",
    cloneUrl: "https://github.com/MUKE-coder/vibekit/tree/main/public-templates/portfolio",
    upstreamUrl: "https://github.com/dillionverma/portfolio",
    stack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "shadcn/ui",
      "Magic UI",
      "Framer Motion",
      "Content Collections (MDX blog)",
    ],
    whenToUse:
      "You're a developer, designer, or technical founder who wants a beautiful single-page portfolio that ships in one config-file edit. Includes a blog so you can publish without setting up a CMS.",
    whenNotToUse:
      "You need a multi-page agency site with services pages, case studies, and a contact form pipeline — pick a different template or build with VibeKit's Website UI component instead.",
    features: [
      "Single config file (`src/data/resume.tsx`) — your entire portfolio lives here",
      "Animated hero with avatar + intro",
      "Skills, work, education, projects, hackathons sections (each toggleable)",
      "MDX blog with syntax highlighting and SEO metadata",
      "Light + dark mode",
      "Mobile-first responsive",
      "One-click Vercel deploy",
    ],
    sections: [
      {
        id: "hero",
        name: "Hero",
        description: "Avatar, name, one-line intro, location, social handles.",
        customizationQuestions: [
          "What's your full name and a one-line intro? (e.g. \"Software engineer building developer tools\")",
          "Where are you based? (city, country)",
          "What's your avatar image URL? (square photo or a generated avatar)",
          "Which socials do you want in the hero? (GitHub, X/Twitter, LinkedIn, YouTube, email)",
        ],
      },
      {
        id: "about",
        name: "About / Summary",
        description: "Short bio paragraph that appears below the hero.",
        customizationQuestions: [
          "Write your bio in 3–5 sentences. What do you build? Who do you work with? What's your superpower?",
        ],
      },
      {
        id: "skills",
        name: "Skills",
        description: "Tag-style list of your skills/technologies.",
        customizationQuestions: [
          "List your top 8–15 skills (e.g. TypeScript, React, Next.js, PostgreSQL, AWS).",
        ],
      },
      {
        id: "work",
        name: "Work Experience",
        description: "Timeline of jobs with company, title, dates, logo, and one-paragraph description.",
        customizationQuestions: [
          "List your work experience in reverse-chronological order. For each: company name, your title, start/end dates, location, and 2–3 sentences about what you did.",
          "Do you have logos for each company? (URLs or local paths)",
        ],
      },
      {
        id: "education",
        name: "Education",
        description: "Schools / degrees / bootcamps.",
        customizationQuestions: [
          "List your education entries: institution, degree, dates, optional logo.",
          "Want to include this section, or skip it?",
        ],
      },
      {
        id: "projects",
        name: "Projects",
        description: "Featured projects — title, description, tech stack, image/video, live + source links.",
        customizationQuestions: [
          "Pick your top 3–6 projects. For each: title, 1–2 sentence description, tech stack, image or video URL, live demo URL, source URL.",
          "Are any of these private? If so, leave the source URL out and only show the live demo.",
        ],
      },
      {
        id: "hackathons",
        name: "Hackathons",
        description: "Hackathons / competitions you've won or participated in.",
        customizationQuestions: [
          "List hackathons (optional). For each: name, dates, location, what you built, place/award.",
          "Skip this section entirely if not applicable.",
        ],
      },
      {
        id: "blog",
        name: "Blog",
        description: "MDX-powered blog. Posts live in `content/blog/`.",
        customizationQuestions: [
          "Do you want the blog enabled? If yes, do you have 1–3 starter posts to seed it, or should it start empty?",
          "Should the blog be in the nav, or only accessible via direct URL?",
        ],
      },
      {
        id: "contact",
        name: "Contact / footer",
        description: "Footer with social links and optional contact email/CTA.",
        customizationQuestions: [
          "Should the footer have a CTA? (e.g. \"Get in touch\" → mailto, or \"Hire me\" → external form)",
          "Confirm your social URLs match the hero socials.",
        ],
      },
      {
        id: "branding",
        name: "Branding & Theme",
        description: "Colors, fonts, favicon.",
        customizationQuestions: [
          "What's your brand color? (hex)",
          "Default theme: light, dark, or follow system?",
          "Do you want a custom favicon? (URL or describe)",
        ],
      },
    ],
    customizationGuide:
      "When the user picks this template, walk them through the 10 sections IN ORDER. Ask the questions for each section, gather answers, then write the entire `src/data/resume.tsx` file based on their answers. Set the brand color in the Tailwind config + `globals.css`. Replace placeholder copy with their answers. Don't change file structure — only edit the config file and content/blog/.",
  },

  {
    slug: "developer-blog",
    name: "Developer Blog",
    tagline: "Modern Next.js + Fumadocs MDX blog with dark mode, tags, featured posts, and clean typography.",
    category: "blog",
    categoryLabel: "Blog",
    cloneUrl: "https://github.com/MUKE-coder/vibekit/tree/main/public-templates/blog-template",
    stack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Fumadocs MDX",
      "shadcn/ui",
    ],
    whenToUse:
      "You want to publish technical posts, tutorials, or insights — and you want a clean reading experience without setting up a CMS or fighting with Wordpress.",
    whenNotToUse:
      "You need user accounts, comments, paid subscriptions, or multi-author workflows — use Substack, Ghost, or a real CMS.",
    features: [
      "MDX-powered posts with full component support",
      "Dark / light theme toggle",
      "Tags + categories",
      "Featured posts surface on the homepage",
      "Mobile responsive",
      "Built-in syntax highlighting",
      "SEO metadata per post",
    ],
    sections: [
      {
        id: "branding",
        name: "Branding",
        description: "Site name, tagline, favicon, social card.",
        customizationQuestions: [
          "What's the blog's name and one-line tagline?",
          "What's your brand color? (hex — used for accents, not the body)",
          "Do you have a favicon and OG image, or should I generate placeholders?",
        ],
      },
      {
        id: "navigation",
        name: "Navigation",
        description: "Top nav links and footer.",
        customizationQuestions: [
          "What top nav links do you want? (e.g. Home, Blog, Tags, About, Contact)",
          "What footer links do you want? (e.g. Twitter, GitHub, RSS, About)",
        ],
      },
      {
        id: "homepage",
        name: "Homepage",
        description: "Lead intro + featured posts grid + recent posts list.",
        customizationQuestions: [
          "Write a 1–3 sentence intro for the homepage (about you / about the blog).",
          "How many featured posts should appear at the top? (typically 1–3)",
          "How many recent posts in the list below? (typically 6–10)",
        ],
      },
      {
        id: "post-template",
        name: "Post template",
        description: "Frontmatter fields, layout, share/related-posts widgets.",
        customizationQuestions: [
          "What fields should the post frontmatter support? (defaults: title, description, date, tags, cover, featured)",
          "Do you want a share-to-Twitter button on each post?",
          "Do you want a 'related posts' section at the bottom (by shared tags)?",
        ],
      },
      {
        id: "tags",
        name: "Tags page",
        description: "/tags index + /tags/[slug] pages listing posts by tag.",
        customizationQuestions: [
          "Should we generate static /tags/[slug] pages for each tag, or keep it as filter-only on the main /blog page?",
        ],
      },
      {
        id: "seed-content",
        name: "Seed content",
        description: "Initial blog posts to ship with the template.",
        customizationQuestions: [
          "Do you have 1–3 starter posts you want to seed into the blog, or should it ship empty with a sample 'Hello world' post?",
        ],
      },
      {
        id: "deploy",
        name: "Deployment",
        description: "Where you'll host the blog.",
        customizationQuestions: [
          "Will you deploy to Vercel? (recommended — works out of the box)",
          "Do you have a custom domain to point at it?",
        ],
      },
    ],
    customizationGuide:
      "Walk the user through Branding → Navigation → Homepage → Post template → Tags → Seed content → Deployment. After answers, edit `app/layout.tsx` for branding, `components/navbar.tsx` for nav, `app/page.tsx` for homepage layout, `source.config.ts` for frontmatter schema, and seed the `blog/content/` folder with their starter posts. Don't restructure the project.",
  },

  {
    slug: "notio",
    name: "Notio",
    tagline: "Call-transcription / note-taking SaaS landing — hero with phone mock, logo cloud, feature beam, stats, team, testimonials, pricing, login.",
    category: "saas",
    categoryLabel: "SaaS",
    cloneUrl: "https://github.com/MUKE-coder/vibekit/tree/main/public-templates/notio",
    upstreamUrl: "https://styleui.dev/",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Motion / Framer Motion",
      "Light + dark mode",
    ],
    whenToUse:
      "AI-powered SaaS, productivity tools, recording or note-taking apps, anything that needs a polished marketing site with a single-product narrative and a clean pricing page.",
    whenNotToUse:
      "Multi-product marketplaces, agency sites, or content-heavy publications — the layout assumes a single product story.",
    features: [
      "Navbar + animated hero with phone mockup",
      "Trusted-by logo cloud (Loom, Notion, Slack, Coinbase, Webflow, Uber, etc.)",
      "Beam-wrapped features grid",
      "Stats band + team grid",
      "Testimonials carousel",
      "Pricing (free + paid tier)",
      "Auth /login page",
      "Light + dark mode toggle",
    ],
    sections: [
      {
        id: "branding",
        name: "Branding",
        description: "Logo, brand color, typography, light/dark default.",
        customizationQuestions: [
          "What's the product name and one-line tagline?",
          "What's your brand color? (hex — used for accents and CTAs)",
          "Do you have a logo, or want me to keep the Notio placeholder for now?",
          "Default theme: light, dark, or follow system?",
        ],
      },
      {
        id: "hero",
        name: "Hero",
        description: "Headline + sub + primary CTA + product mock.",
        customizationQuestions: [
          "What's the hero headline? (one sentence, ideally with a verb)",
          "What's the sub-headline? (1–2 sentences explaining the value)",
          "Primary CTA label + URL? (e.g. 'Start for free' → /auth/login)",
          "Want to keep the phone mockup or replace with a screenshot of your product?",
        ],
      },
      {
        id: "logos",
        name: "Logo cloud",
        description: "'Trusted by' / 'Works with' brand strip.",
        customizationQuestions: [
          "Which logos should appear? (4–8 brands — yours or integrations)",
          "Is this 'Trusted by' or 'Integrates with'?",
        ],
      },
      {
        id: "features",
        name: "Features",
        description: "Beam-framed feature grid with icon + headline + body.",
        customizationQuestions: [
          "List 4–6 features: short title + 1-sentence description each.",
          "Want icons (Lucide) or screenshots in each feature card?",
        ],
      },
      {
        id: "stats",
        name: "Stats",
        description: "Single-row metric band (e.g. 1M+ calls transcribed).",
        customizationQuestions: [
          "What 3–4 stats best demonstrate traction or product power? (number + short label each)",
        ],
      },
      {
        id: "team",
        name: "Team",
        description: "Team grid with avatars and roles.",
        customizationQuestions: [
          "Do you want a team section, or remove it for v1?",
          "If keeping it: list founders/team members with name, role, and avatar URL.",
        ],
      },
      {
        id: "testimonials",
        name: "Testimonials",
        description: "Customer quotes with avatar + role + company logo.",
        customizationQuestions: [
          "Do you have 3–6 real customer quotes? (otherwise we'll keep placeholders)",
          "For each: quote, author name, role, company logo or name.",
        ],
      },
      {
        id: "pricing",
        name: "Pricing",
        description: "Free + paid tiers with feature lists.",
        customizationQuestions: [
          "Free tier feature list (5–8 items)?",
          "Paid tier monthly price + feature list (5–8 items)?",
          "Where should the CTA link to? (Stripe checkout, /auth/signup, etc.)",
        ],
      },
      {
        id: "auth",
        name: "Login page",
        description: "/auth/login — connect to Better Auth or skip if marketing-only.",
        customizationQuestions: [
          "Are we wiring up auth (recommend: JB Better Auth UI) or keeping /auth/login as a static placeholder?",
          "If auth: Google? GitHub? Email-only?",
        ],
      },
    ],
    customizationGuide:
      "This is a single-page SaaS landing. Walk the user through Branding → Hero → Logo cloud → Features → Stats → Team → Testimonials → Pricing → Auth. Edit `src/components/<section>.tsx` for each — every section is its own component. For brand color, edit `src/app/globals.css` Tailwind v4 tokens. To connect real auth, install JB Better Auth UI (see jb-components.md) and replace `/auth/login`. Do NOT change file structure — only the content of each section component.",
  },

  {
    slug: "axis",
    name: "Axis",
    tagline: "CRM for consultants landing — blurred orb hero, companies strip, feature blocks, tool feature, stats, testimonials, pricing, auth.",
    category: "saas",
    categoryLabel: "SaaS",
    cloneUrl: "https://github.com/MUKE-coder/vibekit/tree/main/public-templates/axis",
    upstreamUrl: "https://styleui.dev/",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind CSS v4",
      "shadcn/ui",
      "Motion / Framer Motion",
      "Light + dark mode",
    ],
    whenToUse:
      "B2B SaaS, CRM, sales tools, professional-services software, anywhere you want an editorial 'serious product' aesthetic with bold sections and rich product screenshots.",
    whenNotToUse:
      "Consumer or playful brands — Axis leans editorial/professional. For B2C launches use Notio or one of the v0 landing variants instead.",
    features: [
      "Navbar with theme toggle",
      "Hero with blurred-orb gradient backdrop",
      "Companies / trusted-by strip",
      "Feature blocks with product screenshots",
      "Tool feature deep-dive",
      "Stats band",
      "Testimonials grid",
      "Pricing tiers",
      "Auth /auth page",
      "Light + dark mode with full token system",
    ],
    sections: [
      {
        id: "branding",
        name: "Branding",
        description: "Logo, brand color, typography, light/dark default.",
        customizationQuestions: [
          "What's the product name and one-line tagline?",
          "What's your brand color? (hex — used for accents and CTAs)",
          "Default theme: light, dark, or follow system?",
        ],
      },
      {
        id: "hero",
        name: "Hero",
        description: "Headline + sub + CTA pair + dashboard mock + blurred orb.",
        customizationQuestions: [
          "What's the hero headline? (e.g. 'The CRM built for how consultants actually work')",
          "Sub-headline (1–2 sentences)?",
          "Primary CTA label + URL?",
          "Secondary CTA label + URL? (e.g. 'Watch Demo')",
          "Keep the dashboard mock or replace with your product screenshot?",
        ],
      },
      {
        id: "companies",
        name: "Companies / trusted by",
        description: "Logo strip of customer or integration brands.",
        customizationQuestions: [
          "Which logos? (4–8 brands — yours or integrations)",
          "Is this 'Trusted by' or 'Integrates with'?",
        ],
      },
      {
        id: "feature",
        name: "Feature blocks",
        description: "Stacked feature sections with product screenshots and copy.",
        customizationQuestions: [
          "List 3–4 feature blocks: headline + 1-paragraph body + screenshot URL.",
          "Image-left or image-right preference? (current default alternates)",
        ],
      },
      {
        id: "tool-feature",
        name: "Tool feature",
        description: "Deep-dive section for the headline tool / capability.",
        customizationQuestions: [
          "What's the single capability you want to highlight here? (one product feature in depth)",
          "Provide a screenshot or animation URL.",
        ],
      },
      {
        id: "stats",
        name: "Stats",
        description: "Single-row metric band.",
        customizationQuestions: [
          "What 3–4 stats best demonstrate traction? (number + short label each)",
        ],
      },
      {
        id: "testimonials",
        name: "Testimonials",
        description: "Customer quotes grid.",
        customizationQuestions: [
          "Do you have 3–6 real customer quotes?",
          "For each: quote, author name, role, company.",
        ],
      },
      {
        id: "pricing",
        name: "Pricing",
        description: "Tier cards with feature lists and CTA.",
        customizationQuestions: [
          "How many tiers? (typically 2–3)",
          "Each tier: name, monthly price, feature list, CTA URL.",
        ],
      },
      {
        id: "auth",
        name: "Auth page",
        description: "/auth — wire to Better Auth or keep as a placeholder.",
        customizationQuestions: [
          "Wire to JB Better Auth UI, or keep /auth as a static placeholder for now?",
          "If auth: Google? GitHub? Email-only?",
        ],
      },
    ],
    customizationGuide:
      "Single-page B2B SaaS landing. Walk through Branding → Hero → Companies → Feature blocks → Tool feature → Stats → Testimonials → Pricing → Auth. Each section is `src/components/<name>.tsx`. The blurred-orb backdrop uses Tailwind v4 CSS variables `--color-hero-start/mid/end` in `src/app/globals.css` — edit those to retune the gradient. To wire real auth, install JB Better Auth UI and replace `/auth`. Don't restructure files — only edit section contents and design tokens.",
  },
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getAllTemplateSlugs(): string[] {
  return templates.map((t) => t.slug);
}
