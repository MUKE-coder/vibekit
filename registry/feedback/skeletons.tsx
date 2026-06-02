import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Layout-matched skeleton variants — drop these in as `<Suspense>` fallbacks
 * so the page silhouette is preserved while data loads. Better UX than a
 * spinner; the eye expects content in those positions.
 *
 *   <Suspense fallback={<TableSkeleton rows={10} columns={5} />}>
 *     <InvoiceTable />
 *   </Suspense>
 */

/* ──────────────── Table ──────────────── */
interface TableSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
  /** Show the toolbar skeleton above the table. Default: true. */
  withToolbar?: boolean;
}

export function TableSkeleton({
  rows = 8,
  columns = 5,
  withToolbar = true,
  className,
  ...props
}: TableSkeletonProps) {
  return (
    <div {...props} className={cn("space-y-4", className)}>
      {withToolbar ? (
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-72" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-border">
        {/* header row */}
        <div className="flex border-b border-border bg-muted/40 px-4 py-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={`h-${i}`} className="flex-1">
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        {/* body rows */}
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`r-${r}`} className="flex border-b border-border px-4 py-4 last:border-0">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={`c-${r}-${c}`} className="flex-1">
                <Skeleton className={cn("h-4", c === 0 ? "w-32" : "w-20")} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────── Card grid ──────────────── */
interface CardGridSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  cards?: number;
  /** Tailwind grid-template-columns config. Default: 1→2→3 responsive. */
  cols?: string;
}

export function CardGridSkeleton({
  cards = 6,
  cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  className,
  ...props
}: CardGridSkeletonProps) {
  return (
    <div {...props} className={cn("grid gap-4", cols, className)}>
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-8 w-32" />
          <Skeleton className="mt-2 h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/* ──────────────── Detail page ──────────────── */
export function DetailPageSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn("space-y-8", className)}>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" /> {/* breadcrumb */}
        <Skeleton className="h-9 w-72" /> {/* title */}
        <Skeleton className="h-4 w-96" /> {/* description */}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

/* ──────────────── Form ──────────────── */
interface FormSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  fields?: number;
}

export function FormSkeleton({ fields = 4, className, ...props }: FormSkeletonProps) {
  return (
    <div {...props} className={cn("space-y-5", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-24" /> {/* label */}
          <Skeleton className="h-9 w-full" /> {/* input */}
        </div>
      ))}
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}

/* ──────────────── Stat row ──────────────── */
interface StatRowSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export function StatRowSkeleton({ count = 4, className, ...props }: StatRowSkeletonProps) {
  return (
    <div
      {...props}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0,1fr))` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-card p-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-7 w-32" />
          <Skeleton className="mt-2 h-3 w-16" />
        </div>
      ))}
    </div>
  );
}
