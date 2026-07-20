import type { Metadata } from "next";
import { ArrowUpRight, BarChart3, Cpu, Database, Images, Layers, PackageOpen, Zap } from "lucide-react";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Performance by default",
  description:
    "VibeKit ships hard performance budgets, dual-layer caching (React Query + Redis), single animation library, automatic code splitting, and pre-deploy bundle analysis — so every AI-built app is fast by default, not by accident.",
  alternates: { canonical: "/performance" },
  openGraph: {
    url: `${SITE.url}/performance`,
    title: "Performance by default — VibeKit",
    description:
      "Hard performance budgets, Redis caching, single animation library, automatic code splitting. No performance fixes needed after shipping.",
    images: ["/og.png"],
  },
};

const metrics = [
  { metric: "First Load JS", target: "< 100KB per page", how: "next/dynamic for heavy imports, no 'use client' on server components" },
  { metric: "LCP", target: "< 2.5s", how: "next/image + priority, preloaded hero font, no client-side hero content" },
  { metric: "CLS", target: "< 0.1", how: "Fixed aspect-ratio on all media, explicit image dimensions" },
  { metric: "TBT", target: "< 200ms", how: "No heavy JS on main thread, chunked computations, Web Workers" },
  { metric: "API Response (p95)", target: "< 200ms", how: "Redis cache on hot paths, DB indexes on filtered columns, pagination" },
];

const perfFeatures = [
  {
    icon: Database,
    title: "Dual-Layer Caching",
    desc: "React Query on the client + Redis on the server. Client cache gives instant back-nav and optimistic updates. Redis offloads the database and shares cached results across all users — so 1,000 users viewing the same dashboard don't run 1,000 queries.",
    bad: "Every page load hits the database. No cache = slow responses under load.",
    good: "Redis serves cached API responses in <5ms. Database only queried when cache expires or data changes.",
  },
  {
    icon: PackageOpen,
    title: "Single Animation Library",
    desc: "Framer Motion handles both state transitions AND entrance animations. No GSAP unless you're building a complex marketing site with multi-pin scroll sequences. Dashboard/internal apps save ~40KB by never installing GSAP.",
    bad: "Two animation frameworks loaded = 75KB+ gzipped. Most pages don't use 90% of either library.",
    good: "One library at ~35KB. Framer Motion's whileInView replaces ScrollTrigger for 95% of use cases.",
  },
  {
    icon: Layers,
    title: "Automatic Code Splitting",
    desc: "Every import over 15KB gzipped must use next/dynamic. PDF renderer, spreadsheet parser, chart libraries, Stripe checkout — none of them load until the user actually needs them.",
    bad: "@react-pdf/renderer (85KB) loads on every page even if only one page exports invoices. xlsx (65KB) loads on the home page.",
    good: "Heavy libraries load on-demand. First Load JS stays under 100KB per page. Invoice export button triggers dynamic import only when clicked.",
  },
  {
    icon: Cpu,
    title: "Streaming & Suspense Boundaries",
    desc: "Every data-fetching section is wrapped in <Suspense> with a skeleton. The page renders immediately, and each section streams in as its data resolves. No section blocks another.",
    bad: "Page waterfalls: fetch user → fetch org → fetch dashboard stats → all data must resolve before ANYTHING renders.",
    good: "Dashboard shell renders instantly. Stats grid, recent orders, and activity feed each stream in independently. No waterfall, no blank page.",
  },
  {
    icon: Images,
    title: "Image Discipline",
    desc: "Every image must have aspect-ratio and explicit dimensions. All fonts use next/font/google with display: swap and preload on hero fonts. No layout shift, no invisible text.",
    bad: "Images without dimensions cause layout shifts as they load. Font swap causes text reflow. CLS of 0.3+ is common.",
    good: "Zero layout shift. Images respect their aspect ratio from the first paint. Fonts load with fallback text immediately visible.",
  },
  {
    icon: BarChart3,
    title: "Bundle Analysis in Pre-Deploy",
    desc: "Before shipping, the pre-deploy audit runs ANALYZE=true next build. Any chunk over 50KB is flagged and investigated. No bloated bundles slip through.",
    bad: "Blown-up bundles discovered in production. Users on slow networks wait 10+ seconds for JavaScript to parse.",
    good: "Every chunk is verified before deploy. If a bundle grows unexpectedly, it's caught before users see it.",
  },
];

const comparisonRows = [
  { feature: "First Load JS", vanilla: "200–500KB per page (eager PDF, xlsx, animation libs)", vibekit: "< 100KB per page (next/dynamic + single animation lib)" },
  { feature: "API Latency", vanilla: "50–200ms per request (database every time)", vibekit: "< 5ms cached (Redis hot paths)" },
  { feature: "Animation Bundle", vanilla: "75KB+ (GSAP + Framer Motion, both mostly unused)", vibekit: "35KB (Framer Motion only, fully utilized)" },
  { feature: "Page Render", vanilla: "Blocking waterfall (sequential awaits)", vibekit: "Streaming (parallel Suspense boundaries)" },
  { feature: "Layout Stability (CLS)", vanilla: "0.15–0.5 (unconstrained images, font swap)", vibekit: "< 0.1 (aspect-ratio, preloaded fonts)" },
  { feature: "DB Query Load", vanilla: "N+1 problems, no query caching, same query repeated per user", vibekit: "Redis cache absorbs 90%+ of reads, cache invalidation on writes" },
  { feature: "Bundle Awareness", vanilla: "Never checked. Bloated bundles discovered in production.", vibekit: "Pre-deploy ANALYZE=true next build. Chunks >50KB flagged." },
  { feature: "Animation Performance", vanilla: "Animations on top/left/width/height = layout thrashing", vibekit: "Transform + opacity only, will-change on heavy elements" },
];

