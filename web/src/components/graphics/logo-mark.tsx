import { cn } from "@/lib/utils";

/**
 * VibeKit logo mark - a self-contained rounded badge: an accent-tinted tile with
 * a bold "V" and a spark, nodding to the constellation/orbital motif in the hero.
 * Reads cleanly at 24-32px and works on both light and dark backgrounds because
 * the badge supplies its own contrast.
 */
export function LogoMark({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <defs>
        <clipPath id="vk-clip">
          <rect x="1" y="1" width="30" height="30" rx="9" />
        </clipPath>
      </defs>

      {/* Badge - solid accent with light/shade overlays for depth (no color-mix,
          so it can never fail to render). Overlays clipped to the rounded shape. */}
      <g clipPath="url(#vk-clip)">
        <rect x="1" y="1" width="30" height="30" fill="var(--accent)" />
        <rect x="1" y="1" width="30" height="15" fill="#ffffff" opacity="0.14" />
        <rect x="1" y="18" width="30" height="13" fill="#000000" opacity="0.10" />
      </g>

      {/* Bold "V" glyph */}
      <path
        d="M9.5 10.5 L16 22.5 L22.5 10.5"
        stroke="#ffffff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Spark - the "vibe" */}
      <path
        d="M23.4 6.6 l0.75 1.75 1.75 0.75 -1.75 0.75 -0.75 1.75 -0.75 -1.75 -1.75 -0.75 1.75 -0.75 z"
        fill="#ffffff"
      />
    </svg>
  );
}

/** The mark with a soft accent glow - used in the nav. */
export function LogoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-grid place-items-center rounded-[9px] shadow-[var(--shadow-glow)]",
        className,
      )}
    >
      <LogoMark size={30} />
    </span>
  );
}
