"use client";

import * as React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { cn } from "@/lib/utils";

/**
 * Virtualised table — renders only the rows currently in the viewport
 * so 50K-row datasets stay smooth. Built on @tanstack/react-virtual.
 *
 *   <DataGrid
 *     data={rows}
 *     columns={[
 *       { key: "name",   header: "Name",     width: 200 },
 *       { key: "email",  header: "Email",    width: 240 },
 *       { key: "status", header: "Status",   width: 100, cell: (r) => <StatusBadge value={r.status} /> },
 *       { key: "total",  header: "Total",    width: 120, align: "right", cell: (r) => fmt.currency(r.total) },
 *     ]}
 *     getRowId={(r) => r.id}
 *     onRowClick={(r) => router.push(`/customers/${r.id}`)}
 *     stickyHeader
 *     rowHeight={36}
 *     overscan={8}
 *   />
 *
 * For server-paginated datasets, combine with `useInfiniteScroll` —
 * pass the concatenated rows in `data` and trigger the next-page fetch
 * via `onEndReached`.
 */

export interface DataGridColumn<Row> {
  key: keyof Row & string;
  header: React.ReactNode;
  width?: number;
  align?: "left" | "right" | "center";
  cell?: (row: Row) => React.ReactNode;
  /** Hide the column (driven by `useColumnPreferences`). */
  hidden?: boolean;
}

interface DataGridProps<Row> {
  data: Row[];
  columns: DataGridColumn<Row>[];
  getRowId: (row: Row) => string;
  rowHeight?: number;
  overscan?: number;
  stickyHeader?: boolean;
  onRowClick?: (row: Row) => void;
  /** Called when the user nears the end of the list — wire to load-more. */
  onEndReached?: () => void;
  /** Distance from the bottom in pixels at which `onEndReached` fires. Default: 200. */
  endThresholdPx?: number;
  className?: string;
  /** Height of the scroll container. Default: 480. */
  height?: number | string;
  emptyState?: React.ReactNode;
}

export function DataGrid<Row>({
  data,
  columns,
  getRowId,
  rowHeight = 36,
  overscan = 8,
  stickyHeader = true,
  onRowClick,
  onEndReached,
  endThresholdPx = 200,
  className,
  height = 480,
  emptyState,
}: DataGridProps<Row>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const visibleColumns = columns.filter((c) => !c.hidden);

  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  const items = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  React.useEffect(() => {
    if (!onEndReached || data.length === 0) return;
    const el = parentRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop + el.clientHeight + endThresholdPx >= el.scrollHeight) {
        onEndReached();
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onEndReached, endThresholdPx, data.length]);

  if (data.length === 0) {
    return (
      <div className={cn("rounded-md border border-border bg-card p-10 text-center text-sm text-muted-foreground", className)}>
        {emptyState ?? "No rows."}
      </div>
    );
  }

  return (
    <div className={cn("relative w-full overflow-hidden rounded-md border border-border bg-card", className)}>
      <div
        ref={parentRef}
        className="w-full overflow-auto"
        style={{ height, contain: "strict" }}
      >
        <div style={{ minWidth: visibleColumns.reduce((a, c) => a + (c.width ?? 160), 0) }}>
          <div
            role="row"
            className={cn(
              "flex border-b border-border bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground",
              stickyHeader && "sticky top-0 z-10",
            )}
            style={{ height: rowHeight }}
          >
            {visibleColumns.map((col) => (
              <div
                key={col.key}
                role="columnheader"
                className={cn(
                  "flex items-center px-3",
                  col.align === "right" && "justify-end",
                  col.align === "center" && "justify-center",
                )}
                style={{ width: col.width ?? 160, flexShrink: 0 }}
              >
                {col.header}
              </div>
            ))}
          </div>

          <div role="rowgroup" style={{ height: totalSize, position: "relative" }}>
            {items.map((item) => {
              const row = data[item.index];
              return (
                <div
                  key={getRowId(row)}
                  role="row"
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "absolute left-0 right-0 flex border-b border-border/60 text-sm",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                  )}
                  style={{ height: rowHeight, transform: `translateY(${item.start}px)` }}
                >
                  {visibleColumns.map((col) => (
                    <div
                      key={col.key}
                      role="cell"
                      className={cn(
                        "flex items-center truncate px-3",
                        col.align === "right" && "justify-end",
                        col.align === "center" && "justify-center",
                      )}
                      style={{ width: col.width ?? 160, flexShrink: 0 }}
                    >
                      {col.cell ? col.cell(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
