import type { Metadata } from "next";
import Script from "next/script";
import {
  ArrowUpRight,
  Boxes,
  ChartLine,
  Clock,
  Code,
  Layers,
  PackageCheck,
  Receipt,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Footer } from "@/components/footer";
import { GuideDownload } from "@/components/guide-download";
import { Nav } from "@/components/nav";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { CopyBlock } from "@/components/copy-block";
import { VideoEmbed } from "@/components/video-embed";
import { AgentInstallTabs } from "@/components/agent-install-tabs";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "VibeKit Crash Course - build a Hardware POS in one afternoon",
  description:
    "Step-by-step crash course: build HardwarePOS, a real point-of-sale system for a hardware shop, using VibeKit and any AI coding agent. From idea to deployed in ~3 hours. Every prompt copyable inline.",
  alternates: { canonical: "/tutorial" },
  openGraph: {
    url: `${SITE.url}/tutorial`,
    images: ["/og.png"],
    type: "article",
  },
};

const hardwarePosIdea = `I want to build HardwarePOS - a point-of-sale system for a small hardware shop in
Uganda. The shop owner uses it to ring up sales of items like nails, paint,
plumbing fittings, electrical supplies, and hand tools. Single user (the shop
owner / cashier) - no team features, no customer-facing storefront, no online
ordering. Strictly in-shop POS.

Core flows:

1. POS Sale (the main screen): search products by name or SKU, add to cart,
   adjust quantities, see live total. Choose payment method (Cash / Mobile Money /
   Card). Capture optional customer name and phone. Complete sale, then download
   a receipt PDF.

2. Inventory: list products with name, SKU, category, price (UGX), and stock
   quantity. Add new products, edit price/stock, delete. Low-stock alerts when
   stock falls below a configurable threshold per product.

3. Sales history: list of past sales with date, total, payment method, items
   count, customer (if captured). Filter by date range and payment method. View
   a single sale's full line items. Export the day's sales to a PDF report.

4. Dashboard: today's sales total + transaction count, top 5 products this week,
   low-stock alert count, weekly revenue chart (last 7 days).

Seed the database with these categories on first run: Tools, Hardware, Paint,
Plumbing, Electrical, Other.

No image uploads - text-only products (name + SKU + category is enough).
No e-commerce / cart abandonment / online ordering / customer accounts.
Currency: UGX (Ugandan Shillings) with comma-separated formatting and no decimals
(e.g., 25,000 not 25,000.00).

Single user, single device. Light + dark mode. Aesthetic: clean dashboard like
Linear or Vercel - bold large numbers so the cashier can read totals at a glance.
Brand color: indigo (#4F46E5).`;

const modules = [
  {
    Icon: PackageCheck,
    eyebrow: "MODULE 01",
    title: "Set up the accounts you'll need",
    time: "5 min",
    intro: "All free tiers cover the entire course. Sign up first so you don't break flow later.",
  },
  {
    Icon: Sparkles,
    eyebrow: "MODULE 02",
    title: "Plan with Claude (claude.ai)",
    time: "15 min",
    intro: "Paste the VibeKit planning prompt + the HardwarePOS brief into Claude. Walk away with 4 files that define the entire build.",
  },
  {
    Icon: Layers,
    eyebrow: "MODULE 03",
    title: "Initialize the project",
    time: "10 min",
    intro: "Scaffold a Next.js 16 project, drop in the 4 generated files plus the 3 framework files, open your coding agent.",
  },
  {
    Icon: ShieldCheck,
    eyebrow: "MODULE 04",
    title: "Phase 1 - Foundation",
    time: "30 min",
    intro: "Auth, layout shell, design tokens, Prisma + Neon. By the end you can sign in to the empty dashboard.",
  },
  {
    Icon: Boxes,
    eyebrow: "MODULE 05",
    title: "Phase 2 - Products & Inventory",
    time: "30 min",
    intro: "Categories + Products schema, CRUD API routes, inventory list page with low-stock badges, add/edit forms.",
  },
  {
    Icon: Receipt,
    eyebrow: "MODULE 06",
    title: "Phase 3 - POS Sale flow + Receipt PDF",
    time: "45 min",
    intro: "The core feature. Product search, cart, checkout with payment method, sale persistence, downloadable receipt PDF using @react-pdf/renderer.",
  },
  {
    Icon: ChartLine,
    eyebrow: "MODULE 07",
    title: "Phase 4 - Dashboard + Sales History",
    time: "25 min",
    intro: "Today's sales stat cards, weekly revenue chart, top-5 products, low-stock counter, full sales history with date-range filters.",
  },
  {
    Icon: Code,
    eyebrow: "MODULE 08",
    title: "Pre-deploy review + Deploy",
    time: "40 min",
    intro: "Run the senior-level audit, fix every Critical, push to GitHub, deploy to Vercel, optional custom domain.",
  },
];

