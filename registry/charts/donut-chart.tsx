"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

/**
 * Donut / pie chart with built-in centre label, optional legend, and
 * tasteful default palette derived from the theme tokens. For a flat
 * pie chart pass `innerRadius={0}`.
 *
 *   <DonutChart
 *     data={[
 *       { name: "Subscriptions", value: 12400 },
 *       { name: "One-time",      value:  4800 },
 *       { name: "Add-ons",       value:  1240 },
 *     ]}
 *     centerLabel={{ value: "$18,440", label: "Total revenue" }}
 *   />
 */

export interface DonutDatum {
  name: string;
  value: number;
  /** Optional colour override for this slice. */
  color?: string;
}

interface DonutChartProps {
  data: DonutDatum[];
  /** Slot for a big centre value + label. */
  centerLabel?: { value: React.ReactNode; label?: React.ReactNode };
  /** Inner radius (% or px). Default: "60%". Pass 0 for a flat pie. */
  innerRadius?: number | string;
  /** Outer radius (% or px). Default: "80%". */
  outerRadius?: number | string;
  /** Show the legend chips. Default: true. */
  withLegend?: boolean;
  /** Show tooltips. Default: true. */
  withTooltip?: boolean;
  /** Fallback palette when items don't specify their own colour. */
  palette?: string[];
  className?: string;
}

const DEFAULT_PALETTE = [
  "var(--chart-1, hsl(220 70% 50%))",
  "var(--chart-2, hsl(160 60% 45%))",
  "var(--chart-3, hsl(30 80% 55%))",
  "var(--chart-4, hsl(280 65% 60%))",
  "var(--chart-5, hsl(340 75% 55%))",
];

export function DonutChart({
  data,
  centerLabel,
  innerRadius = "60%",
  outerRadius = "80%",
  withLegend = true,
  withTooltip = true,
  palette = DEFAULT_PALETTE,
  className,
}: DonutChartProps) {
  const total = React.useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="aspect-square w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={1}
              stroke="var(--background, white)"
              strokeWidth={2}
              isAnimationActive={false}
            >
              {data.map((d, i) => (
                <Cell key={d.name} fill={d.color ?? palette[i % palette.length]} />
              ))}
            </Pie>
            {withTooltip ? (
              <Tooltip
                cursor={false}
                wrapperStyle={{ outline: "none" }}
                contentStyle={{
                  background: "var(--popover, white)",
                  border: "1px solid var(--border, #e5e7eb)",
                  borderRadius: 6,
                  fontSize: 12,
                  padding: "6px 8px",
                }}
                formatter={(value: number, name: string) => {
                  const pct = total > 0 ? `${((value / total) * 100).toFixed(1)}%` : "";
                  return [`${value.toLocaleString()} (${pct})`, name];
                }}
              />
            ) : null}
          </PieChart>
        </ResponsiveContainer>

        {centerLabel ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-bold tabular-nums tracking-tight">{centerLabel.value}</div>
            {centerLabel.label ? (
              <div className="mt-1 text-xs text-muted-foreground">{centerLabel.label}</div>
            ) : null}
          </div>
        ) : null}
      </div>

      {withLegend ? (
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
          {data.map((d, i) => (
            <li key={d.name} className="flex items-center gap-1.5">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ background: d.color ?? palette[i % palette.length] }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-medium tabular-nums">{d.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
