"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * Standard sidebar-+-topbar-+-content shell. Drop in a layout file and
 * compose the three named slots:
 *
 *   <AppShell
 *     sidebar={<Sidebar items={navItems} />}
 *     topbar={<TopBar />}
 *   >
 *     {children}
 *   </AppShell>
 *
 * Sidebar state (collapsed / open / mobile-drawer-open) is persisted via
 * useLocalStorage so the layout survives reloads. On mobile (<md) the
 * sidebar becomes an off-canvas drawer with a Menu button in the topbar.
 *
 * Pairs with `sidebar` (`MUKE-coder/vibekit/sidebar`) but works with any
 * sidebar node you pass in.
 */

interface AppShellProps {
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
  children: React.ReactNode;
  /** Optional override for the persistence key. Default: 'app-shell-collapsed'. */
  storageKey?: string;
  /** Initial sidebar state on first visit. Default: false (expanded). */
  defaultCollapsed?: boolean;
  /** Width in px when collapsed (icon-only). Default: 64. */
  collapsedWidth?: number;
  /** Width in px when expanded. Default: 256. */
  expandedWidth?: number;
  className?: string;
}

interface AppShellContextValue {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
  isMobile: boolean;
}

const AppShellContext = React.createContext<AppShellContextValue | null>(null);

/** Read the current shell state from any descendant component. */
export function useAppShell() {
  const ctx = React.useContext(AppShellContext);
  if (!ctx) throw new Error("useAppShell must be used inside <AppShell>");
  return ctx;
}

export function AppShell({
  sidebar,
  topbar,
  children,
  storageKey = "app-shell-collapsed",
  defaultCollapsed = false,
  collapsedWidth = 64,
  expandedWidth = 256,
  className,
}: AppShellProps) {
  const [collapsed, setCollapsedStored] = useLocalStorage<boolean>(storageKey, defaultCollapsed);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  // Close mobile drawer on route changes (best-effort — listens for popstate + clicks)
  React.useEffect(() => {
    if (!mobileOpen) return;
    const close = () => setMobileOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [mobileOpen]);

  const sidebarWidth = collapsed ? collapsedWidth : expandedWidth;

  return (
    <AppShellContext.Provider
      value={{
        collapsed,
        setCollapsed: (v) => setCollapsedStored(v),
        mobileOpen,
        setMobileOpen,
        isMobile,
      }}
    >
      <div className={cn("flex min-h-screen w-full bg-background", className)}>
        {/* Desktop sidebar */}
        {!isMobile && (
          <aside
            style={{ width: sidebarWidth }}
            className="hidden shrink-0 border-r border-border bg-card transition-[width] duration-200 md:block"
          >
            <div className="sticky top-0 h-screen overflow-hidden">{sidebar}</div>
          </aside>
        )}

        {/* Mobile drawer */}
        {isMobile && (
          <>
            {mobileOpen && (
              <div
                role="button"
                aria-label="Close menu"
                tabIndex={0}
                onClick={() => setMobileOpen(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setMobileOpen(false);
                }}
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              />
            )}
            <aside
              className={cn(
                "fixed inset-y-0 left-0 z-50 w-72 -translate-x-full transform border-r border-border bg-card transition-transform duration-200 md:hidden",
                mobileOpen && "translate-x-0",
              )}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-end p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">{sidebar}</div>
              </div>
            </aside>
          </>
        )}

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {topbar !== undefined ? (
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              {topbar}
            </header>
          ) : null}
          <main className="flex-1 overflow-x-auto">{children}</main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}
