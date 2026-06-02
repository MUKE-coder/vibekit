"use client";

import * as React from "react";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";

/**
 * Prefetch detail data on hover/focus so the user lands on an
 * already-warm cache. Wraps any element (typically a link or row) and
 * fires React Query's `prefetchQuery` on the first hover, then again
 * after `cooldownMs` of mouse-out to handle re-hovers.
 *
 *   <PrefetchOnHover
 *     queryKey={keys.invoices.detail(id)}
 *     queryFn={() => api.get(`/invoices/${id}`)}
 *   >
 *     <Link href={`/invoices/${id}`}>{invoice.title}</Link>
 *   </PrefetchOnHover>
 *
 * The prefetch fires AT MOST once per cooldown window — moving the
 * mouse over a list of 100 rows won't fire 100 prefetches. Touch
 * devices get the prefetch on focus instead (no hover).
 */

interface PrefetchOnHoverProps {
  /** React Query key — usually a `keys.entity.detail(id)` call. */
  queryKey: QueryKey;
  /** Fetcher invoked on hover. */
  queryFn: () => Promise<unknown>;
  /** Cache time on the prefetched result (ms). Default: 30s. */
  staleTime?: number;
  /** Don't prefetch again for this many ms after the cursor leaves. Default: 500. */
  cooldownMs?: number;
  /** Override the prefetch trigger. Default: enabled. */
  enabled?: boolean;
  children: React.ReactNode;
}

export function PrefetchOnHover({
  queryKey,
  queryFn,
  staleTime = 30_000,
  cooldownMs = 500,
  enabled = true,
  children,
}: PrefetchOnHoverProps) {
  const qc = useQueryClient();
  const lastPrefetchAt = React.useRef(0);

  const trigger = React.useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastPrefetchAt.current < cooldownMs) return;
    lastPrefetchAt.current = now;
    void qc.prefetchQuery({ queryKey, queryFn, staleTime });
  }, [enabled, cooldownMs, qc, queryKey, queryFn, staleTime]);

  return (
    <span onMouseEnter={trigger} onFocusCapture={trigger}>
      {children}
    </span>
  );
}

/**
 * Hook variant for when you don't want to add a wrapper element. Returns
 * `{ onMouseEnter, onFocus }` handlers — spread onto whatever you're
 * prefetching for.
 *
 *   const { onMouseEnter, onFocus } = usePrefetchOnHover({
 *     queryKey: keys.invoices.detail(id),
 *     queryFn: () => api.get(`/invoices/${id}`),
 *   });
 *
 *   <Link href={...} onMouseEnter={onMouseEnter} onFocus={onFocus}>…</Link>
 */
export function usePrefetchOnHover(options: Omit<PrefetchOnHoverProps, "children">) {
  const { queryKey, queryFn, staleTime = 30_000, cooldownMs = 500, enabled = true } = options;
  const qc = useQueryClient();
  const lastPrefetchAt = React.useRef(0);

  const trigger = React.useCallback(() => {
    if (!enabled) return;
    const now = Date.now();
    if (now - lastPrefetchAt.current < cooldownMs) return;
    lastPrefetchAt.current = now;
    void qc.prefetchQuery({ queryKey, queryFn, staleTime });
  }, [enabled, cooldownMs, qc, queryKey, queryFn, staleTime]);

  return { onMouseEnter: trigger, onFocus: trigger };
}
