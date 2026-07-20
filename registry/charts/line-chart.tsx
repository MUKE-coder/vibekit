"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/**
 * Themed line chart. Wraps Recharts with sensible defaults that match
 * the framework's stat-card / dashboard look: muted gridlines, single-
 * line tooltip, theme-token colours, optional comparison series.
 *
 *   <LineChart
 *     data={revenueSeries}
 *     xKey="date"
 *     series={[
 *       { key: "current", label: "This period" },
 *       { key: "previous", label: "Previous", dashed: true },
 *     ]}
 *     yFormat={fmt.currencyShort}
 *     height={240}
 *   />
 *
 * Pair with `<ChartCard>` for the surrounding shell + fullscreen +
 * loading / empty states.
 */

const PALETTE = [
  "var(--chart-1, #6366f1)",
  "var(--chart-2, #22c55e)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #06b6d4)",
];

export interface LineSeries {
  key: string;
  label: string;
  color?: string;
  dashed?: boolean;
}

interface LineChartProps<Row extends Record<string, unknown>> {
  data: Row[];
  xKey: keyof Row & string;
  series: LineSeries[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  yFormat?: (value: number) => string;
  xFormat?: (value: string | number) => string;
  className?: string;
}

export function LineChart<Row extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 260,
  showLegend = true,
  showGrid = true,
  yFormat,
  xFormat,
  className,
}: LineChartProps<Row>) {
  return (
    <div className={cn("h-full w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
          {showGrid ? <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /> : null}
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
          <Tooltip
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => (yFormat ? yFormat(value) : value)}
          />
          {showLegend ? <Legend iconType="line" wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s, i) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color ?? PALETTE[i % PALETTE.length]}
              strokeWidth={2}
              strokeDasharray={s.dashed ? "5 4" : undefined}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
