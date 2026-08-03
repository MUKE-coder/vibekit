"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, GitBranch, Plus } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Button } from "./ui/button";
import { SITE } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ContributeBanner() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(".contrib-card", { y: 32, opacity: 0, duration: 0.8 })
        .from(
          ".contrib-eyebrow",
          { y: 14, opacity: 0, duration: 0.4 },
          "-=0.4"
        )
        .from(".contrib-headline", { y: 16, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".contrib-body", { y: 12, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".contrib-stat", { y: 10, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.2")
        .from(".contrib-cta > *", { y: 10, opacity: 0, stagger: 0.08, duration: 0.4 }, "-=0.2");
    },
    { scope: root }
  );

  return (
    <section ref={root} id="contribute" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="contrib-card relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-8 sm:p-14">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 80% 20%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 70%)",
            }}
          />
          {/* Faded grid */}
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" aria-hidden />

          <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="contrib-eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
                <GitBranch className="h-3 w-3 text-[color:var(--accent)]" />
                Open source · MIT licensed
              </div>

              <h2 className="contrib-headline font-display mt-6 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
                Got a component?{" "}
                <em className="not-italic text-[color:var(--accent)]">Add it to the registry.</em>
              </h2>

              <p className="contrib-body mt-5 max-w-xl text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
                Built something reusable - auth flow, payment widget, AI feature, dashboard
                primitive? Open a pull request. Once merged, your component gets a permanent
                doc page and is loaded by every Claude Code agent reading the registry.
              </p>

              {/* Quick stats */}
              <dl className="mt-8 grid max-w-md grid-cols-3 gap-4">
                {[
                  { value: "MIT", label: "Licensed" },
                  { value: "1 file", label: "To edit" },
                  { value: "1 wk", label: "To review" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="contrib-stat rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] p-3"
                  >
                    <dt className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                      {s.label}
                    </dt>
                    <dd className="mt-1 font-mono text-[18px] font-semibold tabular-nums text-[color:var(--text-primary)]">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="contrib-cta mt-8 flex flex-wrap gap-3">
                <Link href="/contribute">
                  <Button variant="accent" size="md">
                    Read the contribution guide
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  href={`${SITE.github}/fork`}
                  variant="outline"
                  size="md"
                >
                  <Plus className="h-4 w-4" />
                  Fork & open a PR
                </Button>
              </div>
            </div>

            {/* Right column - what you contribute */}
            <div className="hidden md:block">
              <div className="rounded-md border border-[color:var(--border)] bg-[color:var(--bg)] p-5 font-mono text-[12px] text-[color:var(--text-secondary)] max-w-xs">
                <div className="flex items-center justify-between border-b border-[color:var(--border)] pb-3">
                  <span className="text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                    your-component.ts
                  </span>
                  <span className="text-[10px] text-[color:var(--accent)]">+18 lines</span>
                </div>
                <pre className="mt-3 leading-relaxed whitespace-pre overflow-x-auto">
                  <code>{`{
  slug: "your-thing",
  name: "Your Thing",
  category: "data",
  install: "...",
  features: [...],
  filesAdded: [...],
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
