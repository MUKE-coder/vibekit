"use client";

import * as React from "react";
import { Download, Filter, Search, Settings2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolbarFacetOption {
  value: string;
  label: string;
  /** Optional count shown next to the option. */
  count?: number;
}

interface ToolbarFacet {
  /** Internal key (used as a URL param). */
  key: string;
  /** Display label (button text). */
  label: string;
  /** Available filter values. */
  options: ToolbarFacetOption[];
  /** Currently selected values. */
  selected: string[];
  /** Called when the selection changes. */
  onChange: (values: string[]) => void;
}

interface ColumnToggle {
  key: string;
  label: string;
  visible: boolean;
  onToggle: (visible: boolean) => void;
}

interface DataTableToolbarProps {
  /** Search input value (controlled). */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  /** Faceted filter buttons — each opens a multi-select dropdown. */
  facets?: ToolbarFacet[];

  /** Column-visibility toggles. */
  columns?: ColumnToggle[];

  /** Called when the export button is clicked. Omit to hide the button. */
  onExport?: () => void;

  /** Called when the user clicks "Reset" — visible when any filter is active. */
  onReset?: () => void;

  /** Additional action buttons (e.g. "New invoice"). Rendered on the right. */
  actions?: React.ReactNode;

  className?: string;
}

/**
 * Standard toolbar shown above every <DataTable>: search input, faceted
 * filters, column-visibility toggle, export button, reset, and a slot for
 * primary actions (e.g. "New invoice" CTA).
 */
export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search…",
  facets = [],
  columns = [],
  onExport,
  onReset,
  actions,
  className,
}: DataTableToolbarProps) {
  const hasActiveFilters = facets.some((f) => f.selected.length > 0) || !!search;

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {onSearchChange ? (
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={search ?? ""}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="pl-9"
            />
          </div>
        ) : null}

        {facets.map((facet) => (
          <FacetFilter key={facet.key} facet={facet} />
        ))}

        {hasActiveFilters && onReset ? (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-9">
            <X className="mr-1.5 h-3.5 w-3.5" /> Reset
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        {columns.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Settings2 className="mr-2 h-3.5 w-3.5" /> View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={col.visible}
                  onCheckedChange={col.onToggle}
                  className="capitalize"
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        {onExport ? (
          <Button variant="outline" size="sm" onClick={onExport} className="h-9">
            <Download className="mr-2 h-3.5 w-3.5" /> Export
          </Button>
        ) : null}

        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

function FacetFilter({ facet }: { facet: ToolbarFacet }) {
  const toggle = (value: string) => {
    facet.onChange(
      facet.selected.includes(value)
        ? facet.selected.filter((v) => v !== value)
        : [...facet.selected, value],
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="mr-2 h-3.5 w-3.5" />
          {facet.label}
          {facet.selected.length > 0 ? (
            <>
              <span className="mx-2 h-4 w-px bg-border" aria-hidden />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {facet.selected.length}
              </Badge>
              <div className="hidden gap-1 lg:flex">
                {facet.selected.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {facet.selected.length} selected
                  </Badge>
                ) : (
                  facet.options
                    .filter((opt) => facet.selected.includes(opt.value))
                    .map((opt) => (
                      <Badge key={opt.value} variant="secondary" className="rounded-sm px-1 font-normal">
                        {opt.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{facet.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {facet.options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={facet.selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          >
            <span className="flex-1 truncate">{opt.label}</span>
            {opt.count !== undefined ? (
              <span className="ml-2 text-xs tabular-nums text-muted-foreground">{opt.count}</span>
            ) : null}
          </DropdownMenuCheckboxItem>
        ))}
        {facet.selected.length > 0 ? (
          <>
            <DropdownMenuSeparator />
            <button
              type="button"
              onClick={() => facet.onChange([])}
              className="w-full px-2 py-1.5 text-center text-sm text-muted-foreground hover:bg-accent"
            >
              Clear
            </button>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
