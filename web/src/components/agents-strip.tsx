"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Agent = { name: string; mark: string; tagline: string };

const agents: Agent[] = [
  { name: "Claude Code", mark: "✱", tagline: "Anthropic CLI" },
  { name: "Cursor", mark: "▸", tagline: "AI-first IDE" },
  { name: "Kiro Code", mark: "◆", tagline: "Spec-driven IDE" },
  { name: "Antigravity", mark: "▲", tagline: "Multi-agent IDE" },
  { name: "Windsurf", mark: "◐", tagline: "Codeium IDE" },
  { name: "Cline", mark: "◇", tagline: "VS Code agent" },
  { name: "Aider", mark: "▪", tagline: "Terminal pair" },
  { name: "Continue", mark: "▷", tagline: "OSS extension" },
  { name: "Cody", mark: "○", tagline: "Sourcegraph" },
  { name: "v0", mark: "/", tagline: "Vercel UI gen" },
  { name: "Lovable", mark: "♥", tagline: "Visual builder" },
  { name: "Bolt", mark: "⚡", tagline: "StackBlitz" },
];

export function AgentsStrip() {
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

      tl.from(".agents-eyebrow", { y: 14, opacity: 0, duration: 0.5 })
        .from(".agents-headline", { y: 18, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".agents-sub", { y: 14, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".agent-cell", {
          y: 16,
          opacity: 0,
          stagger: 0.04,
          duration: 0.45,
          ease: "power2.out",
        }, "-=0.3");
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="agents"
      className="relative isolate overflow-hidden border-y border-[color:var(--border)] bg-[color:var(--bg-subtle)] py-20 sm:py-28"
    >
      {/* Faded grid background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" aria-hidden />
      {/* Soft accent bloom */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 50% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="agents-headline font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.1] tracking-tight text-[color:var(--text-primary)]">
            Works with any agent that <em className="not-italic gradient-text">reads files</em>.
          </h2>
          <p className="agents-sub mt-5 text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
            VibeKit's 4 generated files plus the master prompt are plain markdown - drop them into <strong className="font-medium text-[color:var(--text-primary)]">CLAUDE.md</strong>, <strong className="font-medium text-[color:var(--text-primary)]">.cursorrules</strong>, <strong className="font-medium text-[color:var(--text-primary)]">.kiro</strong>, or any other context format. The framework moves with you.
          </p>
        </div>

        {/* Agent grid - single column on phones, 2 cols on small, then 3, 4 */}
        <div className="mt-12 sm:mt-14 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--border)]">
          {agents.map((a) => (
            <div
              key={a.name}
              className="agent-cell group relative flex items-center gap-3 sm:gap-4 bg-[color:var(--bg-elevated)] p-4 sm:p-5 transition-colors hover:bg-[color:var(--bg-subtle)]"
            >
              {/* Mark badge */}
              <span
                className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] font-mono text-[16px] sm:text-[20px] text-[color:var(--text-secondary)] transition-colors group-hover:border-[color:var(--accent)] group-hover:text-[color:var(--accent)]"
                aria-hidden
              >
                {a.mark}
              </span>

              <div className="min-w-0 flex-1">
                <div className="font-mono text-[12px] sm:text-[13px] font-medium uppercase tracking-tight text-[color:var(--text-primary)] truncate">
                  {a.name}
                </div>
                <div className="mt-0.5 text-[11px] sm:text-[11.5px] text-[color:var(--text-tertiary)] truncate">
                  {a.tagline}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-8 text-center font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
          Works with any agent that reads project files
        </p>
      </div>
    </section>
  );
}
