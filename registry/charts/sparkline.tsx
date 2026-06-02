"use client";

import * as React from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

interface SparklineProps {
  /** Series data — array of numbers OR objects with a `value` field. */
  data: number[] | Array<{ value: number; label?: string }>;
  /** Visual style. Default: "area". */
  variant?: "line" | "area";
  /** Stroke colour. Defaults to the foreground token. */
  stroke?: string;
  /** Fill colour for `variant="area"`. Defaults to currentColor at 12% opacity. */
  fill?: string;
  /** Show tooltips on hover. Default: false (sparklines are usually decorative). */
  withTooltip?: boolean;
  /** Tailwind size classes. Default: "h-10 w-24". */
  className?: string;
}

/**
 * Tiny inline trend chart for stat cards, table cells, and dashboard
 * widgets. Renders responsively into its parent — give it a `h-` and
 * `w-` class on the container.
 *
 *   <Sparkline data={[12, 17, 14, 21, 28, 26, 33]} variant="area" />
 *   <Sparkline data={revenueHistory.map(r => ({ value: r.amount }))} className="h-8 w-20" />
 */
export function Sparkline({
  data,
  variant = "area",
  stroke = "currentColor",
  fill,
  withTooltip = false,
  className,
}: SparklineProps) {
  const series = React.useMemo(
    () =>
      data.map((d, i) =>
        typeof d === "number"
          ? { value: d, idx: i }
          : { value: d.value, idx: i, label: d.label },
      ),
    [data],
  );

  const Chart = variant === "area" ? AreaChart : LineChart;

  return (
    <div className={cn("h-10 w-24", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <Chart data={series} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          {withTooltip ? (
            <Tooltip
              cursor={false}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "var(--popover, white)",
                border: "1px solid var(--border, #e5e7eb)",
                borderRadius: 6,
                fontSize: 11,
                padding: "4px 8px",
              }}
              labelFormatter={() => ""}
            />
          ) : null}
          {variant === "area" ? (
            <Area
              type="monotone"
              dataKey="value"
              stroke={stroke}
              fill={fill ?? "currentColor"}
              fillOpacity={fill ? 1 : 0.12}
              strokeWidth={1.5}
              isAnimationActive={false}
              dot={false}
            />
          ) : (
            <Line
              type="monotone"
              dataKey="value"
              stroke={stroke}
              strokeWidth={1.5}
              isAnimationActive={false}
              dot={false}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  );
}
