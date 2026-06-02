"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * URL-synced tab navigation for detail-page sections. Two modes:
 *
 * 1) **Pathname mode** — each tab has its own route (`/invoices/[id]/overview`,
 *    `/invoices/[id]/activity`). The active tab matches the URL pathname.
 *    Use real `<Link>` navigation; the layout component matches the slug
 *    to figure out which tab is active.
 *
 *      <TabNav
 *        mode="path"
 *        tabs={[
 *          { value: "overview",   label: "Overview",  href: `/invoices/${id}` },
 *          { value: "activity",   label: "Activity",  href: `/invoices/${id}/activity` },
 *          { value: "comments",   label: "Comments",  href: `/invoices/${id}/comments`, badge: 4 },
 *        ]}
 *      />
 *
 * 2) **Query-param mode** — single page; tabs swap via `?tab=` search param
 *    so back-button works and the URL is shareable.
 *
 *      <TabNav
 *        mode="query"
 *        paramName="tab"           // default: "tab"
 *        defaultValue="overview"
 *        tabs={[...]}
 *      />
 */

export interface TabItem {
  value: string;
  label: React.ReactNode;
  /** Only used in `mode="path"`. */
  href?: string;
  /** Optional badge (number or text). */
  badge?: string | number;
  /** Hide the tab entirely (handy for role-based filtering). */
  hidden?: boolean;
  /** Disable the tab — renders but isn't clickable. */
  disabled?: boolean;
}

interface TabNavProps {
  tabs: TabItem[];
  /** Active strategy. Default: query. */
  mode?: "query" | "path";
  /** Query param key for `mode="query"`. Default: "tab". */
  paramName?: string;
  /** Default active tab value for `mode="query"`. Falls back to tabs[0].value. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onChange?: (value: string) => void;
  className?: string;
}

export function TabNav({
  tabs,
  mode = "query",
  paramName = "tab",
  defaultValue,
  onChange,
  className,
}: TabNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const visibleTabs = tabs.filter((t) => !t.hidden);
  const firstValue = defaultValue ?? visibleTabs[0]?.value;

  const activeValue = React.useMemo(() => {
    if (mode === "path") {
      const match = visibleTabs.find((t) => t.href && (pathname === t.href || pathname.startsWith(t.href + "/")));
      return match?.value ?? firstValue;
    }
    return params.get(paramName) ?? firstValue;
  }, [mode, pathname, params, paramName, firstValue, visibleTabs]);

  const setActive = React.useCallback(
    (value: string) => {
      onChange?.(value);
      if (mode === "query") {
        const next = new URLSearchParams(params.toString());
        if (value === firstValue) next.delete(paramName);
        else next.set(paramName, value);
        const qs = next.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      }
    },
    [mode, params, paramName, pathname, router, firstValue, onChange],
  );

  return (
    <nav
      role="tablist"
      aria-label="Section tabs"
      className={cn("flex flex-wrap items-center gap-1 border-b border-border", className)}
    >
      {visibleTabs.map((tab) => {
        const isActive = tab.value === activeValue;
        const inner = (
          <>
            <span>{tab.label}</span>
            {tab.badge !== undefined ? (
              <span className="ml-2 rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
                {tab.badge}
              </span>
            ) : null}
          </>
        );
        const classes = cn(
          "inline-flex items-center gap-1 border-b-2 px-3 py-2 text-sm transition-colors -mb-px",
          isActive
            ? "border-foreground font-medium text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground",
          tab.disabled && "pointer-events-none opacity-40",
        );

        if (mode === "path" && tab.href) {
          return (
            <Link
              key={tab.value}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              aria-disabled={tab.disabled || undefined}
              className={classes}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => setActive(tab.value)}
            className={classes}
          >
            {inner}
          </button>
        );
      })}
    </nav>
  );
}
