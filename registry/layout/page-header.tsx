import * as React from "react";
import { cn } from "@/lib/utils";

// `title` is omitted from the native attributes: the DOM `title` is a string
// (tooltip text), while this component's `title` is the rendered <h1> content.
interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The page title (h1). */
  title: React.ReactNode;
  /** Optional subhead / description. */
  description?: React.ReactNode;
  /** Slot for breadcrumbs above the title. */
  breadcrumbs?: React.ReactNode;
  /** Slot for action buttons (right-aligned on desktop, below title on mobile). */
  actions?: React.ReactNode;
  /** Optional eyebrow / category label above the title. */
  eyebrow?: React.ReactNode;
}

/**
 * Standard page header — drop at the top of every dashboard / detail page so
 * the title, breadcrumbs, and primary actions sit in a predictable place.
 *
 *   <PageHeader
 *     title="Invoices"
 *     description="Manage your billing and invoices."
 *     breadcrumbs={<Breadcrumbs />}
 *     actions={<Button>New invoice</Button>}
 *   />
 */
export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  eyebrow,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      {...props}
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1 space-y-2">
        {breadcrumbs ? <div className="text-sm text-muted-foreground">{breadcrumbs}</div> : null}
        {eyebrow ? (
          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground sm:text-base">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:flex-none sm:gap-3">{actions}</div>
      ) : null}
    </header>
  );
}
