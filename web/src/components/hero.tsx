"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Github } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { OrbitalCore } from "./graphics/icons";
import { HeroEffects } from "./hero-effects";
import { SITE } from "@/lib/utils";

const stackChips = [
  "Next.js 16",
  "Prisma v7",
  "Upstash Redis",
  "Better Auth",
  "React Query",
  "Framer Motion",
  "Tailwind v4",
];

export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 12, opacity: 0, duration: 0.5 })
        .from(".hero-orbital", { scale: 0.85, opacity: 0, duration: 0.9, ease: "expo.out" }, "-=0.2")
        .from(".hero-headline span", { y: 28, opacity: 0, duration: 0.7, stagger: 0.05 }, "-=0.6")
        .from(".hero-sub", { y: 14, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".hero-cta > *", { y: 10, opacity: 0, duration: 0.4, stagger: 0.08 }, "-=0.3")
        .from(".hero-chip", { y: 6, opacity: 0, duration: 0.3, stagger: 0.03 }, "-=0.2");
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden pt-36 sm:pt-44 pb-24">
      {/* Fading grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-pattern opacity-100" aria-hidden />

      {/* Soft radial accent glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 5%, color-mix(in srgb, var(--accent) 15%, transparent), transparent 65%)",
        }}
      />

      {/* Animated circuit lines + particle field */}
      <HeroEffects />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <div className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)]/60 backdrop-blur px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
          </span>
          The framework for vibe coders · v1.0
        </div>

        {/* Orbital mark — scales down on mobile */}
        <div className="hero-orbital mt-8 sm:mt-10 flex justify-center">
          <OrbitalCore className="h-[110px] w-[110px] sm:h-[140px] sm:w-[140px]" size={140} />
        </div>

        {/* Big block headline */}
        <h1 className="hero-headline headline-mono mt-6 sm:mt-8 text-[clamp(2.75rem,13vw,9rem)] text-[color:var(--text-primary)]">
          <span className="block">VIBEKIT</span>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[color:var(--text-secondary)]">
          The framework for shipping production-grade Next.js apps with <strong className="text-[color:var(--text-primary)] font-medium">any coding agent</strong> — Claude Code, Cursor, Kiro, Antigravity, Windsurf, Cline, Aider. Generate 4 files. Build phase by phase. Ship without burning tokens.
        </p>

        <div className="hero-cta mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button href="#get-started" variant="accent" size="lg">
            Get started
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button href={SITE.github} variant="outline" size="lg">
            <Github className="h-4 w-4" />
            View on GitHub
          </Button>
        </div>

        {/* Install command */}
        <div className="mx-auto mt-10 max-w-md px-2 sm:px-0">
          <div className="hero-cta flex items-center gap-2 sm:gap-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 sm:px-4 py-2.5 sm:py-3 text-left font-mono text-[12px] sm:text-[13px] min-w-0">
            <span className="text-[color:var(--text-tertiary)] shrink-0">$</span>
            <code className="flex-1 truncate text-[color:var(--text-primary)]">
              git clone github.com/MUKE-coder/vibekit
            </code>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)] shrink-0">
              copy
            </span>
          </div>
        </div>

        {/* Stack chips */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
          {stackChips.map((chip) => (
            <span
              key={chip}
              className="hero-chip rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)]/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
