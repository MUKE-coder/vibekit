"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Archive,
  ArrowUp,
  AudioLines,
  ChevronDown,
  Check,
  Code,
  FileText,
  ListTodo,
  MessageSquare,
  Notebook,
  Palette,
  Plus,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const generatedFiles = [
  { name: "project-description.md", Icon: FileText, sub: "What the app is" },
  { name: "project-phases.md", Icon: ListTodo, sub: "Build blueprint" },
  { name: "design-style-guide.md", Icon: Palette, sub: "Visual system" },
  { name: "prompt.md", Icon: Sparkles, sub: "Paste into your agent" },
];

const sidebarIcons = [
  Notebook,
  Plus,
  Search,
  MessageSquare,
  Archive,
  Code,
  Wrench,
  Palette,
];

export function LaptopMockup() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // ─── Animate ONLY the chat content. The laptop itself stays still. ───
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      // 1) User types prompt in the input
      tl.to(".sim-input-text", {
        width: "100%",
        duration: 1.6,
        ease: "steps(58)",
      })
        // Pause to read
        .to({}, { duration: 0.5 })
        // 2) "Submit" - input clears, conversation appears
        .to(".sim-input-text", { width: 0, duration: 0.15 })
        .to(".sim-greeting", { opacity: 0, y: -16, duration: 0.4 })
        .set(".sim-greeting", { display: "none" })
        .set(".sim-conversation", { display: "flex" })
        // 3) User message bubble pops in
        .from(".sim-msg-user", { opacity: 0, y: 12, duration: 0.4 })
        // 4) Claude shows thinking dots
        .from(".sim-thinking", { opacity: 0, y: 8, duration: 0.3 })
        .to(".sim-thinking", { opacity: 0, duration: 0.3, delay: 0.9 })
        .set(".sim-thinking", { display: "none" })
        // 5) Claude asks a follow-up question (typewriter)
        .from(".sim-msg-claude-q", { opacity: 0, y: 8, duration: 0.4 })
        .to(".sim-claude-text", { width: "100%", duration: 1.4, ease: "steps(46)" })
        // 6) User typewrites a quick answer
        .from(".sim-msg-user-2", { opacity: 0, y: 8, duration: 0.4 })
        .to(".sim-user-text-2", { width: "100%", duration: 1.0, ease: "steps(28)" })
        // 7) Files generate one by one
        .from(".sim-generating", { opacity: 0, y: 8, duration: 0.35 })
        .from(".gen-file", {
          opacity: 0,
          x: -16,
          stagger: 0.22,
          duration: 0.45,
          ease: "power2.out",
        })
        .from(
          ".file-check",
          { scale: 0, stagger: 0.22, duration: 0.3, ease: "back.out(2)" },
          "-=0.8"
        )
        .from(".sim-success-pill", { y: 8, opacity: 0, duration: 0.4 });

      // Cursor blink (constant, independent of timeline)
      gsap.to(".typing-cursor", {
        opacity: 0,
        duration: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "steps(1)",
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="see-it" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]" />
            </span>
            See it in action
          </div>
          <h2 className="font-display mt-6 text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
            Idea in. <em className="not-italic gradient-text">Four files out.</em>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[color:var(--text-secondary)]">
            Watch a real Claude conversation: type the idea, Claude interviews you, then generates exactly what your coding agent needs.
          </p>
        </div>

        {/* Laptop - completely static, no float */}
        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* Glow under laptop */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-12 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 50% 50% at 50% 60%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Screen */}
          <div className="relative rounded-t-2xl border border-[color:var(--border-strong)] bg-[#1a1a1a] shadow-[var(--shadow-xl)] overflow-hidden">
            {/* Top bezel + camera */}
            <div className="flex items-center justify-center gap-2 bg-[#0a0a0a] py-1.5">
              <span className="h-1 w-1 rounded-full bg-[#333]" />
            </div>

            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b border-black/40 bg-[#0d0d0d] px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                <span className="h-3 w-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 max-w-md mx-auto rounded-md border border-white/10 bg-black/40 px-3 py-1 text-center font-mono text-[11px] text-white/40">
                claude.ai
              </div>
              <div className="w-12" />
            </div>

            {/* Claude UI body - chat takes full width on phones, sidebar appears at sm */}
            <div className="relative grid grid-cols-1 sm:grid-cols-[56px_1fr] md:grid-cols-[64px_1fr] h-[480px] sm:h-[520px] md:h-[560px] bg-[#262624]">
              {/* Sidebar - hidden on phones to give chat more room */}
              <aside className="hidden sm:flex flex-col items-center justify-between border-r border-white/5 bg-[#1f1f1d] py-4">
                <div className="flex flex-col items-center gap-3">
                  {sidebarIcons.map((Icon, i) => (
                    <button
                      key={i}
                      type="button"
                      tabIndex={-1}
                      className="grid h-8 w-8 place-items-center rounded-md text-white/45 transition-colors hover:bg-white/5 hover:text-white/80"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </button>
                  ))}
                  <button
                    type="button"
                    tabIndex={-1}
                    className="grid h-8 w-8 place-items-center rounded-md text-white/45 hover:bg-white/5"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[#C7956D] font-mono text-[11px] font-semibold uppercase text-[#1f1f1d]">
                  MJ
                </div>
              </aside>

              {/* Main content area */}
              <div className="relative">
                {/* ─── GREETING + INPUT (always visible from the start) ─── */}
                <div className="sim-greeting absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8">
                  <div className="flex items-center gap-2 sm:gap-3 text-center">
                    <ClaudeStar />
                    <h3
                      className="text-[22px] sm:text-[28px] md:text-[32px] text-[#E8DCC4]"
                      style={{ fontFamily: "Georgia, serif", fontWeight: 400 }}
                    >
                      Coffee and Claude time?
                    </h3>
                  </div>

                  {/* Input box - visible immediately, only the text inside types */}
                  <div className="mt-6 sm:mt-8 w-full max-w-2xl rounded-xl sm:rounded-2xl border border-white/8 bg-[#1f1f1d] shadow-2xl">
                    <div className="px-4 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3 min-h-[44px]">
                      <div className="overflow-hidden">
                        <span
                          className="sim-input-text inline-block overflow-hidden whitespace-nowrap font-sans text-[13px] sm:text-[15px] text-white/85"
                          style={{ width: 0 }}
                        >
                          I want to build a school management system for Uganda...
                        </span>
                        <span className="typing-cursor inline-block w-[2px] h-[1em] bg-white/85 align-middle ml-0.5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 px-3 py-2">
                      <button
                        type="button"
                        tabIndex={-1}
                        className="grid h-7 w-7 place-items-center rounded-full text-white/50 hover:bg-white/5"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="flex items-center gap-3 text-[12px] text-white/55">
                        <span className="font-medium text-white/75">Sonnet 4.5</span>
                        <span className="opacity-70">Extended</span>
                        <ChevronDown className="h-3 w-3" />
                        <AudioLines className="h-3.5 w-3.5 ml-1 opacity-70" />
                      </div>
                    </div>
                  </div>

                  {/* Action chips - fewer chips visible on tiny screens to avoid overflow */}
                  <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    {["Write", "Learn", "Code", "Life stuff", "Claude's choice"].map((label, i) => (
                      <span
                        key={label}
                        className={cn(
                          "rounded-full border border-white/8 bg-[#1f1f1d] px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-[12px] text-white/55",
                          i >= 3 && "hidden sm:inline-block"
                        )}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ─── CONVERSATION (hidden until "submit") ─── */}
                <div className="sim-conversation absolute inset-0 hidden flex-col">
                  <div className="flex-1 overflow-hidden p-5 sm:p-6 space-y-4">
                    {/* User message */}
                    <div className="sim-msg-user flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3a3a37] px-4 py-2.5 text-[13.5px] text-white/90">
                        I want to build a school management system for Uganda...
                      </div>
                    </div>

                    {/* Thinking */}
                    <div className="sim-thinking flex items-center gap-2 pl-1">
                      <ClaudeStar small />
                      <div className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse"
                          style={{ animationDelay: "0.15s" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
                        Reading framework...
                      </span>
                    </div>

                    {/* Claude question */}
                    <div className="sim-msg-claude-q flex gap-3">
                      <ClaudeStar small />
                      <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f1f1d] border border-white/5 px-4 py-2.5 text-[13.5px] leading-relaxed text-white/85">
                        <div className="overflow-hidden">
                          <span
                            className="sim-claude-text inline-block overflow-hidden whitespace-nowrap"
                            style={{ width: 0 }}
                          >
                            Which user roles? Teachers, parents, students, admins?
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* User answer */}
                    <div className="sim-msg-user-2 flex justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#3a3a37] px-4 py-2.5 text-[13.5px] text-white/90">
                        <div className="overflow-hidden">
                          <span
                            className="sim-user-text-2 inline-block overflow-hidden whitespace-nowrap"
                            style={{ width: 0 }}
                          >
                            All four. Parents pay school fees too.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Generating files */}
                    <div className="sim-generating space-y-2">
                      <div className="flex items-center gap-2 pl-1">
                        <ClaudeStar small />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/80">
                          ✓ Generated 4 files
                        </span>
                      </div>
                      {generatedFiles.map(({ name, Icon, sub }) => (
                        <div
                          key={name}
                          className="gen-file flex items-center gap-3 rounded-md border border-white/8 bg-[#1f1f1d] px-3 py-2 ml-7"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/10 bg-[#262624] text-white/55">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[12px] text-white/85 truncate">
                              {name}
                            </div>
                            <div className="text-[11px] text-white/40 truncate">{sub}</div>
                          </div>
                          <span className="file-check grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
                            <Check className="h-3 w-3" />
                          </span>
                        </div>
                      ))}

                      <div className="sim-success-pill mt-3 ml-7 flex">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#818CF8]/30 bg-[#818CF8]/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[#A5B4FC]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#818CF8]" />
                          Ready to paste into your agent
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom input bar */}
                  <div className="border-t border-white/5 bg-[#1f1f1d] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        tabIndex={-1}
                        className="grid h-7 w-7 place-items-center rounded-full text-white/40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <div className="flex-1 text-[12px] text-white/35">Reply to Claude...</div>
                      <button
                        type="button"
                        tabIndex={-1}
                        className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white/70"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop base */}
          <div
            className="relative mx-auto h-3 rounded-b-2xl bg-gradient-to-b from-[#3a3a37] to-[#1a1a18]"
            style={{ width: "calc(100% + 24px)", marginLeft: "-12px" }}
          />
          <div
            className="mx-auto h-1 rounded-b-2xl bg-[#1a1a18]"
            style={{ width: "32%" }}
          />
        </div>
      </div>
    </section>
  );
}

/** Claude's star/asterisk symbol - peach orange */
function ClaudeStar({ small = false }: { small?: boolean }) {
  const size = small ? 16 : 28;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#D97757"
      aria-hidden
      className="shrink-0"
    >
      <path d="M12 2 L13.5 8.5 L20 7 L14.5 11 L20 17 L13.5 15.5 L12 22 L10.5 15.5 L4 17 L9.5 11 L4 7 L10.5 8.5 Z" />
    </svg>
  );
}
