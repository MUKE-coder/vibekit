import { Cpu, Database, ShieldCheck, Zap } from "lucide-react";
import { Section } from "./section";

const checks = [
  {
    icon: Cpu,
    title: "Performance",
    body: "N+1 queries, missing pagination, expensive operations in hot paths, regex backtracking risks.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    body: "Unauthenticated routes, SQL injection, missing rate limiting, exposed secrets, XSS, CSRF.",
  },
  {
    icon: Database,
    title: "Background tasks",
    body: "Webhook idempotency, job retries with exponential backoff, distributed locks, dead-letter queues.",
  },
  {
    icon: Zap,
    title: "Resource consumption",
    body: "Memory leaks, unclosed streams, missing timeouts, cache without limits, sequential calls that should be parallel.",
  },
];

export function PreDeploy() {
  return (
    <Section
      id="pre-deploy"
      eyebrow="Pre-deploy code review"
      title={<>A senior-level audit before you <em className="not-italic text-[color:var(--accent)]">go live</em>.</>}
      description="Run pre-deploy-review.md inside Claude Code as the final task. It writes a full report - Critical / High / Medium - straight into your repo. Address the Criticals before deploying."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {checks.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="reveal rounded-[var(--radius-lg)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 transition hover:border-[color:var(--border-strong)]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-[var(--radius)] bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-display mt-4 text-[20px] leading-tight text-[color:var(--text-primary)]">
              {title}
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--text-secondary)]">
              {body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
