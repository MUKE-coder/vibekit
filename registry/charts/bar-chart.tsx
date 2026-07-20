"use client";

import * as React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/**
 * Themed bar chart. Vertical (default) or horizontal layout, grouped
 * or stacked. Sensible defaults match the framework's dashboard look.
 *
 *   <BarChart
 *     data={salesByRep}
 *     xKey="rep"
 *     series={[
 *       { key: "q1", label: "Q1" },
 *       { key: "q2", label: "Q2" },
 *     ]}
 *     stacked
 *     yFormat={fmt.currencyShort}
 *   />
 */

const PALETTE = [
  "var(--chart-1, #6366f1)",
  "var(--chart-2, #22c55e)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #06b6d4)",
];

export interface BarSeries {
  key: string;
  label: string;
  color?: string;
}

interface BarChartProps<Row extends Record<string, unknown>> {
  data: Row[];
  xKey: keyof Row & string;
  series: BarSeries[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  horizontal?: boolean;
  yFormat?: (value: number) => string;
  xFormat?: (value: string | number) => string;
  /** Rounded corner radius for bar tops. Default: 4. */
  radius?: number;
  className?: string;
}

export function BarChart<Row extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 260,
  showLegend = true,
  showGrid = true,
  stacked,
  horizontal,
  yFormat,
  xFormat,
  radius = 4,
  className,
}: BarChartProps<Row>) {
  const stackId = stacked ? "stack" : undefined;
  const layout = horizontal ? "vertical" : "horizontal";

  return (
    <div className={cn("h-full w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout={layout} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
          {showGrid ? <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /> : null}
          {horizontal ? (
            <>
              <XAxis
                type="number"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={yFormat}
              />
              <YAxis
                type="category"
                dataKey={xKey}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={xFormat}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey={xKey}
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={xFormat}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={yFormat}
                width={60}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            formatter={(value: number) => (yFormat ? yFormat(value) : value)}
          />
          {showLegend ? <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s, i) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              stackId={stackId}
              fill={s.color ?? PALETTE[i % PALETTE.length]}
              radius={stacked ? 0 : [radius, radius, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
