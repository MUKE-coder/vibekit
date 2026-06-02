"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Quick filters / segments — preset chips above a table that snap the
 * URL to a curated filter combo. Different from `FilterBar` (which
 * exposes every facet) and `SavedViews` (user-defined) — these are
 * the *predefined* views that come with the page.
 *
 *   <QuickFilters
 *     segments={[
 *       { label: "All", query: "" },
 *       { label: "Open", query: "?status=open" },
 *       { label: "High priority", query: "?status=open&priority=high" },
 *       { label: "Stale > 7d", query: "?status=open&stale=7" },
 *     ]}
 *     counts={{ "?status=open": 24, "?status=open&priority=high": 6 }}
 *   />
 *
 * Pair with server-side faceted counts (the optional `counts` prop) to
 * render a numeric badge per segment.
 */

export interface QuickFilterSegment {
  label: React.ReactNode;
  /** Query string (with leading `?`) or empty string for "All". */
  query: string;
  /** Optional icon slot. */
  icon?: React.ReactNode;
}

interface QuickFiltersProps {
  segments: QuickFilterSegment[];
  /** Server-supplied counts keyed by `segment.query`. */
  counts?: Record<string, number | undefined>;
  className?: string;
}

export function QuickFilters({ segments, counts, className }: QuickFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const currentQuery = params.toString() ? `?${params.toString()}` : "";

  return (
    <div role="tablist" className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {segments.map((segment) => {
        const active = segment.query === currentQuery;
        const count = counts?.[segment.query];

        return (
          <button
            key={segment.query || "__all__"}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => router.push(`${pathname}${segment.query}`, { scroll: false })}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition",
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            {segment.icon ? <span className="shrink-0">{segment.icon}</span> : null}
            <span>{segment.label}</span>
            {typeof count === "number" ? (
              <Badge
                variant="secondary"
                className={cn(
                  "h-4 min-w-[1.25rem] rounded-full px-1 text-[10px] font-normal",
                  active && "bg-background/20 text-background",
                )}
              >
                {count}
              </Badge>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
