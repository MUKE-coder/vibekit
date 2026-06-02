"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounce a value — returns the latest `value` after `delay` ms of inactivity.
 *
 *   const debouncedQuery = useDebounce(query, 300);
 *   useEffect(() => { searchApi(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

/**
 * Debounce a function — returns a stable callback that defers invocation
 * until `delay` ms have passed without another call. Latest args win.
 * Includes a `cancel()` method to clear any pending invocation.
 *
 *   const onChange = useDebouncedCallback((q: string) => search(q), 300);
 *   onChange("foo");           // schedules
 *   onChange.cancel();         // aborts the pending call
 */
export function useDebouncedCallback<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay = 300,
) {
  const fnRef = useRef(fn);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always call the latest fn without forcing consumers to memoise it
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const debounced = useCallback(
    (...args: Args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fnRef.current(...args), delay);
    },
    [delay],
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return Object.assign(debounced, { cancel });
}
