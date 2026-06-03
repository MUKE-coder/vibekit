"use client";

import * as React from "react";
import { Check, ChevronDown, Filter, X } from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * Composable faceted filter bar. Reads/writes from `useFilters` so the
 * URL stays the single source of truth. Drop one `<FilterBar.*>` per
 * filter you want to expose:
 *
 *   const filters = useFilters({
 *     schema: {
 *       status:   { kind: "multi" },
 *       category: { kind: "multi" },
 *       priced:   { kind: "bool" },
 *       date:     { kind: "dateRange" },
 *       price:    { kind: "numRange" },
 *     },
 *   });
 *
 *   <FilterBar filters={filters}>
 *     <FilterBar.Multi
 *       field="status"
 *       label="Status"
 *       options={[
 *         { value: "draft", label: "Draft" },
 *         { value: "published", label: "Published" },
 *       ]}
 *     />
 *     <FilterBar.Multi field="category" label="Category" options={categoryOptions} />
 *     <FilterBar.Bool field="priced" label="Priced only" />
 *     <FilterBar.DateRange field="date" label="Date" />
 *     <FilterBar.NumRange field="price" label="Price" />
 *   </FilterBar>
 */

// NOTE: methods use shorthand syntax (not arrow-typed properties) so the
// parameter positions are bivariant under strictFunctionTypes. That lets
// the generic return shape of `useFilters({ schema })` (where each
// field's value type is keyed on Schema[K]) flow into FilterBar's
// loosened signature without TS rejecting it.
type UseFiltersReturn = {
  state: Record<string, unknown>;
  set(key: string, value: unknown): void;
  toggle(key: string, item: string): void;
  clear(key: string): void;
  reset(): void;
  isActive(key: string): boolean;
  activeCount: number;
};

const FilterBarCtx = React.createContext<UseFiltersReturn | null>(null);

function useFilterBar(): UseFiltersReturn {
  const ctx = React.useContext(FilterBarCtx);
  if (!ctx) throw new Error("FilterBar.* must be used inside <FilterBar>");
  return ctx;
}

interface FilterBarProps {
  filters: UseFiltersReturn;
  children: React.ReactNode;
  className?: string;
  /** Hide the trailing "Clear all" button. Default: false. */
  hideClearAll?: boolean;
}

function FilterBarRoot({ filters, children, className, hideClearAll }: FilterBarProps) {
  return (
    <FilterBarCtx.Provider value={filters}>
      <div className={cn("flex flex-wrap items-center gap-2", className)}>
        <div className="hidden text-xs font-medium text-muted-foreground sm:flex sm:items-center sm:gap-1.5">
          <Filter className="h-3.5 w-3.5" aria-hidden />
          Filter
        </div>
        {children}
        {!hideClearAll && filters.activeCount > 0 ? (
          <>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button
              variant="ghost"
              size="sm"
              onClick={filters.reset}
              className="h-8 px-2 text-xs text-muted-foreground"
            >
              Clear all
              <X className="ml-1 h-3 w-3" aria-hidden />
            </Button>
          </>
        ) : null}
      </div>
    </FilterBarCtx.Provider>
  );
}

/* ─────────── Multi-select ─────────── */

interface MultiOption {
  value: string;
  label: React.ReactNode;
}

