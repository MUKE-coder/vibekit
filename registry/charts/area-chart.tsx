"use client";

import * as React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";

/**
 * Themed area chart with a soft gradient fill — the dashboard staple
 * for revenue, signups, traffic over time. Stacked or single, smooth
 * step or monotone, theme-token colours.
 *
 *   <AreaChart
 *     data={traffic}
 *     xKey="date"
 *     series={[
 *       { key: "visitors", label: "Visitors" },
 *       { key: "pageviews", label: "Pageviews" },
 *     ]}
 *     stacked
 *     yFormat={fmt.numberShort}
 *   />
 */

const PALETTE = [
  "var(--chart-1, #6366f1)",
  "var(--chart-2, #22c55e)",
  "var(--chart-3, #f59e0b)",
  "var(--chart-4, #ef4444)",
  "var(--chart-5, #06b6d4)",
];

export interface AreaSeries {
  key: string;
  label: string;
  color?: string;
}

interface AreaChartProps<Row extends Record<string, unknown>> {
  data: Row[];
  xKey: keyof Row & string;
  series: AreaSeries[];
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  curve?: "monotone" | "step" | "linear";
  yFormat?: (value: number) => string;
  xFormat?: (value: string | number) => string;
  className?: string;
}

export function AreaChart<Row extends Record<string, unknown>>({
  data,
  xKey,
  series,
  height = 260,
  showLegend = true,
  showGrid = true,
  stacked,
  curve = "monotone",
  yFormat,
  xFormat,
  className,
}: AreaChartProps<Row>) {
  const stackId = stacked ? "stack" : undefined;
  const gradientId = React.useId();

  return (
    <div className={cn("h-full w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, i) => {
              const color = s.color ?? PALETTE[i % PALETTE.length];
              return (
                <linearGradient key={s.key} id={`${gradientId}-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>
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
            formatter={(value: number) => (yFormat ? yFormat(value) : value)}
          />
          {showLegend ? <Legend iconType="square" wrapperStyle={{ fontSize: 11 }} /> : null}
          {series.map((s, i) => {
            const color = s.color ?? PALETTE[i % PALETTE.length];
            return (
              <Area
                key={s.key}
                type={curve}
                dataKey={s.key}
                name={s.label}
                stackId={stackId}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId}-${s.key})`}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
