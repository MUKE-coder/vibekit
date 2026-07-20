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

  // WHY: `threshold` is commonly passed as an inline array (`{ threshold: [0, 0.5, 1] }`)
  // and `root` as an element, both compared by identity in a dep array. Depending on
  // them directly recreates the observer every render; `observe()` synchronously queues
  // a callback → setEntry → render → new observer → "Maximum update depth exceeded".
  // A serialised key changes only when the init genuinely changes.
  const initKey = JSON.stringify({
    root: !!observerInit.root,
    rootMargin: observerInit.rootMargin,
    threshold: observerInit.threshold,
  });

  // The effect reads the live init from a ref so the key can stay the only dependency.
  const initRef = useRef(observerInit);
  initRef.current = observerInit;

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
    }, initRef.current);

    observer.observe(node);
    return () => observer.disconnect();
    // initKey stands in for the observer init — see note above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, freezeOnceVisible, initKey]);

  return { ref, entry, isIntersecting: entry?.isIntersecting ?? false };
}