export default function PerformancePage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[color:var(--border)] pb-16 sm:pb-24">
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--accent) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          </div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-16 sm:pt-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)]/60 backdrop-blur px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
              <Zap className="h-3 w-3 text-[color:var(--accent)]" />
              Performance by default
            </div>
            <h1 className="mt-6 font-mono text-[clamp(2.5rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight text-[color:var(--text-primary)]">
              Fast by default.
              <br />
              <span className="gradient-text">Not by accident.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-[color:var(--text-secondary)]">
              AI-built apps are slow by default — bloated bundles, uncached queries, dual animation frameworks, and layout-shifting images. VibeKit encodes performance as hard rules that the agent cannot skip.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button href="/docs/quickstart" variant="accent" size="lg">
                Get started
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button href="/docs" variant="outline" size="lg">
                Read the docs
              </Button>
            </div>
          </div>
        </section>

        {/* The Performance Budget */}
        <Section
          eyebrow="The numbers you'll hit"
          title={<>A hard budget, not a <em className="not-italic gradient-text">guideline</em>.</>}
          description="Every page must meet these thresholds. The agent checks each one before declaring a page done. No exceptions."
          containerClassName="max-w-5xl"
        >
          <div className="reveal overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[color:var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  <tr>
                    <th className="px-5 py-3 font-medium">Metric</th>
                    <th className="px-5 py-3 font-medium">Target</th>
                    <th className="px-5 py-3 font-medium">How it's enforced</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((m, i) => (
                    <tr key={m.metric} className={i !== metrics.length - 1 ? "border-b border-[color:var(--border)]" : ""}>
                      <td className="px-5 py-4 font-medium text-[color:var(--text-primary)]">{m.metric}</td>
                      <td className="px-5 py-4 font-mono text-[13px] text-[color:var(--accent)]">{m.target}</td>
                      <td className="px-5 py-4 text-[color:var(--text-secondary)]">{m.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Performance Features Grid */}
        <section className="border-t border-[color:var(--border)]">
          <Section
            eyebrow="Six performance layers"
            title={<>How VibeKit makes AI <em className="not-italic gradient-text">write fast code</em>.</>}
            description="Each layer targets a specific perf killer that AI-built apps suffer from — and enforces the fix with a rule the agent cannot override."
            containerClassName="max-w-6xl"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              {perfFeatures.map((f) => (
                <article
                  key={f.title}
                  className="reveal group rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition-all hover:border-[color:var(--border-strong)] sm:p-8"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-[color:var(--accent)]/10">
                      <f.icon className="h-5 w-5 text-[color:var(--accent)]" />
                    </div>
                    <h3 className="font-mono text-[16px] font-semibold uppercase tracking-tight text-[color:var(--text-primary)]">
                      {f.title}
                    </h3>
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                    {f.desc}
                  </p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:var(--bg)] p-4">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--text-tertiary)]">Without VibeKit</div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--danger-text, #DC2626)]">
                        {f.bad}
                      </p>
                    </div>
                    <div className="rounded-[var(--radius)] border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/[0.04] p-4">
                      <div className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--accent)]">With VibeKit</div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-[color:var(--text-primary)]">
                        {f.good}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Section>
        </section>

        {/* Comparison Table */}
        <section className="border-t border-[color:var(--border)]">
          <Section
            eyebrow="Vanilla AI vs VibeKit"
            title={<>The same app. One is <em className="not-italic gradient-text">10x faster</em>.</>}
            description="Same feature set. Same framework. The difference is whether performance rules exist or not."
            containerClassName="max-w-5xl"
          >
            <div className="reveal overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[color:var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                    <tr>
                      <th className="px-5 py-3 font-medium">Dimension</th>
                      <th className="px-5 py-3 font-medium text-[color:var(--text-tertiary)]">AI without VibeKit</th>
                      <th className="px-5 py-3 font-medium text-[color:var(--accent)]">VibeKit — by default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((r, i) => (
                      <tr key={r.feature} className={i !== comparisonRows.length - 1 ? "border-b border-[color:var(--border)]" : ""}>
                        <td className="px-5 py-4 font-medium text-[color:var(--text-primary)]">{r.feature}</td>
                        <td className="px-5 py-4 text-[13px] text-[color:var(--text-tertiary)]">{r.vanilla}</td>
                        <td className="px-5 py-4 text-[13px] text-[color:var(--accent)]">{r.vibekit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="reveal mt-6 text-center text-[13px] text-[color:var(--text-tertiary)]">
              These aren't aspirational targets — they're hard rules encoded in the master prompt. The agent cannot skip them.
            </p>
          </Section>
        </section>

        {/* CTA */}
        <section className="border-t border-[color:var(--border)]">
          <Section
            align="center"
            eyebrow="Ready to ship fast?"
            title={<>Stop fixing performance <em className="not-italic gradient-text">after</em> shipping.</>}
            description="The performance rules are already written. Your agent just needs to read them."
            containerClassName="max-w-2xl"
          >
            <div className="reveal mt-8 flex flex-wrap justify-center gap-4">
              <Button href="/docs/quickstart" variant="accent" size="lg">
                Get started
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button href={SITE.github} variant="outline" size="lg">
                View on GitHub
                <ArrowUpRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </Section>
        </section>
      </main>
      <Footer />
    </>
  );
}
