"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BulkActionsBarProps {
  /** Number of selected rows. The bar auto-hides when this is 0. */
  selectedCount: number;
  /** Called when the user clicks the clear (X) button or hits Escape. */
  onClear: () => void;
  /** Action buttons / dropdowns. Render `<Button>` elements directly. */
  actions: React.ReactNode;
  /** Singular noun for the selected items. Default: "item". */
  itemLabel?: string;
  /** Plural noun. Default: itemLabel + "s". */
  itemLabelPlural?: string;
  className?: string;
}

/**
 * Floating action bar that appears at the bottom of the viewport when one
 * or more table rows are selected. Auto-hides at zero selection. Escape
 * key clears selection.
 *
 *   <BulkActionsBar
 *     selectedCount={selected.size}
 *     onClear={() => setSelected(new Set())}
 *     itemLabel="invoice"
 *     actions={
 *       <>
 *         <Button size="sm" onClick={() => bulkArchive(selected)}>Archive</Button>
 *         <Button size="sm" variant="destructive" onClick={...}>Delete</Button>
 *       </>
 *     }
 *   />
 */
export function BulkActionsBar({
  selectedCount,
  onClear,
  actions,
  itemLabel = "item",
  itemLabelPlural,
  className,
}: BulkActionsBarProps) {
  // Escape-to-clear
  React.useEffect(() => {
    if (selectedCount === 0) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClear();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedCount, onClear]);

  if (selectedCount === 0) return null;

  const noun = selectedCount === 1 ? itemLabel : (itemLabelPlural ?? `${itemLabel}s`);

  return (
    <div
      role="region"
      aria-label="Bulk actions"
      className={cn(
        "pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2",
        className,
      )}
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-background px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2 pl-2">
          <span className="grid h-6 min-w-6 place-items-center rounded-full bg-foreground px-1.5 text-xs font-semibold tabular-nums text-background">
            {selectedCount}
          </span>
          <span className="text-sm text-foreground">
            {noun} selected
          </span>
        </div>
        <div className="mx-1 h-5 w-px bg-border" aria-hidden />
        <div className="flex items-center gap-1">{actions}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="h-7 w-7 rounded-full"
          aria-label="Clear selection"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
