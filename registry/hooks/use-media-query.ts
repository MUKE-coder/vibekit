"use client";

import { useEffect, useState } from "react";

/**
 * Reactive media-query hook. Returns `false` on the server and during the
 * first client render to avoid hydration mismatches; updates after mount.
 *
 *   const isMobile = useMediaQuery("(max-width: 767px)");
 *
 * Convenience presets are exported alongside for Tailwind v4 breakpoints
 * (sm 640, md 768, lg 1024, xl 1280, 2xl 1536):
 *
 *   const { isMobile, isTablet, isDesktop } = useBreakpoint();
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    // Modern + legacy listeners
    if ("addEventListener" in mql) mql.addEventListener("change", handler);
    else (mql as MediaQueryList).addListener(handler);

    return () => {
      if ("removeEventListener" in mql) mql.removeEventListener("change", handler);
      else (mql as MediaQueryList).removeListener(handler);
    };
  }, [query]);

  return matches;
}

/**
 * Named breakpoint helpers built on top of useMediaQuery.
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return { isMobile, isTablet, isDesktop };
}
