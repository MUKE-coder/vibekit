"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Run a one-off async function and track `{ data, error, loading, refetch }`.
 * For full server-state caching, prefer React Query — this hook is for
 * smaller cases (a quick autocomplete lookup, a probe in a settings page,
 * loading data inside a Drawer when it opens) where pulling in React
 * Query is overkill.
 *
 *   const { data, error, loading, refetch } = useAsync(
 *     () => fetch(`/api/probe?id=${id}`).then(r => r.json()),
 *     [id],
 *   );
 *
 *   useAsync(loadCustomers, [], { immediate: false });
 *   //   ^ won't run until you call refetch()
 *
 * Latest-call-wins: a slow earlier request is discarded when the deps
 * change, so the result never flashes back to stale data.
 */

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseAsyncOptions {
  /** Run on mount + when deps change. Default: true. */
  immediate?: boolean;
  /** Keep the previous `data` while a refetch is in flight. Default: true. */
  keepPreviousData?: boolean;
}

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: React.DependencyList = [],
  options: UseAsyncOptions = {},
): AsyncState<T> & { refetch: () => Promise<void> } {
  const { immediate = true, keepPreviousData = true } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    loading: immediate,
  });

  const callIdRef = useRef(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    const callId = ++callIdRef.current;
    setState((prev) => ({
      data: keepPreviousData ? prev.data : null,
      error: null,
      loading: true,
    }));
    try {
      const data = await fn();
      if (!mountedRef.current || callId !== callIdRef.current) return;
      setState({ data, error: null, loading: false });
    } catch (err) {
      if (!mountedRef.current || callId !== callIdRef.current) return;
      setState({
        data: keepPreviousData ? state.data : null,
        error: err instanceof Error ? err : new Error(String(err)),
        loading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn, keepPreviousData]);

  useEffect(() => {
    if (!immediate) return;
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ...state, refetch: run };
}
