"use client";

import { useEffect, useRef } from "react";

/**
 * Returns the previous render's value of `value`. Returns `undefined` on the
 * first render. Tiny but constantly needed (compare prev/next props, animate
 * on changes, log transitions).
 *
 *   const prevCount = usePrevious(count);
 *   if (prevCount !== undefined && prevCount !== count) fireConfetti();
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
