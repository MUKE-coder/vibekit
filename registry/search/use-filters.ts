"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * URL-synced filter state manager with a typed schema. Complementary to
 * `useTableState` — that hook owns page/sort/q + an open-ended filters
 * bag; `useFilters` is the higher-level helper for richer filter inputs
 * (multi-select, date range, number range, boolean) backed by a single
 * source of truth on the URL.
 *
 *   const { state, set, toggle, clear, reset, isActive } = useFilters({
 *     schema: {
 *       status:    { kind: "multi" },
 *       category:  { kind: "multi" },
 *       createdAt: { kind: "dateRange" },
 *       amount:    { kind: "numRange", defaults: { min: 0, max: 10_000 } },
 *       archived:  { kind: "bool",     defaults: false },
 *     },
 *   });
 *
 *   state.status        // string[]
 *   state.createdAt     // { from: string | null, to: string | null }
 *   state.amount        // { min: number | null, max: number | null }
 *   state.archived      // boolean
 *
 *   set("status", ["paid", "pending"]);
 *   toggle("status", "paid");
 *   clear("status");
 *   reset();             // wipes every filter
 *   isActive("status");  // boolean
 *
 * Each filter persists as a single query-string key. The encoding is
 * stable (alphabetical for multi-selects) so URLs are deterministic.
 */

type MultiSpec = { kind: "multi"; defaults?: string[] };
type BoolSpec = { kind: "bool"; defaults?: boolean };
type DateRangeSpec = { kind: "dateRange"; defaults?: { from?: string; to?: string } };
type NumRangeSpec = { kind: "numRange"; defaults?: { min?: number; max?: number } };
type SingleSpec = { kind: "single"; defaults?: string };

type FilterSpec = MultiSpec | BoolSpec | DateRangeSpec | NumRangeSpec | SingleSpec;
type FilterSchema = Record<string, FilterSpec>;

type ValueOf<S extends FilterSpec> = S extends MultiSpec
  ? string[]
  : S extends BoolSpec
    ? boolean
    : S extends DateRangeSpec
      ? { from: string | null; to: string | null }
      : S extends NumRangeSpec
        ? { min: number | null; max: number | null }
        : S extends SingleSpec
          ? string | null
          : never;

type FilterState<Schema extends FilterSchema> = { [K in keyof Schema]: ValueOf<Schema[K]> };

interface UseFiltersOptions<Schema extends FilterSchema> {
  schema: Schema;
}

export function useFilters<Schema extends FilterSchema>({
  schema,
}: UseFiltersOptions<Schema>) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const state = useMemo<FilterState<Schema>>(() => {
    const out = {} as FilterState<Schema>;
    for (const [key, spec] of Object.entries(schema)) {
      switch (spec.kind) {
        case "multi": {
          const raw = params.get(key);
          out[key as keyof Schema] = (raw ? raw.split(",").filter(Boolean) : (spec.defaults ?? [])) as ValueOf<typeof spec>;
          break;
        }
        case "bool": {
          const raw = params.get(key);
          out[key as keyof Schema] = (raw === null ? (spec.defaults ?? false) : raw === "true") as ValueOf<typeof spec>;
          break;
        }
        case "dateRange": {
          const from = params.get(`${key}.from`) ?? spec.defaults?.from ?? null;
          const to = params.get(`${key}.to`) ?? spec.defaults?.to ?? null;
          out[key as keyof Schema] = { from, to } as ValueOf<typeof spec>;
          break;
        }
        case "numRange": {
          const minStr = params.get(`${key}.min`);
          const maxStr = params.get(`${key}.max`);
          const min = minStr !== null ? Number(minStr) : (spec.defaults?.min ?? null);
          const max = maxStr !== null ? Number(maxStr) : (spec.defaults?.max ?? null);
          out[key as keyof Schema] = { min, max } as ValueOf<typeof spec>;
          break;
        }
        case "single": {
          const raw = params.get(key);
          out[key as keyof Schema] = (raw ?? spec.defaults ?? null) as ValueOf<typeof spec>;
          break;
        }
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, JSON.stringify(schema)]);

  const push = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(params.toString());
      for (const [k, v] of Object.entries(patch)) {
        if (v === null || v === "") next.delete(k);
        else next.set(k, v);
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  const set = useCallback(
    <K extends keyof Schema>(key: K, value: ValueOf<Schema[K]>) => {
      const spec = schema[key];
      const k = key as string;
      switch (spec.kind) {
        case "multi": {
          const arr = (value as string[]) ?? [];
          push({ [k]: arr.length === 0 ? null : [...arr].sort().join(",") });
          break;
        }
        case "bool": {
          push({ [k]: value === true ? "true" : null });
          break;
        }
        case "dateRange": {
          const v = value as { from: string | null; to: string | null };
          push({ [`${k}.from`]: v.from ?? null, [`${k}.to`]: v.to ?? null });
          break;
        }
        case "numRange": {
          const v = value as { min: number | null; max: number | null };
          push({
            [`${k}.min`]: v.min !== null ? String(v.min) : null,
            [`${k}.max`]: v.max !== null ? String(v.max) : null,
          });
          break;
        }
        case "single": {
          push({ [k]: (value as string | null) ?? null });
          break;
        }
      }
    },
    [push, schema],
  );

  const toggle = useCallback(
    <K extends keyof Schema>(key: K, item: string) => {
      const spec = schema[key];
      if (spec.kind !== "multi") {
        throw new Error(`toggle() is only valid for multi-select filters (got '${spec.kind}')`);
      }
      const current = state[key] as unknown as string[];
      const next = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
      set(key, next as ValueOf<Schema[K]>);
    },
    [state, set, schema],
  );

  const clear = useCallback(
    <K extends keyof Schema>(key: K) => {
      const spec = schema[key];
      const k = key as string;
      if (spec.kind === "dateRange" || spec.kind === "numRange") {
        push({ [`${k}.from`]: null, [`${k}.to`]: null, [`${k}.min`]: null, [`${k}.max`]: null });
      } else {
        push({ [k]: null });
      }
    },
    [push, schema],
  );

  const reset = useCallback(() => {
    const next = new URLSearchParams(params.toString());
    for (const key of Object.keys(schema)) {
      next.delete(key);
      next.delete(`${key}.from`);
      next.delete(`${key}.to`);
      next.delete(`${key}.min`);
      next.delete(`${key}.max`);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [params, pathname, router, schema]);

  const isActive = useCallback(
    <K extends keyof Schema>(key: K): boolean => {
      const spec = schema[key];
      const v = state[key];
      switch (spec.kind) {
        case "multi":
          return (v as string[]).length > 0;
        case "bool":
          return Boolean(v);
        case "dateRange": {
          const r = v as { from: string | null; to: string | null };
          return r.from !== null || r.to !== null;
        }
        case "numRange": {
          const r = v as { min: number | null; max: number | null };
          return r.min !== null || r.max !== null;
        }
        case "single":
          return v !== null;
      }
    },
    [state, schema],
  );

  const activeCount = useMemo(
    () => (Object.keys(schema) as Array<keyof Schema>).filter((k) => isActive(k)).length,
    [schema, isActive],
  );

  return { state, set, toggle, clear, reset, isActive, activeCount };
}
