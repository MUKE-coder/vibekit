"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppShell } from "@/components/app-shell";

/**
 * Config-driven sidebar with active-state highlighting, nested groups,
 * role-based filtering, optional badges, and a collapse toggle. Pair
 * with `<AppShell>` from `MUKE-coder/vibekit/app-shell`.
 *
 *   <Sidebar
 *     header={<Logo />}
 *     items={[
 *       { kind: "link", label: "Dashboard", href: "/dashboard", icon: Home },
 *       { kind: "group", label: "Sales", items: [
 *         { kind: "link", label: "Invoices", href: "/invoices", icon: FileText, badge: 12 },
 *         { kind: "link", label: "Customers", href: "/customers", icon: Users, roles: ["ADMIN", "SALES"] },
 *       ]},
 *     ]}
 *     userRole={user.role}
 *     footer={<UserMenu />}
 *   />
 */

interface SidebarLinkItem {
  kind: "link";
  label: string;
  href: string;
  icon?: LucideIcon;
  /** Optional badge — string OR number. Hidden when sidebar is collapsed. */
  badge?: string | number;
  /** Restrict to roles. Empty / omitted = visible to all signed-in users. */
  roles?: string[];
  /** Treat exact-match only (default false — startsWith match for active state). */
  exact?: boolean;
}

interface SidebarGroupItem {
  kind: "group";
  label: string;
  /** Icon shown when collapsed. */
  icon?: LucideIcon;
  items: SidebarLinkItem[];
  /** Open by default. Default: true. */
  defaultOpen?: boolean;
  roles?: string[];
}

export type SidebarItem = SidebarLinkItem | SidebarGroupItem;

interface SidebarProps {
  items: SidebarItem[];
  /** Top of the sidebar — typically a logo. */
  header?: React.ReactNode;
  /** Bottom of the sidebar — typically a user menu / sign-out. */
  footer?: React.ReactNode;
  /** Current user's role for role-based filtering. */
  userRole?: string | null;
  className?: string;
}

export function Sidebar({ items, header, footer, userRole, className }: SidebarProps) {
  const { collapsed, setCollapsed } = useAppShell();
  const pathname = usePathname();

  const visibleItems = items.filter((item) => allowed(item.roles, userRole));

  return (
    <nav className={cn("flex h-full flex-col", className)} aria-label="Primary">
      {header ? (
        <div className={cn("flex h-14 items-center border-b border-border", collapsed ? "justify-center px-2" : "px-4")}>
          {header}
        </div>
      ) : null}

      <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {visibleItems.map((item, i) =>
          item.kind === "link" ? (
            <li key={`l-${i}`}>
              <SidebarLink item={item} pathname={pathname} collapsed={collapsed} />
            </li>
          ) : (
            <li key={`g-${i}`}>
              <SidebarGroup item={item} pathname={pathname} collapsed={collapsed} userRole={userRole} />
            </li>
          ),
        )}
      </ul>

      {footer ? (
        <div className={cn("border-t border-border", collapsed ? "p-2" : "p-3")}>{footer}</div>
      ) : null}

      <div className={cn("border-t border-border p-2", collapsed && "flex justify-center")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="h-7 w-7"
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </Button>
      </div>
    </nav>
  );
}

function allowed(roles: string[] | undefined, userRole: string | null | undefined) {
  if (!roles || roles.length === 0) return true;
  if (!userRole) return false;
  return roles.includes(userRole);
}

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

function SidebarLink({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarLinkItem;
  pathname: string;
  collapsed: boolean;
}) {
  const active = isActive(pathname, item.href, item.exact);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
        collapsed && "justify-center px-0",
      )}
    >
      {Icon ? <Icon className="h-4 w-4 shrink-0" aria-hidden /> : null}
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge !== undefined ? (
            <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </Link>
  );
}

function SidebarGroup({
  item,
  pathname,
  collapsed,
  userRole,
}: {
  item: SidebarGroupItem;
  pathname: string;
  collapsed: boolean;
  userRole?: string | null;
}) {
  const [open, setOpen] = React.useState(item.defaultOpen ?? true);
  const filteredChildren = item.items.filter((i) => allowed(i.roles, userRole));
  if (filteredChildren.length === 0) return null;

  // When collapsed, render only the icons of children (skip the group header)
  if (collapsed) {
    return (
      <ul className="space-y-0.5">
        {filteredChildren.map((child, i) => (
          <li key={i}>
            <SidebarLink item={child} pathname={pathname} collapsed />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 shrink-0 transition-transform",
            open ? "rotate-0" : "-rotate-90",
          )}
          aria-hidden
        />
        <span className="flex-1 text-left">{item.label}</span>
      </button>
      {open && (
        <ul className="ml-2 space-y-0.5">
          {filteredChildren.map((child, i) => (
            <li key={i}>
              <SidebarLink item={child} pathname={pathname} collapsed={false} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
