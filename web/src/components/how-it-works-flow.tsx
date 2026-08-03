"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  FileText,
  ListTodo,
  Palette,
  PenLine,
  Rocket,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Step = {
  n: string;
  eyebrow: string;
  title: string;
  body: string;
  icons: { Icon: React.ComponentType<{ className?: string }>; label: string }[];
  caption: string;
};

const steps: Step[] = [
  {
    n: "01",
    eyebrow: "PLAN",
    title: "Tell Claude your idea.",
    body: "Paste the planning prompt into Claude.ai with one paragraph about your app. Claude either interviews you or jumps straight to a structured summary if your brief is detailed - then asks for your consent before generating.",
    icons: [
      { Icon: FileText, label: "project-description" },
      { Icon: ListTodo, label: "project-phases" },
      { Icon: Palette, label: "design-style-guide" },
      { Icon: Sparkles, label: "prompt" },
    ],
    caption: "Output: 4 downloadable files",
  },
  {
    n: "02",
    eyebrow: "BUILD",
    title: "Drop them into your agent.",
    body: "Add the 4 files plus the master prompt and component registry to your project. Open Claude Code, Cursor, Cline, Windsurf - any agent that reads files. It reads everything, plans Phase 1, and starts building. Stops between phases for your sign-off.",
    icons: [
      { Icon: PenLine, label: "Phase 1 · Auth" },
      { Icon: PenLine, label: "Phase 2 · CRUD" },
      { Icon: PenLine, label: "Phase 3 · Polish" },
    ],
    caption: "Phase by phase, with your control",
  },
  {
    n: "03",
    eyebrow: "SHIP",
    title: "Audit, then deploy.",
    body: "Before going live, paste the pre-deploy review prompt. Your agent runs a senior-level audit covering security, performance, and resource usage. Fix every Critical. Push to Vercel. Point a domain. Done.",
    icons: [
      { Icon: ShieldCheck, label: "Critical / High / Medium" },
      { Icon: Rocket, label: "Vercel + Cloudflare" },
    ],
    caption: "Production-ready in hours, not weeks",
  },
];

export function HowItWorksFlow() {
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

      tl.from(".flow-eyebrow", { y: 14, opacity: 0, duration: 0.5 })
        .from(".flow-headline", { y: 18, opacity: 0, duration: 0.6 }, "-=0.3")
        .from(".flow-sub", { y: 12, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".flow-step", {
          y: 24,
          opacity: 0,
          stagger: 0.18,
          duration: 0.7,
          ease: "power3.out",
        }, "-=0.2")
        .from(".flow-arrow", {
          opacity: 0,
          x: -8,
          stagger: 0.18,
          duration: 0.4,
        }, "-=0.9");
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="how-it-works"
      className="relative py-24 sm:py-32 overflow-hidden"
    >
      {/* Faded grid background */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" aria-hidden />
      {/* Soft accent bloom */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 30%, color-mix(in srgb, var(--accent) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="flow-headline font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
            Three steps from idea to <em className="not-italic gradient-text">production</em>.
          </h2>
          <p className="flow-sub mt-5 text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
            Plan with Claude. Build with any agent. Audit and ship. The whole flow takes an afternoon - and the patterns repeat for every project after.
          </p>
        </div>

        {/* 3-step flow */}
        <div className="mt-14 sm:mt-20 grid gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {steps.map((s, i) => (
            <FlowFragment key={s.n} step={s} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Footnote */}
        <p className="mt-12 text-center font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
          See the laptop demo below for what step 1 looks like in real time
        </p>
      </div>
    </section>
  );
}

function FlowFragment({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <>
      {/* Step card */}
      <article className="flow-step relative flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 sm:p-7 transition-colors hover:border-[color:var(--border-strong)]">
        {/* Step number + eyebrow */}
        <div className="flex items-baseline justify-between gap-3">
          <span className="font-mono text-[36px] sm:text-[48px] font-light leading-none text-[color:var(--accent)] tabular-nums">
            {step.n}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            {step.eyebrow}
          </span>
        </div>

        <h3 className="font-display mt-6 text-[22px] sm:text-[26px] leading-tight tracking-tight text-[color:var(--text-primary)]">
          {step.title}
        </h3>

        <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-[color:var(--text-secondary)]">
          {step.body}
        </p>

        {/* Icon row */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {step.icons.map(({ Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-secondary)]"
            >
              <Icon className="h-3 w-3 text-[color:var(--accent)]" />
              {label}
            </span>
          ))}
        </div>

        <div className="mt-5 border-t border-[color:var(--border)] pt-4 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
          {step.caption}
        </div>
      </article>

      {/* Arrow between cards (desktop horizontal, mobile vertical) */}
      {!isLast ? (
        <div
          className="flow-arrow flex items-center justify-center text-[color:var(--text-tertiary)] lg:px-2"
          aria-hidden
        >
          <ArrowRight className="hidden h-5 w-5 lg:inline" />
          <ArrowRight className="inline h-4 w-4 rotate-90 lg:hidden" />
        </div>
      ) : null}
    </>
  );
}
