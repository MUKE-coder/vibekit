import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short label (e.g. "Revenue", "Active users"). */
  label: string;
  /** The big number / value. Pre-formatted (you control the formatter). */
  value: React.ReactNode;
  /** Optional supporting text under the value (e.g. "vs last month"). */
  hint?: React.ReactNode;
  /**
   * Trend delta. Positive = up arrow + accent colour; negative = down arrow
   * + destructive colour; zero/null = neutral dash. Pre-format the string.
   *
   *   <StatCard label="Revenue" value="$24,560" trend={{ value: "+12.5%", direction: "up" }} />
   */
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  /** Optional icon slot (top-right). Prefer small illustrations over bare Lucide icons. */
  icon?: React.ReactNode;
  /** Optional sparkline slot. Drop a chart component here. */
  sparkline?: React.ReactNode;
  /** Skeleton state. */
  loading?: boolean;
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

/**
 * KPI card — value, label, optional trend, icon, sparkline, and a built-in
 * loading skeleton. Drop a row of these on every dashboard.
 */
export function StatCard({
  label,
  value,
  hint,
  trend,
  icon,
  sparkline,
  loading = false,
  className,
  ...props
}: StatCardProps) {
  if (loading) {
    return (
      <Card {...props} className={cn(className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          {icon ? <Skeleton className="h-6 w-6" /> : null}
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;

  return (
    <Card {...props} className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </CardHeader>
      <CardContent className="space-y-1.5">
        <div className="text-2xl font-bold tabular-nums tracking-tight">{value}</div>
        {trend || hint ? (
          <div className="flex items-center gap-2 text-xs">
            {trend && TrendIcon ? (
              <span className={cn("inline-flex items-center gap-0.5 font-medium", TREND_COLOR[trend.direction])}>
                <TrendIcon className="h-3 w-3" aria-hidden />
                {trend.value}
              </span>
            ) : null}
            {hint ? <span className="text-muted-foreground">{hint}</span> : null}
          </div>
        ) : null}
        {sparkline ? <div className="mt-3 h-12 w-full">{sparkline}</div> : null}
      </CardContent>
    </Card>
  );
}
