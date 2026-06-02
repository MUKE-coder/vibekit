"use client";

import * as React from "react";
import { Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Maintenance-mode lockout — a full-page block screen that fades over
 * the app when the `MAINTENANCE_MODE` env var (or feature flag) is on.
 * Pair with an allowlist so admins can still access the dashboard
 * during a maintenance window.
 *
 * USAGE (in root layout, server component):
 *
 *   import { MaintenanceMode, isInMaintenanceMode } from "@/components/maintenance-mode";
 *
 *   export default async function RootLayout({ children }) {
 *     const session = await auth.api.getSession(...);
 *     const inMaintenance = isInMaintenanceMode();
 *     const isAdmin = session?.user?.role === "OWNER";
 *
 *     return (
 *       <html><body>
 *         {inMaintenance && !isAdmin ? (
 *           <MaintenanceMode message="We're back at 16:00 UTC." />
 *         ) : (
 *           <>
 *             {inMaintenance && isAdmin ? <MaintenanceBanner /> : null}
 *             {children}
 *           </>
 *         )}
 *       </body></html>
 *     );
 *   }
 *
 * Drives off `MAINTENANCE_MODE=true` (env), or pass `enabled` directly
 * if you wire it to a feature flag.
 */

/** Server-safe check. Returns true when MAINTENANCE_MODE env is set. */
export function isInMaintenanceMode(): boolean {
  return process.env.MAINTENANCE_MODE === "true" || process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
}

interface MaintenanceModeProps {
  /** Override the default copy with a project-specific message. */
  message?: React.ReactNode;
  /** Optional "expected back at" timestamp / ETA line. */
  eta?: React.ReactNode;
  /** Custom logo / brand mark above the headline. */
  brand?: React.ReactNode;
  /** Optional contact / support line below the message. */
  contact?: React.ReactNode;
  className?: string;
}

export function MaintenanceMode({
  message = "We're updating the app. Service will resume shortly.",
  eta,
  brand,
  contact,
  className,
}: MaintenanceModeProps) {
  return (
    <main
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed inset-0 z-[200] grid place-items-center bg-background px-6",
        className,
      )}
    >
      <div className="max-w-md text-center">
        {brand ?? (
          <div className="mx-auto mb-6 grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-muted-foreground">
            <Wrench className="h-5 w-5" aria-hidden />
          </div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Be right back
        </h1>
        <p className="mt-3 text-base text-muted-foreground">{message}</p>
        {eta ? <p className="mt-2 text-sm text-muted-foreground">ETA: {eta}</p> : null}
        {contact ? <div className="mt-6 text-sm text-muted-foreground">{contact}</div> : null}
      </div>
    </main>
  );
}

/**
 * Slim banner shown to admins when maintenance mode is ON but they're
 * allowlisted. Pair with the `banner` component or render in the topbar.
 */
export function MaintenanceBanner({
  message = "Maintenance mode is ON — non-admin users see the lockout screen.",
  className,
}: {
  message?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
        className,
      )}
    >
      <Wrench className="h-3.5 w-3.5" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
