"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * SSR-safe `useLocalStorage` with typed values, cross-tab sync (via the
 * `storage` event), and a setter that accepts either a value or an updater
 * function (just like `useState`).
 *
 *   const [theme, setTheme] = useLocalStorage("theme", "system");
 *   const [cart, setCart] = useLocalStorage<Cart>("cart", { items: [] });
 *
 * The initial value is returned on the server and on the first client
 * render to dodge hydration mismatches; the real stored value (if any)
 * applies after mount.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValueState] = useState<T>(initialValue);
  const initialised = useRef(false);

  // Hydrate from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValueState(JSON.parse(raw) as T);
    } catch {
      // ignore corrupt values
    } finally {
      initialised.current = true;
    }
  }, [key]);

  // Cross-tab sync
  useEffect(() => {
    if (typeof window === "undefined") return;
    function handleStorage(event: StorageEvent) {
      if (event.key !== key) return;
      if (event.newValue === null) {
        setValueState(initialValue);
        return;
      }
      try {
        setValueState(JSON.parse(event.newValue) as T);
      } catch {
        // ignore parse errors from other tabs writing junk
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValueState((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(resolved));
          } catch {
            // quota exceeded / private mode — silently no-op
          }
        }
        return resolved;
      });
    },
    [key],
  );

  const remove = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    setValueState(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}