function FilterMulti({
  field,
  label,
  options,
  searchable = true,
}: {
  field: string;
  label: React.ReactNode;
  options: MultiOption[];
  searchable?: boolean;
}) {
  const { state, toggle, clear } = useFilterBar();
  const values = (state[field] as string[]) ?? [];
  const selected = new Set(values);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-1.5 h-3 w-3" aria-hidden />
          {label}
          {values.length > 0 ? (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {values.length}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {values.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {values.length} selected
                  </Badge>
                ) : (
                  options
                    .filter((o) => selected.has(o.value))
                    .map((o) => (
                      <Badge key={o.value} variant="secondary" className="rounded-sm px-1 font-normal">
                        {o.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          {searchable ? <CommandInput placeholder={`Search ${typeof label === "string" ? label.toLowerCase() : ""}…`} /> : null}
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selected.has(option.value);
                return (
                  <CommandItem key={option.value} onSelect={() => toggle(field, option.value)}>
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className="h-3 w-3" aria-hidden />
                    </div>
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {values.length > 0 ? (
              <>
                <Separator />
                <CommandGroup>
                  <CommandItem onSelect={() => clear(field)} className="justify-center text-center text-xs text-muted-foreground">
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/* ─────────── Boolean ─────────── */

function FilterBool({ field, label }: { field: string; label: React.ReactNode }) {
  const { state, set } = useFilterBar();
  const value = Boolean(state[field]);

  return (
    <label className="inline-flex h-8 items-center gap-2 rounded-md border border-dashed border-border px-2.5 text-sm">
      <Switch checked={value} onCheckedChange={(v) => set(field, v)} />
      <span className="text-muted-foreground">{label}</span>
    </label>
  );
}

/* ─────────── Date range ─────────── */

function FilterDateRange({ field, label }: { field: string; label: React.ReactNode }) {
  const { state, set, isActive } = useFilterBar();
  const value = (state[field] as { from: string | null; to: string | null }) ?? { from: null, to: null };
  const from = value.from ? new Date(value.from) : undefined;
  const to = value.to ? new Date(value.to) : undefined;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-1.5 h-3 w-3" aria-hidden />
          {label}
          {isActive(field) ? (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              <span className="text-xs">
                {from ? format(from, "MMM d") : "…"} – {to ? format(to, "MMM d") : "…"}
              </span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from, to }}
          onSelect={(range) =>
            set(field, {
              from: range?.from ? range.from.toISOString().slice(0, 10) : null,
              to: range?.to ? range.to.toISOString().slice(0, 10) : null,
            })
          }
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

/* ─────────── Numeric range ─────────── */

function FilterNumRange({
  field,
  label,
  placeholderMin = "Min",
  placeholderMax = "Max",
}: {
  field: string;
  label: React.ReactNode;
  placeholderMin?: string;
  placeholderMax?: string;
}) {
  const { state, set, isActive, clear } = useFilterBar();
  const value = (state[field] as { min: number | null; max: number | null }) ?? { min: null, max: null };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-1.5 h-3 w-3" aria-hidden />
          {label}
          {isActive(field) ? (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              <span className="text-xs">
                {value.min ?? "…"} – {value.max ?? "…"}
              </span>
            </>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3" align="start">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{placeholderMin}</label>
          <Input
            type="number"
            inputMode="decimal"
            value={value.min ?? ""}
            onChange={(e) => set(field, { min: e.target.value === "" ? null : Number(e.target.value), max: value.max })}
            placeholder={placeholderMin}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">{placeholderMax}</label>
          <Input
            type="number"
            inputMode="decimal"
            value={value.max ?? ""}
            onChange={(e) => set(field, { min: value.min, max: e.target.value === "" ? null : Number(e.target.value) })}
            placeholder={placeholderMax}
          />
        </div>
        {isActive(field) ? (
          <Button variant="ghost" size="sm" className="w-full" onClick={() => clear(field)}>
            Clear
          </Button>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}

/* ─────────── Single-select ─────────── */

function FilterSingle({
  field,
  label,
  options,
}: {
  field: string;
  label: React.ReactNode;
  options: MultiOption[];
}) {
  const { state, set, clear } = useFilterBar();
  const value = (state[field] as string | null) ?? null;
  const active = options.find((o) => o.value === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-1.5 h-3 w-3" aria-hidden />
          {label}
          {active ? (
            <>
              <Separator orientation="vertical" className="mx-1.5 h-3.5" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                {active.label}
              </Badge>
            </>
          ) : null}
          <ChevronDown className="ml-1 h-3 w-3 opacity-50" aria-hidden />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => set(field, option.value === value ? null : option.value)}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      option.value === value ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <Check className="h-3 w-3" aria-hidden />
                  </div>
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {value !== null ? (
              <>
                <Separator />
                <CommandGroup>
                  <CommandItem onSelect={() => clear(field)} className="justify-center text-xs text-muted-foreground">
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const FilterBar = Object.assign(FilterBarRoot, {
  Multi: FilterMulti,
  Bool: FilterBool,
  DateRange: FilterDateRange,
  NumRange: FilterNumRange,
  Single: FilterSingle,
});
