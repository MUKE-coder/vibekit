"use client";

import { cn } from "@/lib/utils";

type IconProps = { className?: string; size?: number };

/* ─────────────────────────────────────────────────────────────
 * 3D-style isometric icons with subtle CSS animations.
 * All use a 64x64 viewBox, currentColor for stroke, and rely
 * on inherited text color for theming.
 * ──────────────────────────────────────────────────────────── */

const baseProps = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Stack of cubes - represents components / building blocks. Animates on hover. */
export function CubeStack({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn("transition-transform duration-500 group-hover:-translate-y-0.5", className)} aria-hidden>
      {/* Bottom cube */}
      <g opacity="0.55">
        <path d="M14 44 L32 52 L50 44 L32 36 Z" />
        <path d="M14 44 L14 38 L32 30 L50 38 L50 44" />
        <path d="M32 36 L32 30" />
      </g>
      {/* Middle cube */}
      <g opacity="0.78">
        <path d="M18 32 L32 38 L46 32 L32 26 Z" />
        <path d="M18 32 L18 27 L32 21 L46 27 L46 32" />
        <path d="M32 26 L32 21" />
      </g>
      {/* Top cube - accent */}
      <g className="text-[color:var(--accent)]" stroke="currentColor">
        <path d="M22 22 L32 27 L42 22 L32 17 Z" />
        <path d="M22 22 L22 18 L32 13 L42 18 L42 22" />
        <path d="M32 17 L32 13" />
      </g>
    </svg>
  );
}

/** Layered files - represents the 4-file output. */
export function FileStack({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn(className)} aria-hidden>
      <g opacity="0.4">
        <rect x="14" y="22" width="32" height="38" rx="2" />
      </g>
      <g opacity="0.7">
        <rect x="17" y="18" width="32" height="38" rx="2" />
      </g>
      <g>
        <rect x="20" y="14" width="32" height="38" rx="2" />
        <line x1="26" y1="22" x2="46" y2="22" />
        <line x1="26" y1="28" x2="46" y2="28" />
        <line x1="26" y1="34" x2="42" y2="34" />
        <line x1="26" y1="40" x2="38" y2="40" />
      </g>
    </svg>
  );
}

/** Orbiting rings around a core - used as the hero / "framework" mark.
 *  Sizing rule: if `className` provides explicit width/height (e.g.
 *  `h-[110px] w-[110px] sm:h-[140px] sm:w-[140px]`), those win and the
 *  rings + core scale via 100% width/height. Otherwise `size` is used.
 */
export function OrbitalCore({ className, size = 96, animate = true }: IconProps & { animate?: boolean }) {
  // If a sizing class is supplied, let CSS drive the size; otherwise fall back to the size prop.
  const useClassSize = !!className && /\b(h|w)-/.test(className);
  const wrapperStyle = useClassSize ? undefined : { width: size, height: size };

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={wrapperStyle}
      aria-hidden
    >
      {/* Outer ring */}
      <svg
        viewBox="0 0 96 96"
        className={cn("absolute inset-0 h-full w-full", animate && "animate-spin-slow")}
      >
        <ellipse cx="48" cy="48" rx="44" ry="18" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.35" />
      </svg>
      {/* Mid ring (tilted) */}
      <svg
        viewBox="0 0 96 96"
        className={cn("absolute inset-0 h-full w-full", animate && "animate-spin-slow")}
        style={{ animationDuration: "22s", animationDirection: "reverse", transform: "rotate(45deg)" }}
      >
        <ellipse cx="48" cy="48" rx="40" ry="14" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.45" />
      </svg>
      {/* Inner ring */}
      <svg
        viewBox="0 0 96 96"
        className={cn("absolute inset-0 h-full w-full", animate && "animate-spin-slow")}
        style={{ animationDuration: "12s", transform: "rotate(-30deg)" }}
      >
        <ellipse cx="48" cy="48" rx="32" ry="10" stroke="currentColor" strokeWidth="0.75" fill="none" opacity="0.6" />
      </svg>
      {/* Core icosahedron - viewBox comes from baseProps (0 0 64 64). h/w=50% scales with parent */}
      <svg
        {...baseProps}
        className={cn("relative h-1/2 w-1/2 text-[color:var(--accent)]", animate && "animate-pulse-glow")}
      >
        <path d="M32 8 L52 22 L52 44 L32 56 L12 44 L12 22 Z" strokeWidth="1.5" />
        <path d="M32 8 L32 56" strokeWidth="0.75" opacity="0.6" />
        <path d="M12 22 L52 44" strokeWidth="0.75" opacity="0.6" />
        <path d="M52 22 L12 44" strokeWidth="0.75" opacity="0.6" />
        <circle cx="32" cy="32" r="4" fill="currentColor" />
      </svg>
      {/* Orbiting node */}
      {animate && (
        <span
          className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"
          style={{ animation: "orbit 9s linear infinite", ["--orbit-r" as string]: `${size / 2.4}px` }}
        />
      )}
    </div>
  );
}

/** Phase / steps icon - three stacked horizontal bars. */
export function PhaseLines({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn(className)} aria-hidden>
      <rect x="12" y="16" width="40" height="6" rx="1.5" opacity="0.5" />
      <rect x="12" y="29" width="32" height="6" rx="1.5" opacity="0.75" />
      <rect x="12" y="42" width="24" height="6" rx="1.5" />
      <circle cx="55" cy="45" r="2.5" fill="currentColor" className="text-[color:var(--accent)]" />
    </svg>
  );
}

/** Shield with checkmark - pre-deploy review. */
export function ShieldCheck3D({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn(className)} aria-hidden>
      <path d="M32 8 L52 16 L52 32 C52 42 44 50 32 56 C20 50 12 42 12 32 L12 16 Z" />
      <path d="M22 32 L30 40 L44 24" strokeWidth="2" className="text-[color:var(--accent)]" />
      <path d="M32 8 L52 16" opacity="0.5" />
    </svg>
  );
}

/** Database / stack rings. */
export function StackRings({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn(className)} aria-hidden>
      <ellipse cx="32" cy="14" rx="18" ry="6" />
      <path d="M14 14 L14 32 C14 36 22 40 32 40 C42 40 50 36 50 32 L50 14" />
      <path d="M14 23 C14 27 22 30 32 30 C42 30 50 27 50 23" opacity="0.55" />
      <path d="M14 32 L14 50 C14 54 22 58 32 58 C42 58 50 54 50 50 L50 32" opacity="0.7" />
      <path d="M14 41 C14 45 22 48 32 48 C42 48 50 45 50 41" opacity="0.55" />
    </svg>
  );
}

/** Code brackets - the master prompt / coding standards. */
export function CodeBrackets({ className, size = 56 }: IconProps) {
  return (
    <svg width={size} height={size} {...baseProps} className={cn(className)} aria-hidden>
      <path d="M22 16 L10 32 L22 48" strokeWidth="2" />
      <path d="M42 16 L54 32 L42 48" strokeWidth="2" />
      <path d="M36 14 L28 50" strokeWidth="2" className="text-[color:var(--accent)]" />
    </svg>
  );
}
