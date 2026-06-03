"use client";

import * as React from "react";
import { addDays, eachDayOfInterval, format, getDay, startOfDay, subDays, subMonths } from "date-fns";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * GitHub-style contribution / activity heatmap. Renders a fixed-width
 * grid of 7-day weeks ending today by default. Each day cell is colour-
 * graded by its `count` against the provided thresholds.
 *
 *   <HeatmapCalendar
 *     data={activity.map(a => ({ date: a.date, count: a.count }))}
 *     monthsBack={6}
 *     thresholds={[1, 5, 10, 20]}  // empty / level 1..4
 *   />
 *
 * Use for: user activity, deploys, commits, jobs run, audit-log events,
 * any "did this happen on this day" signal. Each cell gets a tooltip
 * with the exact date and value.
 */

export interface HeatmapDatum {
  /** ISO date string OR Date object. Time is normalised to start-of-day. */
  date: string | Date;
  count: number;
}

interface HeatmapCalendarProps {
  data: HeatmapDatum[];
  /** How many months of history to render. Default: 6. */
  monthsBack?: number;
  /**
   * Count thresholds for the 4 non-empty levels. Length must be 4.
   * Default: [1, 3, 6, 10] (tuned for a daily activity-feed scale).
   */
  thresholds?: [number, number, number, number];
  /** Last day to include. Default: today. */
  endDate?: Date;
  /** Cell size in px. Default: 12. */
  cellSize?: number;
  /** Cell gap in px. Default: 2. */
  cellGap?: number;
  /** Format helper for the tooltip date. Default: "PPP". */
  dateFormat?: string;
  /** Label for the tooltip count (e.g. "events", "commits"). Default: "events". */
  unit?: string;
  /** Optional click handler — fires with the date + count. */
  onSelectDay?: (datum: { date: Date; count: number }) => void;
  className?: string;
}

const DEFAULT_THRESHOLDS: [number, number, number, number] = [1, 3, 6, 10];

const LEVEL_CLASS = [
  "bg-muted",                    // 0
  "bg-emerald-200 dark:bg-emerald-900/60",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-500",
  "bg-emerald-600 dark:bg-emerald-400",
] as const;

function levelFor(count: number, thresholds: [number, number, number, number]): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count < thresholds[0]) return 1;
  if (count < thresholds[1]) return 2;
  if (count < thresholds[2]) return 3;
  return 4;
}

export function HeatmapCalendar({
  data,
  monthsBack = 6,
  thresholds = DEFAULT_THRESHOLDS,
  endDate,
  cellSize = 12,
  cellGap = 2,
  dateFormat = "PPP",
  unit = "events",
  onSelectDay,
  className,
}: HeatmapCalendarProps) {
  // Normalise input → Map<"yyyy-MM-dd", count>
  const counts = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const d of data) {
      const day = startOfDay(typeof d.date === "string" ? new Date(d.date) : d.date);
      const key = format(day, "yyyy-MM-dd");
      m.set(key, (m.get(key) ?? 0) + d.count);
    }
    return m;
  }, [data]);

  // Build a week-aligned grid ending at endDate
  const grid = React.useMemo(() => {
    const end = endDate ? startOfDay(endDate) : startOfDay(new Date());
    const start = subMonths(end, monthsBack);
    // Pad to Sunday-start week
    const paddedStart = subDays(start, getDay(start));
    const days = eachDayOfInterval({ start: paddedStart, end });

    // Group into columns of 7 (a column = a week)
    const weeks: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  }, [endDate, monthsBack]);

  // Month labels (top axis)
  const monthLabels = React.useMemo(() => {
    const labels: Array<{ index: number; label: string }> = [];
    let lastMonth = -1;
    grid.forEach((week, i) => {
      const firstOfWeek = week[0];
      if (!firstOfWeek) return;
      const m = firstOfWeek.getMonth();
      if (m !== lastMonth) {
        labels.push({ index: i, label: format(firstOfWeek, "MMM") });
        lastMonth = m;
      }
    });
    return labels;
  }, [grid]);

  const totalWidth = grid.length * (cellSize + cellGap);

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        {/* Month labels */}
        <div className="relative h-3" style={{ width: totalWidth }}>
          {monthLabels.map(({ index, label }) => (
            <span
              key={`${index}-${label}`}
              className="absolute text-[10px] uppercase tracking-wider text-muted-foreground"
              style={{ left: index * (cellSize + cellGap) }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="flex" style={{ gap: cellGap }}>
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: cellGap }}>
              {Array.from({ length: 7 }).map((_, di) => {
                const day = week[di];
                if (!day) {
                  return (
                    <div
                      key={`empty-${wi}-${di}`}
                      style={{ width: cellSize, height: cellSize }}
                      aria-hidden
                    />
                  );
                }
                const key = format(day, "yyyy-MM-dd");
                const count = counts.get(key) ?? 0;
                const level = levelFor(count, thresholds);
                const button = (
                  <button
                    type="button"
                    disabled={!onSelectDay && count === 0}
                    onClick={() => onSelectDay?.({ date: day, count })}
                    aria-label={`${format(day, dateFormat)}: ${count} ${unit}`}
                    className={cn(
                      "rounded-sm transition-transform hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-foreground",
                      LEVEL_CLASS[level],
                    )}
                    style={{ width: cellSize, height: cellSize }}
                  />
                );
                return (
                  <Tooltip key={key}>
                    <TooltipTrigger asChild>{button}</TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <div className="font-medium">{format(day, dateFormat)}</div>
                      <div className="text-muted-foreground">
                        {count} {unit}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          {LEVEL_CLASS.map((cls, i) => (
            <span
              key={i}
              className={cn("rounded-sm", cls)}
              style={{ width: cellSize, height: cellSize }}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </TooltipProvider>
  );
}