export default function TutorialPage() {
  return (
    <>
      <Nav />
      <main className="pt-28">
        {/* Hero */}
        <section className="relative pb-12 sm:pb-20 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 grid-pattern opacity-50"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 65%)",
            }}
          />

          <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
              </span>
              Crash course · 8 modules · ~3 hours
            </div>

            <h1 className="font-display mt-6 text-[clamp(2.25rem,6.5vw,4.5rem)] leading-[1.04] tracking-tight text-[color:var(--text-primary)]">
              Build a real <em className="not-italic gradient-text">Hardware POS</em> in one afternoon.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
              Follow this crash course and ship <strong className="font-medium text-[color:var(--text-primary)]">HardwarePOS</strong> - a point-of-sale system a hardware shop in Kampala could use today. Inventory, sales, payment methods, downloadable receipts, deployed to a custom domain. Powered by VibeKit + your favorite AI coding agent.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a href="#module-01" className="contents">
                <Button variant="accent" size="lg">
                  Start the course
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </a>
              <Button href={SITE.community} variant="outline" size="lg">
                Join the community
              </Button>
            </div>

            {/* Prefer to read first? The beginner's guide covers this whole path. */}
            <div className="mx-auto mt-8 max-w-xl text-left">
              <GuideDownload variant="inline" />
            </div>
          </div>

          {/* Video - full crash course companion */}
          <div className="mx-auto mt-16 max-w-4xl px-4 sm:px-6">
            <VideoEmbed
              videoId="TvGu_Tu-6UI"
              thumbnail="https://14j7oh8kso.ufs.sh/f/HLxTbDBCDLwf0VdAvuLtvnF3cx4uPCTU9aqg2f0oY8klybGQ"
              title="VibeKit Crash Course - full walkthrough"
              caption="Watch the full crash course on YouTube as you follow the modules below"
            />
          </div>
        </section>

        {/* What you'll build */}
        <Section
          eyebrow="WHAT YOU'LL BUILD"
          title="HardwarePOS - a real shop POS."
          description="Not a tutorial toy. Real auth, real database, real transactions, real receipts. A hardware shop owner could install this Monday morning and start using it."
          containerClassName="max-w-5xl"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="reveal rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6">
              <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
                Features you'll ship
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-[color:var(--text-primary)]">
                {[
                  "Email + Google OAuth sign-in (Better Auth)",
                  "Inventory: products with SKU, price (UGX), stock, category",
                  "Six seeded categories: Tools, Hardware, Paint, Plumbing, Electrical, Other",
                  "Low-stock alerts (configurable per product)",
                  "POS sale screen: product search, cart, live total",
                  "Three payment methods: Cash, Mobile Money, Card",
                  "Optional customer name + phone capture",
                  "Receipt PDF download (@react-pdf/renderer)",
                  "Sales history with date-range filtering",
                  "Dashboard: today's revenue, top products, weekly chart",
                  "Light + dark mode",
                  "Deployed to Vercel + custom domain",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6">
              <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)]">
                Skills you'll learn
              </h3>
              <ul className="mt-4 space-y-2.5 text-[14.5px] text-[color:var(--text-primary)]">
                {[
                  "Planning a real product with Claude before any code",
                  "Reading a phase-by-phase build plan",
                  "Modeling transactional data in Prisma v7 (Sale + SaleItem pattern)",
                  "Wiring auth-guarded API routes with Zod validation",
                  "Atomic stock decrements inside Prisma transactions",
                  "Building a fast product search with React Query",
                  "Generating styled PDFs with @react-pdf/renderer",
                  "Aggregating data with groupBy for dashboards",
                  "Currency formatting (UGX, no decimals, comma-separated)",
                  "Running a senior-level pre-deploy audit",
                  "Deploying with Vercel + Cloudflare DNS + SSL",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[color:var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Total time", value: "~3 hrs" },
              { label: "Modules", value: "8" },
              { label: "Lines you write", value: "~0" },
              { label: "Cost (free tiers)", value: "$0" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] p-4 text-center"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  {s.label}
                </div>
                <div className="mt-1 font-mono text-[20px] font-semibold tabular-nums text-[color:var(--text-primary)]">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Module index */}
        <Section
          eyebrow="THE 8 MODULES"
          title="The full path."
          description="Click any module to jump in. They build on each other - follow them in order on your first run."
          containerClassName="max-w-4xl"
        >
          <ol className="grid gap-3 sm:grid-cols-2">
            {modules.map((m, i) => {
              const slug = `module-${String(i + 1).padStart(2, "0")}`;
              return (
                <li key={slug}>
                  <a
                    href={`#${slug}`}
                    className="group flex items-start gap-4 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--text-secondary)] transition-colors group-hover:text-[color:var(--accent)]">
                      <m.Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          {m.eyebrow}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                          <Clock className="h-3 w-3" />
                          {m.time}
                        </span>
                      </div>
                      <h3 className="mt-1 font-mono text-[13.5px] uppercase tracking-tight text-[color:var(--text-primary)]">
                        {m.title}
                      </h3>
                    </div>
                  </a>
                </li>
              );
            })}
          </ol>
        </Section>

        {/* MODULE 00 - pre-flight environment check */}
        <ModuleSection slug="module-00" eyebrow="MODULE 00 · 2 min · OPTIONAL BUT RECOMMENDED" title="Check your environment first">
          <p>
            Before signing up for accounts, make sure your machine has the four tools VibeKit needs: <strong>Node 20+</strong>, <strong>pnpm 9+</strong>, <strong>git</strong>, and <strong>gh CLI</strong>. The fastest way to check is to paste the OS-specific prompt at <a href="/setup">vibekit.desishub.com/setup</a> into your AI coding agent - it scans your machine, reports what's installed, and gives you one-line install commands for anything missing. Without installing anything itself.
          </p>
          <p>
            If you already have all four installed, skip to Module 01.
          </p>

          <div className="not-prose mt-6 flex flex-wrap gap-3">
            <a
              href="/setup"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-5 py-2.5 font-medium text-[color:var(--accent-fg)] transition hover:-translate-y-0.5"
            >
              Open the setup check →
            </a>
          </div>
        </ModuleSection>

        {/* MODULE 01 */}
        <ModuleSection slug="module-01" eyebrow="MODULE 01 · 5 min" title="Set up the accounts you'll need">
          <p>
            All of these have free tiers that cover the entire course. Sign up first so you don't break flow later.
          </p>

          <Checklist
            items={[
              { name: "Anthropic Claude (chat)", url: "https://claude.ai", note: "Free tier works for the planning step" },
              { name: "Claude Code or Cursor", url: "https://www.anthropic.com/claude-code", note: "Pick whichever AI coding agent you prefer" },
              { name: "Neon", url: "https://neon.tech", note: "Postgres database - free tier" },
              { name: "Vercel", url: "https://vercel.com", note: "Deployment - free hobby tier" },
              { name: "Resend", url: "https://resend.com", note: "Transactional email - free tier" },
              { name: "GitHub account", url: "https://github.com", note: "For pushing your code + Vercel auto-deploy" },
            ]}
          />

          <h3>Local tools</h3>
          <ul>
            <li><strong>Node.js 20+</strong> (or 22+) - <code>node -v</code> to check</li>
            <li><strong>pnpm</strong> - <code>npm i -g pnpm</code> if missing</li>
            <li><strong>git</strong> - already installed on most systems</li>
          </ul>

          <Tip>
            Don't have a Resend account? You can skip it for now and add it during Module 04 - auth still works without email verification in dev.
          </Tip>
        </ModuleSection>

        {/* MODULE 02 */}
        <ModuleSection slug="module-02" eyebrow="MODULE 02 · 15 min" title="Plan with Claude (claude.ai)">
          <p>
            VibeKit's planning step turns a one-line idea into 4 production-ready files. You paste a prompt, answer questions, and Claude does the rest.
          </p>

          <h3>Step 1 - Open the planning prompt</h3>
          <p>
            Go to <a href="/docs/quickstart">/docs/quickstart</a> and copy <code>CLAUDE_PROMPT.md</code> from the first code block (or grab it directly from <a href={`${SITE.github}/blob/main/CLAUDE_PROMPT.md`} target="_blank" rel="noopener noreferrer">the repo</a>).
          </p>

          <h3>Step 2 - Open Claude</h3>
          <p>
            Go to <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">claude.ai/new</a>. Paste the entire <code>CLAUDE_PROMPT.md</code> as your first message. Then on a new line, paste the HardwarePOS brief:
          </p>

          <CopyBlock
            filename="Append after CLAUDE_PROMPT.md content"
            label="HardwarePOS brief"
            code={hardwarePosIdea}
          />

          <h3>Step 3 - Paste a Dribbble reference (mandatory)</h3>
          <p>
            Claude will now ask for a UI reference image. This is non-skippable - even though the HardwarePOS brief is detailed, words like "clean dashboard" are too vague to design from. A real Dribbble shot tells Claude exactly which color palette, font weight, card style, and button shape to match.
          </p>
          <ol>
            <li>Claude will suggest 2-3 search terms (e.g. <code>"pos dashboard ui"</code>, <code>"retail point of sale"</code>).</li>
            <li>Open <a href="https://dribbble.com/search" target="_blank" rel="noopener noreferrer">dribbble.com/search</a> and search one of them.</li>
            <li>Pick a shot whose aesthetic you'd want HardwarePOS to match. Open the shot in full size.</li>
            <li><strong>Right-click → Copy Image</strong>, then paste it into the Claude chat. (Don't paste a Dribbble URL - paste the image itself.)</li>
            <li>Claude will analyze it and echo back the palette + typography + card spec it extracted. Confirm or correct.</li>
          </ol>
          <Tip>
            For HardwarePOS specifically, look for shots with bold large numbers (cashier-readable totals), clean tables, soft cards. Avoid shots that are too "creative agency" - POS UIs need to be fast and legible, not editorial.
          </Tip>

          <h3>Step 4 - Wait for Claude's confirmation summary</h3>
          <p>
            The HardwarePOS brief above is detailed, so Claude will probably skip the interview. Instead, it will write a structured summary like this:
          </p>
          <CopyBlock
            label="What Claude will produce"
            code={`## What I understood

App: HardwarePOS - a single-user POS for a hardware shop in Uganda
Primary user: the shop owner / cashier
Core features:
  - POS sale flow (search → cart → payment → receipt)
  - Inventory with low-stock alerts
  - Sales history with date filters
  - Dashboard with daily revenue + top products + weekly chart
Data model: Category, Product, Sale, SaleItem (with snapshot fields)
Integrations: Better Auth (email + Google OAuth), Resend (auth emails only),
  Payments: NONE (payment method is just a captured label),
  File uploads: NONE, Dark mode: Yes
Visual design: indigo (#4F46E5), Geist + JetBrains Mono,
  "fast, focused, large numbers", Linear/Vercel inspiration
Out of scope (v1): online ordering, customer accounts, multi-cashier roles

Does this match your intent? Reply 'Yes, generate the files' to proceed,
or tell me what to adjust.`}
          />
          <p>If anything's wrong, correct it now (e.g., "Add Excel export to the sales history"). Otherwise, reply:</p>
          <CopyBlock
            label="Reply to Claude"
            code={`Yes, generate the files`}
          />

          <h3>Step 5 - Download the 4 files</h3>
          <p>Claude will produce 4 downloadable Artifacts (one per file) in the right-side panel. Each has a download icon - click it to save the file.</p>

          <CopyBlock
            filename="terminal"
            label="Create the project folder first"
            code={`mkdir hardware-pos && cd hardware-pos
# Then drop the 4 downloaded files into this folder:
# - project-description.md
# - project-phases.md
# - design-style-guide.md
# - prompt.md`}
          />

          <Tip>
            <em>Prefer one-shot creation?</em> At the end of Claude's message there's a single bash heredoc block that creates all 4 files at once - copy it, paste into your terminal inside <code>hardware-pos/</code>, hit enter. Done.
          </Tip>

          <Tip>
            If Claude tries to skip the confirmation step and dives straight into generating, paste: <em>"Stop. First show me the structured 'What I understood' summary and wait for my confirmation. Don't generate anything yet."</em>
          </Tip>
        </ModuleSection>

        {/* MODULE 03 */}
        <ModuleSection slug="module-03" eyebrow="MODULE 03 · 10 min" title="Initialize the project">
          <p>
            Scaffold the Next.js 16 project, copy the framework's coding constitution into it, open your coding agent.
          </p>

          <h3>Step 1 - Scaffold Next.js</h3>
          <CopyBlock
            filename="terminal"
            label="From inside the hardware-pos folder"
            code={`pnpm create next-app@latest . --typescript --tailwind --app --eslint --import-alias "@/*" --turbopack --no-src-dir`}
          />
          <p>Accept the prompts. When it finishes, you have a base Next.js 16 project.</p>

          <h3>Step 2 - Copy the framework files</h3>
          <p>Clone the VibeKit repo to grab the framework files:</p>
          <CopyBlock
            filename="terminal"
            label="One-time clone (delete after copying)"
            code={`git clone https://github.com/MUKE-coder/vibekit.git /tmp/vibekit

cp /tmp/vibekit/master_prompt.md ./master_prompt.md
cp /tmp/vibekit/jb-components.md ./jb-components.md
cp /tmp/vibekit/pre-deploy-review.md ./pre-deploy-review.md`}
          />

          <h3>Step 3 - Install the VibeKit rules for your AI agent</h3>
          <p>
            VibeKit ships rules for every major AI coding agent. Pick your agent below and run the one-line install. The rules auto-load whenever you open the agent in this project - no need to paste long prompts every session.
          </p>

          <AgentInstallTabs />

          <Tip>
            <em>Switching between agents on the same project?</em> Install for all of them at once - see the "Multi-agent setup" section in <a href={`${SITE.github}/blob/main/skill/README.md`} target="_blank" rel="noopener noreferrer">skill/README.md</a>. One canonical file, symlinked to each agent's expected path.
          </Tip>

          <h3>Step 4 - Verify your project root</h3>
          <p>You should now have these 7 files in your project root:</p>
          <CopyBlock
            filename="ls -la"
            label="Expected files"
            code={`hardware-pos/
├── master_prompt.md            # framework - coding rules
├── jb-components.md            # framework - component registry
├── pre-deploy-review.md        # framework - security audit prompt
├── project-description.md      # generated by Claude
├── project-phases.md           # generated by Claude
├── design-style-guide.md       # generated by Claude
├── prompt.md                   # generated by Claude - paste this next
│
# ONE of these from Step 3 (depending on your agent):
├── .claude/skills/vibekit/SKILL.md   # Claude Code
├── .cursor/rules/vibekit.mdc         # Cursor
├── AGENTS.md                         # Codex CLI / universal
├── .clinerules                       # Cline
├── .windsurfrules                    # Windsurf
├── GEMINI.md                         # Gemini CLI
└── package.json + Next.js scaffold`}
          />

          <h3>Step 5 - Open in your coding agent</h3>
          <p>
            Open the <code>hardware-pos</code> folder in Claude Code (<code>claude</code> in the project terminal), Cursor, Cline, or whichever agent you chose.
          </p>
        </ModuleSection>

        {/* MODULE 04 */}
        <ModuleSection slug="module-04" eyebrow="MODULE 04 · 30 min" title="Phase 1 - Foundation">
          <p>
            First big build moment. Your agent reads all 7 files, then executes Phase 1: Prisma + Neon, Better Auth, layout shell, design tokens, custom 404/error pages.
          </p>

          <h3>Step 1 - Get a Neon database URL</h3>
          <ol>
            <li>Go to <a href="https://console.neon.tech" target="_blank" rel="noopener noreferrer">console.neon.tech</a> and create a new project.</li>
            <li>Copy the connection string (starts with <code>postgres://</code>).</li>
            <li>Use the direct (non-pooled) connection - Prisma migrations require it.</li>
          </ol>

          <h3>Step 2 - Paste the build prompt</h3>
          <p>In your coding agent, paste the entire contents of <code>prompt.md</code> as your first message. The agent will:</p>
          <ol>
            <li>Read <code>master_prompt.md</code>, <code>design-style-guide.md</code>, <code>jb-components.md</code>, <code>project-description.md</code>, <code>project-phases.md</code></li>
            <li>Execute Phase 1 tasks</li>
            <li>Stop after Phase 1 for your confirmation</li>
          </ol>

          <h3>Step 3 - Provide secrets when asked</h3>
          <p>The agent creates <code>.env.local</code> and asks for values. Provide:</p>
          <CopyBlock
            filename=".env.local"
            label="Phase 1 minimum env vars"
            code={`DATABASE_URL="postgres://USER:PASS@ep-xxx.neon.tech/neondb?sslmode=require"
BETTER_AUTH_SECRET="<run: openssl rand -base64 32>"
BETTER_AUTH_URL="http://localhost:3000"

# Optional but recommended
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"

# For Google OAuth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""`}
          />

          <h3>Step 4 - Push the schema + start dev</h3>
          <CopyBlock
            filename="terminal"
            label="Phase 1 verification"
            code={`pnpm db:push
pnpm db:generate
pnpm dev`}
          />
          <p>Open <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer">http://localhost:3000</a> and verify:</p>
          <ul>
            <li>Landing page redirects unauthenticated users to /auth/sign-in</li>
            <li>Sign up with email or Google works</li>
            <li>You land on /dashboard (currently empty)</li>
            <li>Sidebar layout with theme toggle (light/dark)</li>
          </ul>

          <Tip>
            Stuck? Tell the agent: <em>"Verify all of Phase 1's tasks are complete. Read project-phases.md and check off what's done."</em> Anything unfinished, it'll fix.
          </Tip>
        </ModuleSection>

        {/* MODULE 05 */}
        <ModuleSection slug="module-05" eyebrow="MODULE 05 · 30 min" title="Phase 2 - Products & Inventory">
          <p>
            Build the inventory side first - the cashier needs products to exist before they can sell. Categories + Products with full CRUD, plus low-stock badges.
          </p>

          <h3>Step 1 - Confirm Phase 1 done, start Phase 2</h3>
          <CopyBlock
            label="Prompt"
            code={`Phase 1 is verified working. Proceed to Phase 2 - Products & Inventory.

Build:
- Category and Product Prisma models (schema below)
- A seed script that inserts the 6 categories on first run: Tools, Hardware, Paint, Plumbing, Electrical, Other
- API routes /api/categories and /api/products with auth guards + Zod validation
- /inventory page using JB Data Table to list products with columns: SKU, Name, Category, Price (UGX), Stock, Status (low-stock badge)
- /inventory/new and /inventory/[id]/edit pages with React Hook Form + Zod
- A formatUGX(amount: number) utility in lib/format.ts that returns "UGX 25,000" style strings (no decimals, comma separators)

Stop after Phase 2 is complete and ask me to verify.`}
          />

          <h3>Step 2 - Verify the schema</h3>
          <p>The agent should produce a Prisma schema like this. If it differs, ask for these exact fields:</p>
          <CopyBlock
            filename="prisma/schema.prisma"
            label="Categories + Products"
            code={`model Category {
  id        String    @id @default(cuid())
  name      String    @unique
  color     String    @default("#4F46E5")
  products  Product[]
  userId    String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime  @default(now())
}

model Product {
  id                  String     @id @default(cuid())
  sku                 String
  name                String
  priceUgx            Int        // store as integer, no decimals
  stockQuantity       Int        @default(0)
  lowStockThreshold   Int        @default(5)
  categoryId          String
  category            Category   @relation(fields: [categoryId], references: [id])
  saleItems           SaleItem[]
  userId              String
  user                User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt           DateTime   @default(now())
  updatedAt           DateTime   @updatedAt

  @@unique([userId, sku])  // SKUs unique per user
  @@index([userId])
  @@index([categoryId])
}`}
          />

          <h3>Step 3 - Test inventory CRUD</h3>
          <ol>
            <li>Verify the 6 categories appear in the sidebar / category dropdown</li>
            <li>Add 8-10 products across categories (e.g. <code>NAIL-3IN</code> 3-inch nails 800 UGX stock 200; <code>PAINT-WHT-4L</code> White paint 4L 45,000 UGX stock 12)</li>
            <li>Edit a product's stock down to 2 - confirm the low-stock badge appears</li>
            <li>Delete a product - confirm it's removed</li>
            <li>Search by SKU and by name - both should work in the data table</li>
          </ol>

          <Tip>
            UGX prices stored as integers (not decimals) avoids rounding bugs. The <code>formatUGX()</code> utility handles display. Tell your agent if it tries to use Decimal/Float for currency - that's a foot-gun.
          </Tip>
        </ModuleSection>

        {/* MODULE 06 */}
        <ModuleSection slug="module-06" eyebrow="MODULE 06 · 45 min" title="Phase 3 - POS Sale flow + Receipt PDF">
          <p>
            The core of the app. Cashier searches a product, adds to cart, sets quantity, picks payment, completes sale. Stock decrements atomically. PDF receipt downloads immediately.
          </p>

          <h3>Step 1 - Add the Sale + SaleItem schema</h3>
          <CopyBlock
            label="Prompt"
            code={`Phase 2 is verified. Proceed to Phase 3 - POS Sale flow.

Add to the Prisma schema:

model Sale {
  id              String        @id @default(cuid())
  totalUgx        Int
  paymentMethod   PaymentMethod
  customerName    String?
  customerPhone   String?
  items           SaleItem[]
  userId          String
  user            User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt       DateTime      @default(now())
  @@index([userId, createdAt])
}

model SaleItem {
  id          String   @id @default(cuid())
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  productName String   // snapshot of product name at sale time
  productSku  String   // snapshot of SKU at sale time
  unitPriceUgx Int     // snapshot of price at sale time
  quantity     Int
  lineTotalUgx Int
  @@index([saleId])
  @@index([productId])
}

enum PaymentMethod { CASH MOBILE_MONEY CARD }

Then run pnpm db:push and pnpm db:generate.`}
          />

          <Tip>
            Why snapshot productName/productSku/unitPriceUgx on each SaleItem? Because product details change over time, but a historical sale receipt should reflect what was sold at that moment. This is a real-world pattern that AI agents often skip - make sure it's there.
          </Tip>

          <h3>Step 2 - Build the POS screen</h3>
          <CopyBlock
            label="Prompt"
            code={`Build /pos as the main POS screen with this layout:

LEFT (60%) - Product search + grid:
- Search input at top (search by SKU or product name)
- Product grid below: each card shows SKU, name, price (UGX), stock. Click adds 1 to cart (or increments quantity if already in cart). Out-of-stock products are visually disabled.
- Use React Query for product data with staleTime 30000.

RIGHT (40%) - Cart:
- "New Sale" header
- List of cart items: product name, qty controls (+/-), unit price, line total, remove button
- Optional customer name + phone fields
- Payment method select: Cash / Mobile Money / Card
- Live total in big numbers (32px font, accent color)
- "Complete Sale" button (disabled when cart is empty)

API:
POST /api/sales accepts { items: [{ productId, quantity }], paymentMethod, customerName?, customerPhone? } and:
1. Validates with Zod
2. Wraps everything in db.$transaction:
   a. Reads each product (FOR UPDATE not needed - Prisma handles this with the txn)
   b. Verifies stock >= quantity for each item; throws 400 if not
   c. Creates the Sale with snapshot SaleItems (copy productName, sku, unitPriceUgx)
   d. Decrements product stockQuantity by quantity for each item
3. Returns the new sale id

After successful sale, redirect to /sales/[id] which shows the sale detail + a "Download Receipt" button.

Use the existing JB Searchable Select for the payment method dropdown.`}
          />

          <h3>Step 3 - Receipt PDF with @react-pdf/renderer</h3>
          <CopyBlock
            label="Prompt"
            code={`Build /api/sales/[id]/receipt that returns a PDF response using @react-pdf/renderer.

The receipt should look like a real till receipt:
- Centered header: shop name placeholder ("HARDWARE POS"), "RECEIPT" subtitle, date/time
- Sale ID (last 8 chars), payment method, optional customer name/phone
- Line items table: SKU | Item | Qty | Unit Price | Line Total
- Total row in bold
- Footer: "Thank you for your purchase"
- Use Helvetica or the closest equivalent in @react-pdf - small fonts (10-11pt)
- A4 portrait page size
- Currency formatted via formatUGX()

Wire the "Download Receipt" button on the sale detail page to fetch this endpoint and download the file as receipt-<saleId>.pdf.`}
          />

          <h3>Step 4 - Test a real sale end-to-end</h3>
          <ol>
            <li>Open /pos, search "nail", add to cart</li>
            <li>Adjust quantity to 5, search "paint", add to cart</li>
            <li>Verify the live total matches manually (5 × nail price + 1 × paint price)</li>
            <li>Type a customer name and phone</li>
            <li>Pick "Mobile Money" as payment method</li>
            <li>Click Complete Sale → you land on /sales/[id]</li>
            <li>Download the receipt PDF and open it</li>
            <li>Go to /inventory - verify stock decremented for both products</li>
          </ol>
        </ModuleSection>

        {/* MODULE 07 */}
        <ModuleSection slug="module-07" eyebrow="MODULE 07 · 25 min" title="Phase 4 - Dashboard + Sales History">
          <p>
            With sales flowing, the dashboard becomes useful. Today's revenue, top products, low-stock counter, weekly chart. Plus the full sales history.
          </p>

          <h3>Step 1 - Dashboard analytics</h3>
          <CopyBlock
            label="Prompt"
            code={`Build /dashboard with these sections:

STAT CARDS ROW (4 cards across):
- Today's Revenue (UGX) - sum of Sale.totalUgx where DATE(createdAt) = today
- Today's Transactions - count of sales today
- Low-Stock Alerts - count of products where stockQuantity <= lowStockThreshold
- This Week's Revenue - sum of Sale.totalUgx where createdAt >= start of current ISO week

Each card: label (uppercase mono 11px), big number (28px semibold), small comparison vs yesterday/last week (12px secondary).

WEEKLY REVENUE CHART:
- Bar chart of daily revenue for the last 7 days
- Use a simple SVG bar chart in a custom component (no external chart library needed for 7 bars)
- Labels: day name (Mon, Tue, ...). Y-axis: UGX values formatted with formatUGX.
- Bar color: var(--accent), with bg-muted fill for the active day's bar

TOP 5 PRODUCTS THIS WEEK:
- Aggregate SaleItem rows where Sale.createdAt >= start of week
- groupBy productId, sum quantity, sum lineTotalUgx
- Display as a table: rank, name, units sold, revenue
- Order by units sold descending

LOW-STOCK LIST:
- List of products where stockQuantity <= lowStockThreshold
- Show name, SKU, current stock, threshold
- Link to /inventory/[id]/edit

All queries should be in API routes, scoped to session.user.id, served via React Query.`}
          />

          <h3>Step 2 - Sales history page</h3>
          <CopyBlock
            label="Prompt"
            code={`Build /sales - full sales history list:

- JB Data Table with columns: Date (formatted "Jan 15, 2024 14:30"), Sale ID (last 8 chars), Items count, Payment Method (badge), Total (UGX, right-aligned monospace), Customer (if any), Action (View)
- Server-side pagination via /api/sales (page, limit, default 20)
- Filters above the table:
  - Date range picker (default: last 30 days)
  - Payment method dropdown (All / Cash / Mobile Money / Card)
- Filter state lives in URL query params so refresh preserves it
- "Export today's sales as PDF" button at the top - generates a daily report PDF with a header summary + sales table

Clicking a row goes to /sales/[id] (already exists from Phase 3) showing full line items and the receipt download button.`}
          />

          <h3>Step 3 - Test the analytics</h3>
          <ol>
            <li>Make 3-5 sales of varying amounts and payment methods</li>
            <li>Refresh /dashboard - verify the 4 stat cards reflect those sales</li>
            <li>Check the weekly revenue chart - today's bar should be highlighted</li>
            <li>Verify the top-5 products list orders correctly</li>
            <li>Drop a product's stock to below threshold - verify it appears in low-stock list</li>
            <li>On /sales, filter to "Mobile Money only" - verify the URL updates and the table filters</li>
            <li>Export today's sales as PDF - open the file, verify totals match the dashboard</li>
          </ol>
        </ModuleSection>

        {/* MODULE 08 */}
        <ModuleSection slug="module-08" eyebrow="MODULE 08 · 40 min" title="Pre-deploy review + Deploy">
          <p>The two highest-leverage steps: catch security holes before launch, then ship.</p>

          <h3>Step 1 - Run the pre-deploy audit</h3>
          <p>
            Open <a href="/docs/quickstart#step-7">Step 7 of the quickstart</a> (or open <code>pre-deploy-review.md</code> in your project root). Paste the entire prompt into your coding agent.
          </p>
          <p>The agent writes findings to <code>pre-deploy-review-report.md</code>. Expected for HardwarePOS:</p>
          <ul>
            <li><strong>Critical</strong> - missing rate limiting on auth, possibly missing transaction wrapping on the sale endpoint (this would let stock go negative under concurrent sales)</li>
            <li><strong>High</strong> - missing index on Sale.createdAt for the dashboard date queries, N+1 on the sales history when fetching items count</li>
            <li><strong>Medium</strong> - missing Zod refinements (e.g. quantity must be &gt; 0), verbose console.log on success paths</li>
          </ul>

          <h3>Step 2 - Fix every Critical</h3>
          <p>For each Critical, paste back to the agent:</p>
          <CopyBlock
            label="Prompt"
            code={`Fix Critical issue #1 from pre-deploy-review-report.md. Apply the suggested fix exactly, run a quick test, confirm the issue is resolved. Do not introduce changes outside the scope of this fix.`}
          />
          <p>Re-run the audit until Critical count = 0. High and Medium can wait until after launch.</p>

          <h3>Step 3 - Push to GitHub</h3>
          <CopyBlock
            filename="terminal"
            label="Initial commit + push"
            code={`git init
git add .
git commit -m "Initial commit - HardwarePOS built with VibeKit"
gh repo create hardware-pos --private --source=. --push
# OR manually create on github.com and:
# git remote add origin https://github.com/YOU/hardware-pos.git
# git push -u origin main`}
          />

          <h3>Step 4 - Import to Vercel + set env vars</h3>
          <ol>
            <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer">vercel.com/new</a></li>
            <li>Import the <code>hardware-pos</code> repo. Framework auto-detects as Next.js.</li>
            <li>Build command: <code>prisma generate &amp;&amp; prisma migrate deploy &amp;&amp; next build</code></li>
            <li>Don't deploy yet - set env vars first.</li>
          </ol>
          <CopyBlock
            filename="Vercel → Settings → Environment Variables"
            label="Production env"
            code={`DATABASE_URL=<your Neon prod connection string>
BETTER_AUTH_SECRET=<a NEW 32+ char string, NOT the dev one>
BETTER_AUTH_URL=https://hardware-pos.vercel.app
RESEND_API_KEY=<from resend.com>
RESEND_FROM_EMAIL=noreply@yourshop.com
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
NEXT_PUBLIC_APP_URL=https://hardware-pos.vercel.app`}
          />

          <h3>Step 5 - Add OAuth redirect URI</h3>
          <p>In Google Cloud Console → APIs & Services → Credentials → your OAuth client → Authorized redirect URIs, add:</p>
          <CopyBlock
            label="Production redirect"
            code={`https://hardware-pos.vercel.app/api/auth/callback/google`}
          />

          <h3>Step 6 - Deploy + smoke test</h3>
          <p>Hit <strong>Deploy</strong>. Wait ~2 min. Visit the URL and run through the full flow:</p>
          <ul>
            <li>Sign up + verify welcome email</li>
            <li>Add 5 products in /inventory</li>
            <li>Make a real sale via /pos with Mobile Money payment</li>
            <li>Download the receipt PDF</li>
            <li>Verify the dashboard updated</li>
            <li>Toggle dark mode on a phone</li>
          </ul>

          <h3>Step 7 - Custom domain (optional)</h3>
          <ol>
            <li>Buy a domain on Cloudflare Registrar (or your provider)</li>
            <li>Vercel → Settings → Domains → add your domain</li>
            <li>Cloudflare DNS → add the records Vercel shows (set to <strong>DNS only</strong>, grey cloud, not orange)</li>
            <li>Update <code>BETTER_AUTH_URL</code> and <code>NEXT_PUBLIC_APP_URL</code> to the custom domain</li>
            <li>Add the new redirect URI in Google Cloud Console</li>
            <li>Redeploy</li>
          </ol>

          <div className="my-8 rounded-md border-2 border-[color:var(--accent)]/40 bg-[color:var(--accent-soft)] p-6">
            <h3 className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--accent)] mt-0">
              You shipped it.
            </h3>
            <p className="mt-3 text-[15px] text-[color:var(--text-primary)]">
              That's a real POS - auth, transactions, atomic stock decrements, downloadable receipts, audited for security, deployed to a custom domain. A hardware shop owner could actually use this.
            </p>
            <p className="mt-3 text-[14px] text-[color:var(--text-secondary)]">
              Share what you built in the <a href={SITE.community} target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent)] underline">community</a> - and tag it with <code>#shipped-with-vibekit</code>.
            </p>
          </div>
        </ModuleSection>

        {/* Next steps */}
        <Section
          eyebrow="WHAT'S NEXT"
          title="Take it further."
          description="The patterns you just learned scale to anything. Some natural next steps for HardwarePOS or your next build:"
          containerClassName="max-w-3xl"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Add real Mobile Money", body: "Install JB DGateway Shop and wire actual MoMo settlement to the sale flow. ~45 min." },
              { title: "Multi-cashier support", body: "Add a 'cashier' role + sale.cashierId so you can see who rang up which sales. ~30 min." },
              { title: "Barcode scanner input", body: "Hook a USB scanner into the SKU search - it's just keyboard input. ~15 min." },
              { title: "Stock-in / restock flow", body: "Track inventory deliveries with a separate StockMovement model. ~45 min." },
              { title: "Daily Z-report (end of day)", body: "Closing report with sales by payment method + cash drawer reconciliation. ~30 min." },
              { title: "Build something else", body: "Restart from Module 02 with a new app idea. The flow is fully repeatable." },
            ].map((n) => (
              <li
                key={n.title}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5"
              >
                <h3 className="font-mono text-[13px] uppercase tracking-tight text-[color:var(--text-primary)]">
                  {n.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
                  {n.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Button href="/components" variant="accent" size="md">
              Browse all components
            </Button>
            <Button href="/contribute" variant="outline" size="md">
              <Rocket className="h-4 w-4" />
              Contribute a component
            </Button>
            <Button href={SITE.community} variant="outline" size="md">
              Join the community
            </Button>
          </div>
        </Section>
      </main>
      <Footer />

      {/* HowTo schema for AEO */}
      <Script
        id="ld-tutorial"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Build HardwarePOS - a real point-of-sale system - with VibeKit",
            description:
              "Build and deploy HardwarePOS, a point-of-sale system for a small hardware shop, with auth, inventory, atomic sales transactions, receipt PDFs, and a dashboard - using VibeKit + any AI coding agent.",
            totalTime: "PT3H",
            tool: [
              { "@type": "HowToTool", name: "Claude (claude.ai)" },
              { "@type": "HowToTool", name: "Claude Code or Cursor" },
              { "@type": "HowToTool", name: "Neon Postgres" },
              { "@type": "HowToTool", name: "Vercel" },
            ],
            step: modules.map((m, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: m.title,
              text: m.intro,
              url: `${SITE.url}/tutorial#module-${String(i + 1).padStart(2, "0")}`,
            })),
          }),
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────── */
/* Local helpers                                               */
/* ─────────────────────────────────────────────────────────── */

function ModuleSection({
  slug,
  eyebrow,
  title,
  children,
}: {
  slug: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={slug}
      className="relative scroll-mt-24 border-t border-[color:var(--border)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <header className="border-b border-[color:var(--border)] pb-8">
          <div className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--accent)]">
            {eyebrow}
          </div>
          <h2 className="mt-3 font-mono text-[clamp(1.75rem,4vw,2.5rem)] font-bold uppercase tracking-tight text-[color:var(--text-primary)]">
            {title}
          </h2>
        </header>
        <div
          className="mt-8 space-y-5 text-[15.5px] leading-[1.75] text-[color:var(--text-secondary)]
            [&_h3]:font-mono [&_h3]:text-[14px] [&_h3]:uppercase [&_h3]:tracking-tight [&_h3]:text-[color:var(--text-primary)] [&_h3]:mt-10 [&_h3]:mb-2
            [&_strong]:text-[color:var(--text-primary)] [&_strong]:font-medium
            [&_a]:text-[color:var(--accent)] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:no-underline
            [&_code]:font-mono [&_code]:text-[13.5px] [&_code]:rounded [&_code]:border [&_code]:border-[color:var(--border)] [&_code]:bg-[color:var(--bg-elevated)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[color:var(--text-primary)]
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:my-2
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:my-2"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-md border-l-2 border-[color:var(--accent)] bg-[color:var(--accent-soft)] p-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--accent)]">
        Tip
      </div>
      <div className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-primary)] [&_em]:not-italic [&_em]:rounded [&_em]:bg-[color:var(--bg-elevated)] [&_em]:px-1.5 [&_em]:py-0.5 [&_em]:font-mono [&_em]:text-[12.5px]">
        {children}
      </div>
    </div>
  );
}

function Checklist({
  items,
}: {
  items: { name: string; url: string; note?: string }[];
}) {
  return (
    <ul className="not-prose mt-4 grid gap-2 sm:grid-cols-2 list-none pl-0">
      {items.map((item) => (
        <li
          key={item.name}
          className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-4"
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[14px] font-medium text-[color:var(--text-primary)] hover:text-[color:var(--accent)]"
          >
            {item.name}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {item.note ? (
            <div className="mt-1 text-[12.5px] text-[color:var(--text-tertiary)]">
              {item.note}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
