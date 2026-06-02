"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Top progress bar that animates during route transitions — the
 * nprogress UX without the dependency. Drop it once near the root
 * (inside the body, above page content):
 *
 *   <GlobalLoadingBar />
 *
 * Behaviour:
 *   - Bar appears on link click / form submit / programmatic
 *     `router.push()` and animates to ~80% while the new route loads
 *   - Completes (snaps to 100%) and fades out once the path or search
 *     params change (= new route rendered)
 *   - Respects `prefers-reduced-motion` (instant on, no progress
 *     animation, instant off)
 *
 * Works in Next.js App Router. The trigger is anchor-click capture
 * because App Router doesn't expose a navigation start event yet —
 * complete is on pathname / searchParams change.
 */

interface GlobalLoadingBarProps {
  /** Tailwind colour class for the bar. Default: bg-foreground. */
  color?: string;
  /** Height in px. Default: 2. */
  heightPx?: number;
  /** ms before re-enabling the trigger after completion. Default: 150. */
  cooldownMs?: number;
  className?: string;
}

export function GlobalLoadingBar({
  color = "bg-foreground",
  heightPx = 2,
  cooldownMs = 150,
  className,
}: GlobalLoadingBarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = React.useState(0);
  const [active, setActive] = React.useState(false);

  // Detect anchor-click + form-submit navigations
  React.useEffect(() => {
    function isExternalAnchor(anchor: HTMLAnchorElement) {
      try {
        const url = new URL(anchor.href, window.location.href);
        return url.origin !== window.location.origin;
      } catch {
        return true;
      }
    }

    function onClick(event: MouseEvent) {
      const el = event.target as HTMLElement | null;
      const anchor = el?.closest("a") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (event.button !== 0) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.getAttribute("data-no-loading-bar") !== null) return;
      if (!anchor.href || isExternalAnchor(anchor)) return;

      const target = new URL(anchor.href, window.location.href);
      if (target.pathname === window.location.pathname && target.search === window.location.search) {
        return; // hash / same route — skip
      }
      setActive(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Drive the progress animation while active
  React.useEffect(() => {
    if (!active) return;
    setProgress(8);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p < 30) return p + 12; // first stretch — quick
        if (p < 60) return p + 4;  // middle — slower
        if (p < 80) return p + 1;  // creep toward 80%
        return p; // hold at ~80% until completion
      });
    }, 120);
    return () => clearInterval(id);
  }, [active]);

  // Complete on path / search change
  React.useEffect(() => {
    if (!active) return;
    setProgress(100);
    const id = setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, cooldownMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed left-0 right-0 top-0 z-[100] overflow-hidden",
        className,
      )}
      style={{ height: heightPx }}
    >
      <div
        className={cn(
          "h-full transition-[width,opacity] duration-200 motion-reduce:transition-none",
          color,
        )}
        style={{
          width: `${progress}%`,
          opacity: active ? 1 : 0,
        }}
      />
    </div>
  );
}
