import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Documentation — VibeKit framework guides",
  description:
    "Documentation for the VibeKit framework: getting started, the master prompt, the JB + VibeKit component registry, deployment, troubleshooting, and the pre-deploy review.",
  alternates: { canonical: "/docs" },
  openGraph: { url: `${SITE.url}/docs`, images: ["/og.png"] },
};

const guides = [
  {
    slug: "what-is-vibekit",
    title: "What is VibeKit?",
    blurb: "An overview of the framework: what problem it solves, how it works, and who it's for.",
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    blurb: "From a blank Claude conversation to a deployed Next.js app — step by step.",
  },
];

const externalGuides = [
  { name: "Master prompt", href: `${SITE.github}/blob/main/master_prompt.md`, blurb: "The coding constitution Claude Code follows on every build." },
  { name: "JB + VibeKit components", href: `${SITE.github}/blob/main/jb-components.md`, blurb: "The component registry reference — when to install which component." },
  { name: "Design style guide", href: `${SITE.github}/blob/main/design-style-guide.md`, blurb: "Tailwind v4 tokens + visual rules customized per project." },
  { name: "Database guide", href: `${SITE.github}/blob/main/database-guide.md`, blurb: "Neon + Prisma v7: schema, migrations, query patterns." },
  { name: "Deployment", href: `${SITE.github}/blob/main/deployment.md`, blurb: "Vercel + Cloudflare DNS + SSL + email domain verification." },
  { name: "Environment variables", href: `${SITE.github}/blob/main/environment-variables.md`, blurb: "Step-by-step setup for every secret per integration." },
  { name: "Monetization", href: `${SITE.github}/blob/main/monetization-guide.md`, blurb: "Stripe, webhooks, feature gating, billing pages." },
  { name: "DGateway (Mobile Money)", href: `${SITE.github}/blob/main/dgateway-guide.md`, blurb: "Mobile money + card checkout for African markets — gotchas and patterns baked in." },
  { name: "Multi-tenant / RBAC", href: `${SITE.github}/blob/main/multi-tenant.md`, blurb: "Orgs, memberships, role-based access, scoped queries, custom subdomains." },
  { name: "Audit log (hash-chained)", href: `${SITE.github}/blob/main/audit-log.md`, blurb: "Tamper-evident audit log pattern for SOC2 / compliance." },
  { name: "AI & RAG", href: `${SITE.github}/blob/main/ai-guide.md`, blurb: "Vercel AI SDK + pgvector in Neon + Upstash rate-limit + credit packs." },
  { name: "Agent tooling", href: `${SITE.github}/blob/main/agent-tooling.md`, blurb: "ui-ux-pro-max-skill + 21st.dev Magic MCP — user-level installs that compound VibeKit's value." },
  { name: "VibeKit Primitives (150)", href: `${SITE.github}/blob/main/vibekit-primitives.md`, blurb: "GitHub-registry library of hooks, helpers, and small components. 86 shipped (Phases 1–6, 57%). Install via `MUKE-coder/vibekit/<name>`." },
  { name: "Pre-deploy review", href: `${SITE.github}/blob/main/pre-deploy-review.md`, blurb: "Senior-level audit prompt to run before going live." },
  { name: "Prompt engineering", href: `${SITE.github}/blob/main/prompt-engineering.md`, blurb: "5-part formula, token economy, rescue system." },
  { name: "Troubleshooting", href: `${SITE.github}/blob/main/troubleshooting.md`, blurb: "Symptoms → fixes when AI gets stuck." },
];

export default function DocsHub() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        <Section
          eyebrow="DOCUMENTATION"
          title={<>Everything you need to ship.</>}
          description="The framework lives in two places: this site (which you can read straight through), and the GitHub repo (which contains the actual prompts and reference guides Claude Code uses)."
          containerClassName="max-w-5xl"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {guides.map((g) => (
              <Link
                key={g.slug}
                href={`/docs/${g.slug}`}
                className="group flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition-all hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                    Guide
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-[color:var(--text-tertiary)] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
                </div>
                <h2 className="mt-3 font-mono text-[18px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  {g.title}
                </h2>
                <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                  {g.blurb}
                </p>
              </Link>
            ))}
          </div>

          <div className="reveal mt-16">
            <h2 className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              Reference (on GitHub)
            </h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {externalGuides.map((g) => (
                <a
                  key={g.name}
                  href={g.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition-colors hover:border-[color:var(--border-strong)]"
                >
                  <div className="flex-1">
                    <div className="font-mono text-[13px] uppercase text-[color:var(--text-primary)]">
                      {g.name}
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[color:var(--text-secondary)]">
                      {g.blurb}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--text-tertiary)] transition-colors group-hover:text-[color:var(--text-primary)]" />
                </a>
              ))}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
