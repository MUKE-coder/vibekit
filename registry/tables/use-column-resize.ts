"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Persist column widths + visibility + order per table. Hook returns
 * the current state plus setters that immediately write to localStorage.
 * Apply the widths directly to your `<th>` / `<td>` `style={{ width }}`.
 *
 *   const { widths, setWidth, resetWidths, visibility, toggleColumn, order, reorder, reset } =
 *     useColumnPreferences("invoices-table", {
 *       columns: ["id", "customer", "amount", "status", "createdAt"],
 *       defaultWidths: { customer: 240, amount: 120 },
 *     });
 *
 *   <th style={{ width: widths.customer }}>Customer</th>
 *
 * The hook is one piece — column layout state is rarely useful split.
 * Width-only drag handlers ship as a helper (`columnResizeHandlers`)
 * so tables built on raw `<table>` markup can wire a drag column.
 */

interface ColumnPreferences {
  widths: Record<string, number>;
  visibility: Record<string, boolean>;
  order: string[];
}

interface UseColumnPreferencesOptions {
  /** Canonical column list (id strings). Drives the default order. */
  columns: string[];
  /** Per-column default width in px. Default: 160. */
  defaultWidths?: Record<string, number>;
  /** Per-column visibility default. Default: all visible. */
  defaultVisibility?: Record<string, boolean>;
}

const DEFAULT_WIDTH = 160;

export function useColumnPreferences(storageKey: string, options: UseColumnPreferencesOptions) {
  const { columns, defaultWidths = {}, defaultVisibility = {} } = options;

  const initial = (): ColumnPreferences => ({
    widths: Object.fromEntries(columns.map((c) => [c, defaultWidths[c] ?? DEFAULT_WIDTH])),
    visibility: Object.fromEntries(columns.map((c) => [c, defaultVisibility[c] ?? true])),
    order: [...columns],
  });

  const [prefs, setPrefs] = useState<ColumnPreferences>(initial);

  // Hydrate from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return;
      const stored = JSON.parse(raw) as Partial<ColumnPreferences>;
      setPrefs((current) => ({
        widths: { ...current.widths, ...(stored.widths ?? {}) },
        visibility: { ...current.visibility, ...(stored.visibility ?? {}) },
        // Preserve only columns that still exist
        order: stored.order
          ? [...stored.order.filter((c) => columns.includes(c)), ...columns.filter((c) => !stored.order!.includes(c))]
          : current.order,
      }));
    } catch {
      /* ignore corrupt values */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const persist = useCallback(
    (next: ColumnPreferences) => {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        /* quota / private mode */
      }
    },
    [storageKey],
  );

  const setWidth = useCallback((column: string, width: number) => {
    setPrefs((p) => {
      const next = { ...p, widths: { ...p.widths, [column]: Math.max(40, Math.round(width)) } };
      persist(next);
      return next;
    });
  }, [persist]);

  const resetWidths = useCallback(() => {
    setPrefs((p) => {
      const next: ColumnPreferences = {
        ...p,
        widths: Object.fromEntries(columns.map((c) => [c, defaultWidths[c] ?? DEFAULT_WIDTH])),
      };
      persist(next);
      return next;
    });
  }, [columns, defaultWidths, persist]);

  const toggleColumn = useCallback((column: string, visible?: boolean) => {
    setPrefs((p) => {
      const current = p.visibility[column] ?? true;
      const next = { ...p, visibility: { ...p.visibility, [column]: visible ?? !current } };
      persist(next);
      return next;
    });
  }, [persist]);

  const reorder = useCallback((fromIndex: number, toIndex: number) => {
    setPrefs((p) => {
      const order = [...p.order];
      const [moved] = order.splice(fromIndex, 1);
      order.splice(toIndex, 0, moved);
      const next = { ...p, order };
      persist(next);
      return next;
    });
  }, [persist]);

  const reset = useCallback(() => {
    const fresh = initial();
    persist(fresh);
    setPrefs(fresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    widths: prefs.widths,
    visibility: prefs.visibility,
    order: prefs.order,
    setWidth,
    resetWidths,
    toggleColumn,
    reorder,
    reset,
  };
}

/**
 * Mouse + keyboard handlers for a column-resize grip. Drop on a tiny
 * absolutely-positioned `<div>` on the right edge of each `<th>`.
 *
 *   const handlers = columnResizeHandlers({
 *     getCurrentWidth: () => widths.customer,
 *     onChange: (w) => setWidth("customer", w),
 *   });
 *
 *   <div className="absolute inset-y-0 right-0 w-1 cursor-col-resize" {...handlers} />
 */
export function columnResizeHandlers(options: {
  getCurrentWidth: () => number;
  onChange: (next: number) => void;
  /** Min width in px. Default: 60. */
  minWidth?: number;
  /** Max width in px. Default: 800. */
  maxWidth?: number;
}) {
  const { getCurrentWidth, onChange, minWidth = 60, maxWidth = 800 } = options;

  return {
    onMouseDown(event: React.MouseEvent) {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = getCurrentWidth();

      function onMove(e: MouseEvent) {
        const next = Math.min(maxWidth, Math.max(minWidth, startWidth + (e.clientX - startX)));
        onChange(next);
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.body.style.cursor = "";
      }
      document.body.style.cursor = "col-resize";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    onKeyDown(event: React.KeyboardEvent) {
      const step = event.shiftKey ? 16 : 4;
      const current = getCurrentWidth();
      if (event.key === "ArrowRight") {
        event.preventDefault();
        onChange(Math.min(maxWidth, current + step));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        onChange(Math.max(minWidth, current - step));
      }
    },
    role: "separator" as const,
    "aria-orientation": "vertical" as const,
    tabIndex: 0,
  };
}
