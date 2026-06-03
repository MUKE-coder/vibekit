"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

/**
 * `useIsMounted()` — returns `false` on the server / first render, then
 * flips to `true` after `useEffect` fires. Useful when you need to dodge
 * hydration mismatches WITHOUT pulling in the full `<ClientOnly>`
 * wrapper:
 *
 *   const mounted = useIsMounted();
 *   return <span>{mounted ? <RandomEmoji /> : null}</span>;
 *
 * `useMountedRef()` — same idea but as a ref, for async callbacks that
 * need to check "am I still here?" before calling `setState`:
 *
 *   const isMounted = useMountedRef();
 *   useEffect(() => {
 *     fetchSomething().then((data) => {
 *       if (isMounted.current) setData(data);
 *     });
 *   }, []);
 */

export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

export function useMountedRef(): MutableRefObject<boolean> {
  const ref = useRef(true);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return ref;
}
