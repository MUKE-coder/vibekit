import { Section } from "./section";

const problems = [
  {
    pain: "Slow page loads",
    looks: "API routes hit the database on every request - no cache layer between React Query and Postgres. 1,000 users = 1,000 identical queries.",
    solution: "Upstash Redis caches hot API queries in memory (sub-5ms). React Query on the client + Redis on the server = dual-layer caching.",
  },
  {
    pain: "Bloated JS bundles",
    looks: "Heavy libraries (PDF renderer, spreadsheet parser, chart libs) load on every page. Two animation frameworks fight for bandwidth.",
    solution: "next/dynamic for every import > 15KB. Framer Motion ONLY (single library ~35KB). GSAP only for advanced marketing sites. Bundle analysis in pre-deploy catches bloat before users do.",
  },
  {
    pain: "AI slop design",
    looks: "Every app looks the same - purple gradients, generic shadcn defaults, no brand identity.",
    solution: "design-style-guide.md is customized per project (colors, typography, spacing) and Claude Code follows it exactly.",
  },
  {
    pain: "Inconsistent UI",
    looks: "Buttons, cards, and forms look slightly different on every page.",
    solution: "Design tokens defined in one place, enforced by the master prompt across every component.",
  },
  {
    pain: "Shipping broken auth",
    looks: "AI writes insecure login flows, missing password reset, no OAuth, session bugs.",
    solution: "jb-components.md points Claude to install JB Better Auth UI - battle-tested auth in one command.",
  },
  {
    pain: "Burning tokens",
    looks: "You re-generate auth, tables, forms, and uploads from scratch every session, burning tokens each time.",
    solution: "JB Component Registry covers the big primitives, so the AI installs and wires them up instead of writing from scratch.",
  },
  {
    pain: "Getting stuck in loops",
    looks: "AI tries the same broken fix repeatedly, context gets polluted, progress stalls.",
    solution: "Phase-based build + rescue prompts in prompt-engineering.md + troubleshooting.md playbook.",
  },
  {
    pain: "No plan, no clarity",
    looks: "Starting with “build me a SaaS” and hoping for the best.",
    solution: "Claude interviews you first, generates project-description.md + project-phases.md - a clear blueprint before a single line of code.",
  },
  {
    pain: "Tech stack chaos",
    looks: "AI picks a different stack every project - jsPDF here, Drizzle there, useEffect for data.",
    solution: "Master prompt locks the stack: Next.js 16 + Prisma v7 + React Query + Zod + @react-pdf/renderer + xlsx - always.",
  },
  {
    pain: "Prisma version drift",
    looks: "AI mixes Prisma v6 and v7 patterns, breaks the build.",
    solution: "Master prompt enforces Prisma v7 patterns exactly (generator, custom output path, adapter-pg).",
  },
  {
    pain: "Deployment confusion",
    looks: "App works locally, breaks in production - env vars, DNS, SSL, email spam.",
    solution: "deployment.md + environment-variables.md walk through every step with checklists.",
  },
  {
    pain: "Vague prompts = vague code",
    looks: "“Make it look better” produces unpredictable changes that break other things.",
    solution: "prompt-engineering.md teaches the 5-part formula and context-loading technique.",
  },
  {
    pain: "Payment setup hell",
    looks: "Stripe keys, webhooks, feature gating, billing pages - most builds never ship monetization.",
    solution: "monetization-guide.md + JB Stripe UI component handle the full flow.",
  },
  {
    pain: "Losing track of progress",
    looks: "Mid-build, no idea what’s done vs. what’s left.",
    solution: "Phase tasks in project-phases.md are checkboxes - Claude Code checks them off as it goes.",
  },
  {
    pain: "No rescue plan when AI breaks",
    looks: "Build stalls for hours because AI keeps making it worse.",
    solution: "Rescue prompts + hard-reset protocol + the V0 bypass technique in prompt-engineering.md.",
  },
];

export function Problems() {
  return (
    <Section
      id="problems"
      eyebrow="The problems we solve"
      title={<>Every vibe coder hits the<br className="hidden sm:block" /> same walls. We remove each one.</>}
      description="Thirteen specific pains that derail AI-built apps - and how VibeKit makes each one disappear."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => (
          <article
            key={p.pain}
            className="reveal group relative overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
          >
            <div className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
              Pain
            </div>
            <h3 className="font-display mt-1 text-[22px] leading-tight text-[color:var(--text-primary)]">
              {p.pain}
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
              {p.looks}
            </p>
            <div className="my-5 h-px bg-[color:var(--border)]" />
            <div className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--accent)]">
              VibeKit fix
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[color:var(--text-primary)]">
              {p.solution}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
