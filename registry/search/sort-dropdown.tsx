"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface SortOption {
  /** URL-safe identifier (also the value persisted to the `sort` query param). */
  value: string;
  /** Display label. */
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  /** Current sort field. */
  value: string | null;
  /** Current sort direction. */
  direction: "asc" | "desc";
  /** Called when the field changes. */
  onChange: (value: string, direction: "asc" | "desc") => void;
  /** Label shown in the trigger when no sort is active. Default: "Sort". */
  placeholder?: string;
  className?: string;
}

/**
 * Reusable sort selector that pairs cleanly with `useTableState`. Two
 * dropdowns in one — pick a field + flip the direction. Renders the
 * active field label + a directional arrow in the trigger.
 *
 *   <SortDropdown
 *     options={[
 *       { value: "createdAt", label: "Created date" },
 *       { value: "amount",    label: "Amount" },
 *     ]}
 *     value={state.sort}
 *     direction={state.dir}
 *     onChange={(v, d) => setSort(v, d)}
 *   />
 */
export function SortDropdown({
  options,
  value,
  direction,
  onChange,
  placeholder = "Sort",
  className,
}: SortDropdownProps) {
  const active = options.find((o) => o.value === value);
  const DirectionIcon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-9", className)}>
          <DirectionIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          <span className="font-normal text-muted-foreground">
            {active ? `Sort: ${active.label}` : placeholder}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={value ?? ""}
          onValueChange={(v) => onChange(v, direction)}
        >
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Direction</DropdownMenuLabel>
        <DropdownMenuRadioGroup
          value={direction}
          onValueChange={(v) => onChange(value ?? options[0]?.value ?? "", v as "asc" | "desc")}
        >
          <DropdownMenuRadioItem value="asc">
            <ArrowUp className="mr-2 h-3.5 w-3.5" /> Ascending
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="desc">
            <ArrowDown className="mr-2 h-3.5 w-3.5" /> Descending
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
