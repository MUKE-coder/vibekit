import { Section } from "./section";

const rows = [
  { layer: "Framework", tech: "Next.js 16 (App Router)", why: "Latest App Router with React 19" },
  { layer: "Language", tech: "TypeScript 5.9", why: "Type safety, better DX" },
  { layer: "Database", tech: "Neon - Serverless Postgres", why: "Free tier, instant setup, serverless scale" },
  { layer: "Cache", tech: "Upstash Redis", why: "API-layer query caching, rate limiting, session store" },
  { layer: "ORM", tech: "Prisma v7", why: "Type-safe, AI reads schema easily" },
  { layer: "Authentication", tech: "Better Auth", why: "Secure, extensible, Prisma-compatible" },
  { layer: "Data Fetching", tech: "React Query + Redis + Fetch", why: "Client cache (React Query) + Server cache (Redis) = dual layer" },
  { layer: "Animation", tech: "Framer Motion", why: "State + entrance animations - single library, ~35KB" },
  { layer: "API Layer", tech: "API Routes (Route Handlers)", why: "Server-side logic via Next.js App Router" },
  { layer: "Validation", tech: "Zod + React Hook Form", why: "Type-safe validation on client and server" },
  { layer: "PDF Generation", tech: "@react-pdf/renderer", why: "React components to PDF (lazy-loaded)" },
  { layer: "Excel Export", tech: "xlsx", why: "Read/write Excel, lightweight (lazy-loaded)" },
  { layer: "File Storage", tech: "Cloudflare R2 or UploadThing", why: "R2 for S3-compat, UploadThing for simple uploads" },
  { layer: "Email", tech: "Resend + React Email", why: "Best DX, great deliverability" },
  { layer: "Payments", tech: "Stripe", why: "Industry standard, webhook-driven" },
  { layer: "Styling", tech: "Tailwind CSS v4 + shadcn/ui", why: "AI knows these patterns well" },
  { layer: "Deployment", tech: "Vercel", why: "One-click, preview URLs, zero config" },
  { layer: "Domain & DNS", tech: "Cloudflare", why: "Free SSL, fast DNS" },
  { layer: "Components", tech: "JB + VibeKit Registry", why: "Production-ready shadcn components (auth, payments, kanban, charts, org UI...)" },
];

export function Stack() {
  return (
    <Section
      id="stack"
      title="Locked stack. Zero decisions. Maximum velocity."
      description="Every project ships with the same opinionated stack so AI never has to invent - and you never have to debug a dependency mismatch."
    >
      <div className="reveal overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color:var(--bg-subtle)] text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
              <tr>
                <th className="px-5 py-3 font-medium">Layer</th>
                <th className="px-5 py-3 font-medium">Technology</th>
                <th className="px-5 py-3 font-medium">Why</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.layer}
                  className={i !== rows.length - 1 ? "border-b border-[color:var(--border)]" : ""}
                >
                  <td className="px-5 py-3.5 font-medium text-[color:var(--text-primary)]">
                    {r.layer}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-[color:var(--text-primary)]">
                    {r.tech}
                  </td>
                  <td className="px-5 py-3.5 text-[color:var(--text-secondary)]">
                    {r.why}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="reveal mt-6 text-center text-[13px] text-[color:var(--text-secondary)]">
        GD only - GSAP for marketing scroll. Dashboard apps skip GSAP entirely (saves 40KB). All heavy libs (PDF, Excel, charts) use <span className="font-mono">next/dynamic</span> - never load what the current page doesn't need.
      </p>
    </Section>
  );
}
