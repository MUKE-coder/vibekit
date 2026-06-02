"use client";

import * as React from "react";
import { Maximize2, Minimize2, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Standard wrapper for every chart on a dashboard. Bundles title +
 * description + optional action menu + fullscreen toggle + loading +
 * empty states so every dashboard widget looks uniform.
 *
 *   <ChartCard
 *     title="Revenue"
 *     description="Last 30 days"
 *     loading={query.isLoading}
 *     empty={data.length === 0}
 *     actions={[
 *       { label: "Export CSV", onSelect: () => exportToCSV(data, ...) },
 *       { label: "Open in dashboards", href: "/analytics/revenue" },
 *     ]}
 *   >
 *     <LineChart data={data} />
 *   </ChartCard>
 *
 * `fullscreen` is local state — the card expands to fill the viewport
 * while keeping its slot DOM stable so chart libraries don't re-render
 * from scratch.
 */

export interface ChartCardAction {
  label: React.ReactNode;
  onSelect?: () => void;
  href?: string;
  /** Visual treatment. Default: "default". */
  variant?: "default" | "destructive";
}

interface ChartCardProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Optional dropdown menu of actions in the top-right corner. */
  actions?: ChartCardAction[];
  /** Show a Maximize/Minimize toggle. Default: false. */
  fullscreenable?: boolean;
  /** Skeleton fallback while loading. */
  loading?: boolean;
  /** Empty-state message override (or pass `true` for the default). */
  empty?: boolean | React.ReactNode;
  /** Slot height — apply via Tailwind classes. Default: "h-64". */
  bodyClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({
  title,
  description,
  actions,
  fullscreenable = false,
  loading = false,
  empty = false,
  bodyClassName = "h-64",
  className,
  children,
}: ChartCardProps) {
  const [fullscreen, setFullscreen] = React.useState(false);

  return (
    <>
      <Card
        className={cn(
          "flex flex-col",
          fullscreen && "fixed inset-4 z-50 shadow-2xl",
          className,
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="min-w-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {description ? <CardDescription className="mt-1 text-xs">{description}</CardDescription> : null}
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            {fullscreenable ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => setFullscreen((v) => !v)}
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
            ) : null}
            {actions && actions.length > 0 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground" aria-label="Actions">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, i) => (
                    <DropdownMenuItem
                      key={i}
                      onSelect={action.onSelect}
                      asChild={!!action.href}
                      className={action.variant === "destructive" ? "text-destructive focus:text-destructive" : undefined}
                    >
                      {action.href ? <a href={action.href}>{action.label}</a> : <span>{action.label}</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className={cn("flex-1", fullscreen ? "h-full overflow-auto" : bodyClassName)}>
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : empty ? (
            <div className="grid h-full place-items-center text-center">
              <div className="space-y-1">
                <div className="text-sm font-medium text-foreground">
                  {empty === true ? "No data yet" : empty}
                </div>
                <div className="text-xs text-muted-foreground">Data will appear here once available.</div>
              </div>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>

      {/* Backdrop when fullscreen — clicks/escape collapse back */}
      {fullscreen ? (
        <div
          role="presentation"
          onClick={() => setFullscreen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setFullscreen(false);
          }}
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      ) : null}
    </>
  );
}
