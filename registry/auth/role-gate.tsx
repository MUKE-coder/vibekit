"use client";

import * as React from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface RoleGateProps {
  /** Roles allowed to see `children`. Empty array allows any signed-in user. */
  roles: string[];
  /** Optional render-when-unauthorised slot. Defaults to null (hides). */
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Renders `children` only if the current user's role is in `roles`.
 *
 * - Returns `fallback` (or null) while loading / unauthenticated / unauthorised
 * - Empty `roles` array means "any signed-in user"
 *
 * Server-side gating should still happen in API routes / server components —
 * this is a UI affordance, not a security boundary.
 */
export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) return <>{fallback}</>;
  if (!user) return <>{fallback}</>;

  const role = user.role ?? null;
  const allowed = roles.length === 0 ? true : role !== null && roles.includes(role);

  return <>{allowed ? children : fallback}</>;
}
