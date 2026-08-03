"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type VideoEmbedProps = {
  /** YouTube video ID (the part after `youtu.be/` or `youtube.com/watch?v=`). */
  videoId: string;
  /** Custom thumbnail URL. Defaults to YouTube's hqdefault image. */
  thumbnail?: string;
  /** Aspect ratio. Defaults to 16/9. */
  aspectRatio?: string;
  /** Title for accessibility + iframe title attribute. */
  title?: string;
  /** Caption shown below the video. */
  caption?: string;
  className?: string;
};

/**
 * Click-to-play YouTube facade.
 * Renders only a thumbnail + play button until the user clicks - then swaps to
 * the real iframe with autoplay. Saves ~500KB of YouTube JS on initial load.
 */
export function VideoEmbed({
  videoId,
  thumbnail,
  aspectRatio = "16/9",
  title = "YouTube video",
  caption,
  className,
}: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const fallbackThumb = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbSrc = thumbnail ?? fallbackThumb;
  const watchUrl = `https://youtu.be/${videoId}`;

  return (
    <figure className={cn("not-prose", className)}>
      <div
        className="relative overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] shadow-[var(--shadow-md)]"
        style={{ aspectRatio }}
      >
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)] focus-visible:outline-offset-2"
            aria-label={`Play video: ${title}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbSrc}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                // Fallback if maxresdefault doesn't exist (older / private videos)
                const img = e.currentTarget;
                if (img.src !== fallbackThumb && img.src !== `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`) {
                  img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                }
              }}
            />

            {/* Subtle gradient for play-button contrast */}
            <span
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.35) 100%)",
              }}
              aria-hidden
            />

            {/* Play button - pulsing ring + indigo core */}
            <span className="absolute inset-0 grid place-items-center">
              <span className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
                <span className="absolute h-full w-full rounded-full bg-[color:var(--accent)]/30 animate-ping" />
                <span className="absolute h-[80%] w-[80%] rounded-full bg-[color:var(--accent)]/40 blur-md" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)] shadow-[0_8px_28px_rgba(79,70,229,0.45)] transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                  <Play
                    className="h-6 w-6 translate-x-0.5 fill-white text-white sm:h-8 sm:w-8"
                    strokeWidth={0}
                  />
                </span>
              </span>
            </span>

            {/* Top-right "Watch on YouTube" pill */}
            <span
              className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white backdrop-blur-sm sm:right-4 sm:top-4 sm:text-[11px]"
              aria-hidden
            >
              YouTube
            </span>

            {/* Bottom title strip */}
            {title ? (
              <span className="absolute bottom-0 left-0 right-0 flex items-end gap-2 p-4 sm:p-5">
                <span className="font-mono text-[12px] uppercase tracking-wider text-white drop-shadow sm:text-[13px]">
                  {title}
                </span>
              </span>
            ) : null}
          </button>
        )}
      </div>

      {caption ? (
        <figcaption className="mt-3 text-center text-[13px] text-[color:var(--text-tertiary)]">
          {caption} ·{" "}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--text-secondary)] underline underline-offset-4 hover:text-[color:var(--text-primary)]"
          >
            Watch on YouTube
          </a>
        </figcaption>
      ) : null}
    </figure>
  );
}
