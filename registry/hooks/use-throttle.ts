"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Throttle a value — emits the latest `value` at most once per `interval` ms.
 * Useful for animation-frame–rate measurements (scroll position, mouse coords).
 */
export function useThrottle<T>(value: T, interval = 100): T {
  const [throttled, setThrottled] = useState(value);
  const lastEmitRef = useRef(0);
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastEmitRef.current;

    if (elapsed >= interval) {
      lastEmitRef.current = now;
      setThrottled(value);
    } else {
      if (pendingRef.current) clearTimeout(pendingRef.current);
      pendingRef.current = setTimeout(() => {
        lastEmitRef.current = Date.now();
        setThrottled(value);
      }, interval - elapsed);
    }

    return () => {
      if (pendingRef.current) clearTimeout(pendingRef.current);
    };
  }, [value, interval]);

  return throttled;
}

/**
 * Throttle a callback — invoked at most once per `interval` ms.
 * Leading-edge by default (fires immediately on first call).
 */
export function useThrottledCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  interval = 100,
) {
  const fnRef = useRef(fn);
  const lastCallRef = useRef(0);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args: Args) => {
      const now = Date.now();
      if (now - lastCallRef.current >= interval) {
        lastCallRef.current = now;
        fnRef.current(...args);
      }
    },
    [interval],
  );
}
