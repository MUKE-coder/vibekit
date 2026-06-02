"use client";

import { useState } from "react";
import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Search-style query with built-in input debounce. Returns the raw input
 * value (for the controlled input) AND the debounced value used for the
 * fetch. The query auto-cancels in-flight requests when the debounced
 * value changes (React Query handles that).
 *
 *   const { input, setInput, query } = useDebouncedQuery({
 *     keyFor: (q) => keys.contacts.list({ q }),
 *     fetchFn: (q) => api.get<Contact[]>(`/contacts?q=${encodeURIComponent(q)}`),
 *     delay: 300,
 *   });
 *
 *   <Input value={input} onChange={(e) => setInput(e.target.value)} />
 *   {query.isFetching ? <Spinner /> : null}
 *   {query.data?.map(...)}
 *
 * If you also want server-side pagination on top, compose with
 * usePaginatedQuery instead — pass the debounced value as part of the
 * query key.
 */

interface UseDebouncedQueryOptions<TData> {
  /** Builds the React Query key from the debounced value. */
  keyFor: (debouncedValue: string) => QueryKey;
  /** Fetch function that receives the debounced value. */
  fetchFn: (debouncedValue: string) => Promise<TData>;
  /** Debounce window in ms. Default: 300. */
  delay?: number;
  /** Initial input value. Default: "". */
  initialValue?: string;
  /**
   * Minimum length before the query fires. Default: 0 (always).
   * Use 2 or 3 to avoid querying on a single character.
   */
  minLength?: number;
}

export function useDebouncedQuery<TData>({
  keyFor,
  fetchFn,
  delay = 300,
  initialValue = "",
  minLength = 0,
}: UseDebouncedQueryOptions<TData>) {
  const [input, setInput] = useState(initialValue);
  const debounced = useDebounce(input, delay);

  const query = useQuery({
    queryKey: keyFor(debounced),
    queryFn: () => fetchFn(debounced),
    enabled: debounced.length >= minLength,
    placeholderData: keepPreviousData,
  });

  return { input, setInput, debounced, query };
}
