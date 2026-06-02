"use client";

import * as React from "react";
import { Funnel, FunnelChart as ReFunnelChart, LabelList, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

/**
 * Conversion funnel chart. Use for sales pipelines, onboarding flows,
 * sign-up → activation → retention paths. Returns the stage labels +
 * counts and computes the per-stage conversion automatically.
 *
 *   <FunnelChart
 *     stages={[
 *       { name: "Visited",     value: 12_400 },
 *       { name: "Signed up",   value:  3_200 },
 *       { name: "Activated",   value:  1_540 },
 *       { name: "Subscribed",  value:    380 },
 *     ]}
 *   />
 *
 * Pair with a DateRangePicker to drive the funnel period.
 */

export interface FunnelStage {
  name: string;
  value: number;
  /** Optional explicit colour for this stage. */
  fill?: string;
}

interface FunnelChartProps {
  stages: FunnelStage[];
  /** Fixed height. Default: 280. */
  height?: number;
  /** Show per-stage % conversion vs. previous stage. Default: true. */
  withConversion?: boolean;
  /** Fallback palette. */
  palette?: string[];
  className?: string;
}

const DEFAULT_PALETTE = [
  "var(--chart-1, hsl(220 70% 50%))",
  "var(--chart-2, hsl(220 60% 45%))",
  "var(--chart-3, hsl(220 55% 40%))",
  "var(--chart-4, hsl(220 50% 35%))",
  "var(--chart-5, hsl(220 45% 30%))",
];

export function FunnelChart({
  stages,
  height = 280,
  withConversion = true,
  palette = DEFAULT_PALETTE,
  className,
}: FunnelChartProps) {
  const data = React.useMemo(
    () =>
      stages.map((s, i) => ({
        name: s.name,
        value: s.value,
        fill: s.fill ?? palette[i % palette.length],
      })),
    [stages, palette],
  );

  const top = data[0]?.value ?? 0;

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ReFunnelChart>
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
            formatter={(value: number, _name, item) => {
              const stageIndex = data.findIndex((d) => d.name === item.payload.name);
              const prev = stageIndex > 0 ? data[stageIndex - 1].value : value;
              const conv = prev > 0 ? ` (${((value / prev) * 100).toFixed(1)}% of prev)` : "";
              const overall = top > 0 ? ` · ${((value / top) * 100).toFixed(1)}% of top` : "";
              return [`${value.toLocaleString()}${conv}${overall}`, item.payload.name];
            }}
          />
          <Funnel data={data} dataKey="value" isAnimationActive={false}>
            <LabelList
              position="right"
              fill="currentColor"
              stroke="none"
              dataKey="name"
              className="text-xs"
            />
            {withConversion ? (
              <LabelList
                position="center"
                fill="white"
                stroke="none"
                className="text-xs font-semibold"
                content={(props) => {
                  const { x, y, width, height: h, value, index } = props as {
                    x: number;
                    y: number;
                    width: number;
                    height: number;
                    value: number;
                    index: number;
                  };
                  const prev = index > 0 ? data[index - 1].value : value;
                  const conv = prev > 0 ? `${((value / prev) * 100).toFixed(0)}%` : "";
                  return (
                    <text
                      x={x + width / 2}
                      y={y + h / 2}
                      dy={4}
                      textAnchor="middle"
                      style={{ fill: "white", fontSize: 12, fontWeight: 600 }}
                    >
                      {value.toLocaleString()}
                      {index > 0 && conv ? ` · ${conv}` : ""}
                    </text>
                  );
                }}
              />
            ) : null}
          </Funnel>
        </ReFunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
