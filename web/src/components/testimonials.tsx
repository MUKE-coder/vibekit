import { MessageSquareQuote, Plus } from "lucide-react";
import { SITE } from "@/lib/utils";

// Opens the GitHub issue form so real users can submit a testimonial — the same
// review-then-publish flow as the showcase. No invented quotes ship here.
const SUBMIT_URL = `${SITE.github}/issues/new?template=testimonial-submission.yml`;

export function Testimonials() {
  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background:
                "radial-gradient(ellipse 55% 45% at 50% 0%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg)] text-[color:var(--accent)]">
              <MessageSquareQuote className="h-6 w-6" />
            </div>
            <h2 className="font-display mt-6 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-tight text-[color:var(--text-primary)]">
              Built something with VibeKit?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
              This space is for real builders. Shipped a project with VibeKit and want
              to share how it went? Send a short testimonial and we&rsquo;ll feature it
              here.
            </p>
            <div className="mt-8">
              <a
                href={SUBMIT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[color:var(--accent)] px-7 text-base font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter] duration-150 hover:brightness-110 active:brightness-95"
              >
                <Plus className="h-4 w-4" />
                Share your story
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
