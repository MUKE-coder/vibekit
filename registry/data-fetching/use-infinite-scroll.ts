"use client";

import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

/**
 * Wires a React Query infinite query to an IntersectionObserver sentinel.
 * Drop the returned `ref` on the bottom-of-list element; the hook calls
 * `fetchNextPage` when it scrolls into view (and respects `hasNextPage`
 * + `isFetchingNextPage` so it doesn't fire duplicate requests).
 *
 *   const q = useInfiniteQuery({...});
 *   const { ref } = useInfiniteScroll({
 *     hasNextPage: q.hasNextPage,
 *     isFetchingNextPage: q.isFetchingNextPage,
 *     fetchNextPage: q.fetchNextPage,
 *   });
 *
 *   {q.data.pages.flatMap(p => p.items).map(...)}
 *   <div ref={ref} />              // sentinel
 */

interface UseInfiniteScrollOptions {
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  /** Pass false to pause the auto-fetch (e.g. while a filter is being typed). */
  enabled?: boolean;
  /** Root margin for the observer. Default: "200px" — pre-fetches before the user reaches the bottom. */
  rootMargin?: string;
  /** Visibility threshold. Default: 0 (any intersection). */
  threshold?: number;
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions) {
  const { hasNextPage, isFetchingNextPage, fetchNextPage, enabled = true, rootMargin = "200px", threshold = 0 } =
    options;

  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold,
    enabled,
  });

  // Guard against firing while a fetch is in-flight or there's no more pages
  const lastFetchedAt = useRef(0);
  useEffect(() => {
    if (!isIntersecting) return;
    if (!enabled) return;
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;

    // Debounce against rapid-fire intersections (e.g. on scroll bounce)
    const now = Date.now();
    if (now - lastFetchedAt.current < 200) return;
    lastFetchedAt.current = now;

    fetchNextPage();
  }, [isIntersecting, enabled, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return { ref };
}
