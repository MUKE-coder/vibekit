"use client";

import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Dismissible site-wide announcement banner. Persistence is keyed by an
 * `id` you supply — once the user dismisses an announcement with a given
 * id, it stays dismissed across reloads (localStorage).
 *
 * Pair with the framework's image-first design rule by passing an
 * illustration into `icon` rather than a bare Lucide icon for big
 * marketing banners. For utility banners (system status, maintenance
 * window), Lucide icons are fine.
 *
 *   <Banner
 *     id="v2-launch-2026-05"
 *     variant="info"
 *     title="We just shipped v2 — explore the new dashboard"
 *     action={<a href="/changelog" className="underline">See what's new</a>}
 *   />
 *
 *   <Banner
 *     id="planned-maintenance-2026-06-01"
 *     variant="warning"
 *     title="Scheduled maintenance Sat June 1, 02:00 UTC (30 min)"
 *     dismissible={false}
 *   />
 *
 * Bump the `id` whenever the message changes so users see the new banner
 * even if they dismissed the previous one.
 */

type Variant = "info" | "success" | "warning" | "destructive";

interface BannerProps {
  /** Unique, stable identifier for THIS announcement. Bump when copy changes. */
  id: string;
  /** Headline. Required. */
  title: React.ReactNode;
  /** Optional supporting text. */
  description?: React.ReactNode;
  /** Optional action slot (link / Button). */
  action?: React.ReactNode;
  variant?: Variant;
  /** Custom icon override. Defaults to the variant's Lucide icon. */
  icon?: React.ReactNode;
  /** Show the dismiss X. Default: true. */
  dismissible?: boolean;
  className?: string;
}

const STORAGE_PREFIX = "banner-dismissed:";

const VARIANT_CLASS: Record<Variant, string> = {
  info: "bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-100 border-blue-200/70 dark:border-blue-900",
  success: "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100 border-emerald-200/70 dark:border-emerald-900",
  warning: "bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100 border-amber-200/70 dark:border-amber-900",
  destructive: "bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100 border-red-200/70 dark:border-red-900",
};

const VARIANT_ICON: Record<Variant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: AlertCircle,
};

export function Banner({
  id,
  title,
  description,
  action,
  variant = "info",
  icon,
  dismissible = true,
  className,
}: BannerProps) {
  const storageKey = `${STORAGE_PREFIX}${id}`;
  const [dismissed, setDismissed] = React.useState(false);

  // Read persisted dismissal AFTER mount to dodge hydration mismatch
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.localStorage.getItem(storageKey) === "1") setDismissed(true);
    } catch {
      /* private mode etc. — ignore */
    }
  }, [storageKey]);

  if (dismissed) return null;

  const Icon = VARIANT_ICON[variant];

  function dismiss() {
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 border-b px-4 py-2.5 text-sm",
        VARIANT_CLASS[variant],
        className,
      )}
    >
      <div className="mt-0.5 shrink-0">
        {icon ?? <Icon className="h-4 w-4" aria-hidden />}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-medium">{title}</span>
          {description ? <span className="opacity-80">{description}</span> : null}
        </div>
        {action ? <div className="mt-1 text-sm">{action}</div> : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="-mr-1 mt-0.5 shrink-0 rounded-md p-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          <X className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
