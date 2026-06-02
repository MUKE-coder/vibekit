"use client";

import { useCallback, useMemo } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

/**
 * Permission matrix hook backed by `useCurrentUser`. Provides a typed
 * `can(action, resource)` so UI doesn't need to know roles directly.
 *
 *   const { can, hasRole } = usePermissions();
 *   if (can("delete", "invoice")) return <DeleteButton />;
 *   if (hasRole("OWNER")) return <DangerZone />;
 *
 * Server-side gating still happens in API routes via `requireRole` —
 * this is the UI surface that mirrors the same matrix.
 *
 * Customise the `MATRIX` constant below to match your project's roles
 * and resources. Keep client + server in sync.
 */

// Edit this matrix to match your app's authorisation model.
const MATRIX = {
  OWNER:  { everything: true } as Record<string, true | string[]>,
  ADMIN:  {
    user:    ["create", "read", "update", "delete"],
    invoice: ["create", "read", "update", "delete"],
    org:     ["read", "update"],
  } as Record<string, true | string[]>,
  MEMBER: {
    invoice: ["create", "read", "update"],
    user:    ["read"],
    org:     ["read"],
  } as Record<string, true | string[]>,
  VIEWER: {
    invoice: ["read"],
    user:    ["read"],
    org:     ["read"],
  } as Record<string, true | string[]>,
} as const;

type Role = keyof typeof MATRIX;

export function usePermissions() {
  const { user, isLoading } = useCurrentUser();
  const role = (user?.role ?? null) as Role | null;

  const can = useCallback(
    (action: string, resource: string): boolean => {
      if (!role) return false;
      const rules = MATRIX[role];
      if (!rules) return false;
      if (rules.everything === true) return true;
      const allowed = rules[resource];
      if (allowed === true) return true;
      if (Array.isArray(allowed)) return allowed.includes(action);
      return false;
    },
    [role],
  );

  const hasRole = useCallback(
    (...roles: Role[]) => (role ? roles.includes(role) : false),
    [role],
  );

  return useMemo(
    () => ({ user, role, can, hasRole, isLoading }),
    [user, role, can, hasRole, isLoading],
  );
}
