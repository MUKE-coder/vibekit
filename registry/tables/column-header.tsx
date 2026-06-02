"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ColumnHeaderProps {
  /** Display label. */
  label: React.ReactNode;
  /** Current sort direction for this column (null = unsorted). */
  sort?: "asc" | "desc" | null;
  /** Called with the next direction when the user clicks/selects sort. */
  onSort?: (direction: "asc" | "desc") => void;
  /** Called when the user picks "Hide" from the dropdown. */
  onHide?: () => void;
  className?: string;
}

/**
 * Sortable table column header with a direction indicator and a small
 * dropdown for Hide (extend with Pin / Resize per project). Pairs with
 * `useTableState` for URL-driven sort.
 *
 *   <ColumnHeader
 *     label="Created"
 *     sort={state.sort === "createdAt" ? state.dir : null}
 *     onSort={(dir) => setSort("createdAt", dir)}
 *     onHide={() => hideColumn("createdAt")}
 *   />
 */
export function ColumnHeader({ label, sort = null, onSort, onHide, className }: ColumnHeaderProps) {
  const Icon = sort === "asc" ? ArrowUp : sort === "desc" ? ArrowDown : ArrowUpDown;
  const nextDir: "asc" | "desc" = sort === "asc" ? "desc" : "asc";

  if (!onSort && !onHide) {
    return (
      <div className={cn("font-medium text-foreground", className)}>{label}</div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("-ml-3 h-8 data-[state=open]:bg-accent", className)}
        >
          <span>{label}</span>
          <Icon className={cn("ml-2 h-3.5 w-3.5", sort ? "text-foreground" : "text-muted-foreground")} aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {onSort ? (
          <>
            <DropdownMenuItem onClick={() => onSort(nextDir === "asc" ? "asc" : "desc")}>
              <ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              Ascending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort("desc")}>
              <ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              Descending
            </DropdownMenuItem>
          </>
        ) : null}
        {onSort && onHide ? <DropdownMenuSeparator /> : null}
        {onHide ? (
          <DropdownMenuItem onClick={onHide}>
            <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            Hide
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
