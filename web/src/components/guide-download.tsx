import { BookOpen, Download } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Download CTA for the beginner's guide PDF (in /public).
 *
 * A plain <a download> rather than the <Button> component: Button routes
 * internal hrefs through next/link, which tries to client-navigate to a static
 * asset. A direct anchor lets the browser download the file cleanly.
 *
 * Server component — a download link needs no client JS.
 */

const PDF_PATH = "/vibekit-beginners-guide.pdf";
const PDF_NAME = "VibeKit-Beginners-Guide.pdf";
const TITLE = "From Idea to Live App";
const SUBTITLE = "The VibeKit beginner's guide";

type GuideDownloadProps = {
  variant?: "band" | "inline";
  className?: string;
};

export function GuideDownload({ variant = "inline", className }: GuideDownloadProps) {
  if (variant === "band") {
    return (
      <section className={cn("relative py-20 sm:py-24", className)}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8 text-center sm:p-14">
            {/* Accent glow, matching the site's CTA card */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 55% 45% at 50% 0%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
              }}
            />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-[var(--radius-full)] border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[color:var(--text-tertiary)]">
                <BookOpen className="h-3.5 w-3.5" />
                Free PDF guide
              </div>
              <h2 className="font-display mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-tight text-[color:var(--text-primary)]">
                {TITLE} —{" "}
                <em className="not-italic gradient-text">start here</em>.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
                A beginner-friendly walkthrough that takes you from an idea to a
                deployed Next.js app with VibeKit — no prior framework experience
                needed. Download it, keep it beside your editor, and build along.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={PDF_PATH}
                  download={PDF_NAME}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[color:var(--accent)] px-7 text-base font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter,transform] duration-150 hover:brightness-110 active:brightness-95"
                >
                  <Download className="h-4 w-4" />
                  Download the guide
                </a>
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] border border-[color:var(--border-strong)] px-7 text-base font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-subtle)]"
                >
                  Read online
                </a>
              </div>
              <p className="mt-4 text-[12px] text-[color:var(--text-tertiary)]">
                PDF · free · no email required
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Inline callout — compact horizontal card for the top of docs/learning pages.
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] text-[color:var(--accent)]">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            Free PDF guide
          </div>
          <h3 className="mt-1 text-[15px] font-medium text-[color:var(--text-primary)]">
            {TITLE} — {SUBTITLE}
          </h3>
          <p className="mt-1 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
            New to VibeKit? This walks you from idea to a deployed app, step by step.
          </p>
        </div>
      </div>
      <a
        href={PDF_PATH}
        download={PDF_NAME}
        className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-[var(--radius-full)] bg-[color:var(--accent)] px-5 text-sm font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter] duration-150 hover:brightness-110 active:brightness-95 sm:self-center"
      >
        <Download className="h-4 w-4" />
        Download
      </a>
    </div>
  );
}
