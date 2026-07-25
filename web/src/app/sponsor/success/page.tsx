import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { SITE } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Thank you for sponsoring VibeKit",
  description: "Your support keeps VibeKit free, open source, and getting better.",
  robots: { index: false, follow: false },
};

export default function SponsorSuccessPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-24">
        <section className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--accent)] shadow-[var(--shadow-glow)]">
            <Heart className="h-7 w-7 fill-current" />
          </div>
          <h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
            Thank you. <em className="not-italic gradient-text">Truly.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[color:var(--text-secondary)]">
            Your support goes straight into VibeKit — new primitives, better docs, and keeping the
            whole thing free and MIT-licensed. A receipt is on its way to your email from Stripe.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/docs/quickstart"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] bg-[color:var(--accent)] px-7 text-base font-medium text-[color:var(--accent-fg)] shadow-[var(--shadow-glow)] transition-[filter] duration-150 hover:brightness-110 active:brightness-95"
            >
              Back to the quickstart
            </Link>
            <a
              href={SITE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[var(--radius-full)] border border-[color:var(--border-strong)] px-7 text-base font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-subtle)]"
            >
              Star VibeKit on GitHub
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
