import * as React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Optional icon / illustration. Use an image or React node — not a bare Lucide icon (per the framework's image-first rule). */
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Primary CTA — usually a `<Button>`. */
  action?: React.ReactNode;
  /** Secondary CTA. */
  secondaryAction?: React.ReactNode;
  /** Visual variant: `default` for full-page empty, `inline` for a small empty list. */
  variant?: "default" | "inline";
}

/**
 * Standard empty state for "no data" and "no results" cases.
 *
 * Use the `default` variant for full pages (dashboard with zero items,
 * empty table). Use `inline` for a small empty list inside a card or
 * dropdown.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "default" ? "gap-4 px-6 py-16" : "gap-2 px-4 py-8",
        className,
      )}
    >
      {icon ? (
        <div
          className={cn(
            "text-muted-foreground",
            variant === "default" ? "mb-2 [&>svg]:h-12 [&>svg]:w-12" : "mb-1 [&>svg]:h-8 [&>svg]:w-8",
          )}
        >
          {icon}
        </div>
      ) : null}

      <h3
        className={cn(
          "font-semibold tracking-tight text-foreground",
          variant === "default" ? "text-lg" : "text-sm",
        )}
      >
        {title}
      </h3>

      {description ? (
        <p
          className={cn(
            "max-w-md text-muted-foreground",
            variant === "default" ? "text-sm" : "text-xs",
          )}
        >
          {description}
        </p>
      ) : null}

      {action || secondaryAction ? (
        <div className={cn("flex flex-wrap items-center justify-center gap-2", variant === "default" ? "mt-2" : "mt-1")}>
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
