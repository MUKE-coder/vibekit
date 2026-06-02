"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

/**
 * URL-synced table state: page, pageSize, sort, search, and arbitrary filters.
 *
 * Backing URL params:
 *   ?page=1&pageSize=20&sort=createdAt&dir=desc&q=foo&status=active,pending
 *
 * Why URL-driven: tables become shareable and bookmarkable, the back button
 * works, and you can pass `searchParams` straight into a server-side fetcher.
 *
 * Usage:
 *   const { state, setPage, setSort, setSearch, setFilter, reset } = useTableState({
 *     defaultPageSize: 20,
 *   });
 */

export interface TableState {
  page: number;
  pageSize: number;
  sort: string | null;
  dir: "asc" | "desc";
  q: string;
  filters: Record<string, string[]>;
}

interface UseTableStateOptions {
  defaultPageSize?: number;
  defaultSort?: string;
  defaultDir?: "asc" | "desc";
  /** URL param keys reserved as filters. Anything not in this list is ignored. */
  filterKeys?: string[];
}

export function useTableState(options: UseTableStateOptions = {}) {
  const { defaultPageSize = 20, defaultSort = null, defaultDir = "desc", filterKeys = [] } =
    options;

  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state = useMemo<TableState>(() => {
    const filters: Record<string, string[]> = {};
    for (const key of filterKeys) {
      const raw = params.get(key);
      if (raw) filters[key] = raw.split(",").filter(Boolean);
    }
    return {
      page: Math.max(1, Number(params.get("page") ?? 1)),
      pageSize: Math.max(1, Number(params.get("pageSize") ?? defaultPageSize)),
      sort: params.get("sort") ?? defaultSort,
      dir: (params.get("dir") as "asc" | "desc") ?? defaultDir,
      q: params.get("q") ?? "",
      filters,
    };
  }, [params, defaultPageSize, defaultSort, defaultDir, filterKeys]);

  const push = useCallback(
    (patch: Partial<Record<string, string | number | null>>) => {
      const next = new URLSearchParams(params.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const setPage = useCallback((page: number) => push({ page }), [push]);
  const setPageSize = useCallback(
    (pageSize: number) => push({ pageSize, page: 1 }),
    [push],
  );
  const setSort = useCallback(
    (sort: string | null, dir: "asc" | "desc" = "desc") => push({ sort, dir, page: 1 }),
    [push],
  );
  const setSearch = useCallback((q: string) => push({ q, page: 1 }), [push]);
  const setFilter = useCallback(
    (key: string, values: string[]) =>
      push({ [key]: values.length === 0 ? null : values.join(","), page: 1 }),
    [push],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { state, setPage, setPageSize, setSort, setSearch, setFilter, reset };
}
