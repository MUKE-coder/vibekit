"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, MessageCircle, Users } from "lucide-react";
import { useRef } from "react";
import { SITE } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const WHATSAPP_GREEN = "#25D366";
const WHATSAPP_GREEN_HOVER = "#1FB958";

/** Inline WhatsApp glyph (lucide doesn't ship a brand-accurate one) */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export function CommunityBanner() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Animate only the decorative pieces. CTAs render statically so they're
      // ALWAYS visible, even if scroll position bypasses the trigger.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      tl.from(".community-card", { y: 28, opacity: 0, duration: 0.8 })
        .from(".community-eyebrow", { y: 12, opacity: 0, duration: 0.4 }, "-=0.4")
        .from(".community-headline", { y: 14, opacity: 0, duration: 0.5 }, "-=0.3")
        .from(".community-body", { y: 12, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".community-benefit", {
          y: 8,
          opacity: 0,
          stagger: 0.06,
          duration: 0.35,
        }, "-=0.2");
    },
    { scope: root }
  );

  return (
    <section ref={root} id="community" className="relative py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="community-card relative overflow-hidden rounded-[var(--radius-2xl)] border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-6 sm:p-12">
          {/* Ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 70% at 20% 30%, color-mix(in srgb, ${WHATSAPP_GREEN} 18%, transparent), transparent 70%)`,
            }}
          />
          {/* Faded grid */}
          <div className="pointer-events-none absolute inset-0 grid-pattern opacity-50" aria-hidden />

          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="community-eyebrow inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--bg)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)]">
                <span
                  className="grid h-4 w-4 place-items-center rounded-full text-white"
                  style={{ backgroundColor: WHATSAPP_GREEN }}
                >
                  <WhatsAppIcon className="h-2.5 w-2.5" />
                </span>
                Community · WhatsApp
              </div>

              <h2 className="community-headline font-display mt-5 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] tracking-tight text-[color:var(--text-primary)]">
                Join builders shipping with VibeKit.
              </h2>

              <p className="community-body mt-4 max-w-xl text-[15.5px] leading-relaxed text-[color:var(--text-secondary)]">
                Indie hackers, freelancers, founders - we trade screenshots, debug agent loops together, and share what's working in the framework. Drop in to ask anything.
              </p>

              {/* Quick benefits */}
              <ul className="mt-6 grid gap-2 sm:grid-cols-2 max-w-lg">
                {[
                  "Agent screenshots & wins",
                  "Quick rescue when a build is stuck",
                  "Component requests & PR previews",
                  "Direct access to JB",
                ].map((item) => (
                  <li
                    key={item}
                    className="community-benefit flex items-center gap-2 text-[13.5px] text-[color:var(--text-primary)]"
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: WHATSAPP_GREEN }}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTAs - rendered statically (no entrance animation) so they
                  ALWAYS show, regardless of scroll-trigger timing. */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={SITE.community}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(37,211,102,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ backgroundColor: WHATSAPP_GREEN }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = WHATSAPP_GREEN_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = WHATSAPP_GREEN;
                  }}
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Join the WhatsApp community
                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <a
                  href={`${SITE.github}/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-transparent px-5 py-3 font-medium text-[color:var(--text-primary)] transition-colors hover:bg-[color:var(--bg-subtle)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  GitHub Discussions
                </a>
              </div>
            </div>

            {/* Right column - visual */}
            <div className="hidden md:block">
              <div className="relative grid h-32 w-32 place-items-center">
                <div
                  className="absolute h-32 w-32 rounded-full animate-ping"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${WHATSAPP_GREEN} 15%, transparent)`,
                    animationDuration: "2.5s",
                  }}
                />
                <div
                  className="absolute h-24 w-24 rounded-full animate-ping"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${WHATSAPP_GREEN} 25%, transparent)`,
                    animationDuration: "2.5s",
                    animationDelay: "0.4s",
                  }}
                />
                <div
                  className="relative grid h-20 w-20 place-items-center rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.45)]"
                  style={{ backgroundColor: WHATSAPP_GREEN }}
                >
                  <WhatsAppIcon className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-[color:var(--bg)] border border-[color:var(--border-strong)] text-[color:var(--text-primary)]">
                  <Users className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
