"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Responsive grid of KPI cards with built-in comparison-vs-previous-
 * period rendering. A more opinionated cousin of `StatCard` — give it an
 * array and it lays out the whole row at once with consistent spacing,
 * trend arrows, and loading skeletons.
 *
 *   <MetricGrid
 *     metrics={[
 *       { label: "Revenue",      value: "$24,560",  previousValue: "$21,400",  change: 0.148 },
 *       { label: "Active users", value: 1284,        previousValue: 1107,       change: 0.16,   sparkline: <Sparkline data={...} /> },
 *       { label: "Avg deal",     value: "$1,240",    change: -0.04,             hint: "Last 30 days" },
 *       { label: "Conversion",   value: "3.2%",      change: 0 },
 *     ]}
 *   />
 *
 *   <MetricGrid metrics={[]} loading count={4} />
 */

export interface Metric {
  label: string;
  value: React.ReactNode;
  /** Optional previous-period value shown muted under the trend. */
  previousValue?: React.ReactNode;
  /**
   * Period-over-period change as a decimal (0.125 = +12.5%). Drives the
   * arrow + colour. Pass null/undefined to hide the trend strip.
   */
  change?: number | null;
  /** Optional small line under the trend ("vs last month", "Last 30 days"). */
  hint?: React.ReactNode;
  /** Optional sparkline / chart slot. */
  sparkline?: React.ReactNode;
  /** Optional icon top-right. */
  icon?: React.ReactNode;
}

interface MetricGridProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: Metric[];
  /** Skeleton state. Use with `count` to size the placeholder grid. */
  loading?: boolean;
  /** Number of placeholder cards while `loading`. Default: 4. */
  count?: number;
  /** Tailwind grid-template-columns config. Default: 1 → 2 → 4 responsive. */
  cols?: string;
}

const TREND_COLOR = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-destructive",
  neutral: "text-muted-foreground",
} as const;

const TREND_ICON = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: Minus,
} as const;

function directionOf(change: number | null | undefined): "up" | "down" | "neutral" {
  if (change === null || change === undefined || change === 0) return "neutral";
  return change > 0 ? "up" : "down";
}

function formatPercent(change: number): string {
  const sign = change > 0 ? "+" : "";
  return `${sign}${(change * 100).toFixed(1)}%`;
}

export function MetricGrid({
  metrics,
  loading = false,
  count = 4,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  className,
  ...props
}: MetricGridProps) {
  if (loading) {
    return (
      <div {...props} className={cn("grid gap-4", cols, className)}>
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div {...props} className={cn("grid gap-4", cols, className)}>
      {metrics.map((m, i) => {
        const dir = directionOf(m.change);
        const TrendIcon = TREND_ICON[dir];
        const hasTrend = m.change !== null && m.change !== undefined;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
              {m.icon ? <div className="text-muted-foreground">{m.icon}</div> : null}
            </CardHeader>
            <CardContent className="space-y-1.5">
              <div className="text-2xl font-bold tabular-nums tracking-tight">{m.value}</div>
              {(hasTrend || m.hint) && (
                <div className="flex items-center gap-2 text-xs">
                  {hasTrend ? (
                    <span className={cn("inline-flex items-center gap-0.5 font-medium", TREND_COLOR[dir])}>
                      <TrendIcon className="h-3 w-3" aria-hidden />
                      {formatPercent(m.change as number)}
                    </span>
                  ) : null}
                  {m.previousValue !== undefined ? (
                    <span className="text-muted-foreground">
                      from <span className="tabular-nums">{m.previousValue}</span>
                    </span>
                  ) : null}
                  {m.hint ? <span className="text-muted-foreground">{m.hint}</span> : null}
                </div>
              )}
              {m.sparkline ? <div className="mt-3 h-12 w-full text-foreground">{m.sparkline}</div> : null}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
