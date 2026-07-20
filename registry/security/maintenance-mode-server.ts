/**
 * Maintenance-mode server checks.
 *
 * WHY this is a separate, directive-free module: `MAINTENANCE_MODE` is a
 * server-only env var (no `NEXT_PUBLIC_` prefix), so Next inlines it as
 * `undefined` in any client bundle. Keeping the check out of the
 * `"use client"` component file means (a) it reads the real value, and
 * (b) an async server root layout importing it gets a callable function
 * instead of a client reference.
 *
 * USAGE (in root layout, server component):
 *
 *   import { isInMaintenanceMode } from "@/lib/maintenance-mode";
 *   import { MaintenanceMode, MaintenanceBanner } from "@/components/maintenance-mode";
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
  return (
    process.env.MAINTENANCE_MODE === "true" ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
  );
}
