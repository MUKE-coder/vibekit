"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  /** Display label. */
  label: string;
  /** Optional href. The last item is typically rendered without a link. */
  href?: string;
}

interface BreadcrumbsProps {
  /**
   * Override breadcrumb items explicitly. If omitted, the component generates
   * crumbs from the current pathname (segments title-cased, dashes → spaces).
   */
  items?: BreadcrumbItem[];
  /** Label override map keyed by segment slug — e.g. `{ "[id]": "Detail" }`. */
  labelOverrides?: Record<string, string>;
  /** Pass false to omit the leading "Home" crumb. Default: true. */
  showHome?: boolean;
  /** Custom separator (default: chevron-right). */
  separator?: React.ReactNode;
  className?: string;
}

function titleCase(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Breadcrumbs auto-generated from the current pathname, or pass `items` to
 * override. Use `labelOverrides` to relabel dynamic segments (e.g. an [id]
 * segment becomes "Detail").
 *
 *   <Breadcrumbs />
 *   <Breadcrumbs labelOverrides={{ "[id]": "Invoice" }} />
 *   <Breadcrumbs items={[{ label: "Settings", href: "/settings" }, { label: "Billing" }]} />
 */
export function Breadcrumbs({
  items,
  labelOverrides = {},
  showHome = true,
  separator = <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />,
  className,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const resolved = React.useMemo<BreadcrumbItem[]>(() => {
    if (items) return items;
    if (!pathname || pathname === "/") return showHome ? [{ label: "Home", href: "/" }] : [];

    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [];

    if (showHome) crumbs.push({ label: "Home", href: "/" });

    let acc = "";
    segments.forEach((segment, i) => {
      acc += `/${segment}`;
      const label = labelOverrides[segment] ?? titleCase(segment);
      const isLast = i === segments.length - 1;
      crumbs.push({ label, href: isLast ? undefined : acc });
    });

    return crumbs;
  }, [items, pathname, labelOverrides, showHome]);

  if (resolved.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn(className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {resolved.map((crumb, i) => {
          const isLast = i === resolved.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "font-medium text-foreground" : "text-muted-foreground"}
                >
                  {crumb.label}
                </span>
              )}
              {!isLast ? separator : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
