"use client";

import { keepPreviousData, useQuery, type QueryKey } from "@tanstack/react-query";

/**
 * Pagination abstraction layered on top of React Query. Supports the
 * framework's standard server response shape (`{ data, total, page,
 * pageSize, totalPages }`) and exposes `nextPage` / `prevPage` /
 * `setPage` plus the underlying query state.
 *
 *   const { rows, total, page, pageSize, totalPages, isFetching, setPage, nextPage, prevPage } =
 *     usePaginatedQuery({
 *       queryKey: keys.invoices.list({ page, pageSize, q }),
 *       queryFn: () => api.get<Page<Invoice>>("/invoices", { params: { page, pageSize, q } }),
 *       page,
 *       pageSize,
 *       onPageChange: setPage,
 *     });
 *
 * Uses `keepPreviousData` so the table doesn't blank on page change.
 */

export interface Page<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UsePaginatedQueryOptions<T> {
  queryKey: QueryKey;
  queryFn: () => Promise<Page<T>>;
  /** Current page (1-indexed). */
  page: number;
  /** Page size — informational here; the queryFn is responsible for it. */
  pageSize: number;
  /** Called by `setPage` / `nextPage` / `prevPage` so the caller can update URL state. */
  onPageChange: (page: number) => void;
  /** Pass false to pause the query (e.g. before required filters are set). */
  enabled?: boolean;
}

export function usePaginatedQuery<T>({
  queryKey,
  queryFn,
  page,
  pageSize,
  onPageChange,
  enabled = true,
}: UsePaginatedQueryOptions<T>) {
  const query = useQuery({
    queryKey,
    queryFn,
    enabled,
    placeholderData: keepPreviousData,
  });

  const page_ = query.data?.page ?? page;
  const totalPages = query.data?.totalPages ?? 1;

  return {
    rows: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    page: page_,
    pageSize,
    totalPages,
    hasPrev: page_ > 1,
    hasNext: page_ < totalPages,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
    setPage: onPageChange,
    nextPage: () => {
      if (page_ < totalPages) onPageChange(page_ + 1);
    },
    prevPage: () => {
      if (page_ > 1) onPageChange(page_ - 1);
    },
  };
}
