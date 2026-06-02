"use client";

import { useEffect, useRef } from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Polling manager that pauses on hidden tabs and resumes on focus.
 * Better than React Query's `refetchInterval` for two reasons:
 *
 *   1. Suspends while `document.hidden` (saves battery + API quota)
 *   2. Triggers an immediate refetch when the tab regains focus
 *      (the user expects fresh data when they come back)
 *
 *   useQuery({ queryKey: keys.deployments, queryFn: fetchDeployments });
 *   usePolling(keys.deployments, 5000);
 *
 * For one-off polling without React Query, the `usePollingFn` variant
 * runs a callback directly:
 *
 *   usePollingFn(() => fetchStatus(jobId), 2000, { enabled: !done });
 */

interface UsePollingOptions {
  enabled?: boolean;
  /** Refetch immediately on focus. Default: true. */
  refetchOnFocus?: boolean;
}

/** Invalidate a React Query key on an interval, pausing on hidden tabs. */
export function usePolling(
  queryKey: QueryKey,
  intervalMs: number,
  options: UsePollingOptions = {},
) {
  const { enabled = true, refetchOnFocus = true } = options;
  const qc = useQueryClient();

  useEffect(() => {
    if (!enabled || intervalMs <= 0 || typeof window === "undefined") return;

    let id: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (document.visibilityState === "visible") {
        qc.invalidateQueries({ queryKey });
      }
    };

    function start() {
      if (id !== null) return;
      id = setInterval(tick, intervalMs);
    }
    function stop() {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    }
    function onVisibility() {
      if (document.visibilityState === "visible") {
        if (refetchOnFocus) qc.invalidateQueries({ queryKey });
        start();
      } else {
        stop();
      }
    }

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, intervalMs, refetchOnFocus, qc, JSON.stringify(queryKey)]);
}

/**
 * Run a callback on an interval, pausing on hidden tabs. Use when you
 * don't have a React Query key — e.g. WebSocket health checks, raw fetch
 * loops, periodic side effects.
 */
export function usePollingFn(
  fn: () => void | Promise<void>,
  intervalMs: number,
  options: UsePollingOptions = {},
) {
  const { enabled = true, refetchOnFocus = true } = options;
  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => {
    if (!enabled || intervalMs <= 0 || typeof window === "undefined") return;
    let id: ReturnType<typeof setInterval> | null = null;

    const tick = () => {
      if (document.visibilityState === "visible") void fnRef.current();
    };

    function start() {
      if (id !== null) return;
      id = setInterval(tick, intervalMs);
    }
    function stop() {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    }
    function onVisibility() {
      if (document.visibilityState === "visible") {
        if (refetchOnFocus) void fnRef.current();
        start();
      } else {
        stop();
      }
    }

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, intervalMs, refetchOnFocus]);
}
