"use client";

import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Disconnect once the target has entered the viewport. Default: false. */
  freezeOnceVisible?: boolean;
  /** Disable the observer entirely (e.g. if a feature flag is off). */
  enabled?: boolean;
}

/**
 * Generic visibility hook. Returns a ref to attach to the element and the
 * latest `IntersectionObserverEntry`. Use it for lazy-load, reveal animations,
 * infinite scroll sentinels, view-tracking.
 *
 *   const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.2 });
 *   <div ref={ref}>{isIntersecting && <Heavy />}</div>
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {},
) {
  const { freezeOnceVisible = false, enabled = true, ...observerInit } = options;
  const ref = useRef<T | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozen = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (frozen.current) return;

    const observer = new IntersectionObserver(([next]) => {
      setEntry(next);
      if (freezeOnceVisible && next?.isIntersecting) {
        frozen.current = true;
        observer.disconnect();
      }
    }, observerInit);

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, freezeOnceVisible, observerInit.root, observerInit.rootMargin, observerInit.threshold]);

  return { ref, entry, isIntersecting: entry?.isIntersecting ?? false };
}
