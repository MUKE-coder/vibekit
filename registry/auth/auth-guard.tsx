"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";

interface AuthGuardProps {
  children: React.ReactNode;
  /** Where to send unauthenticated users. Default: "/auth/sign-in". */
  signInPath?: string;
  /** Preserve the current path as ?callbackUrl=... so we can bounce back after sign-in. Default: true. */
  withCallback?: boolean;
  /** Optional fallback while the session is loading. Defaults to a centred spinner. */
  fallback?: React.ReactNode;
}

/**
 * Client-side auth gate. Use this in route groups where the server-side
 * guard isn't enough (e.g. client components that fetch user-scoped data
 * before the layout has been protected by middleware).
 *
 *   <AuthGuard><Dashboard /></AuthGuard>
 *
 * Behaviour:
 *   - While loading: renders `fallback` (spinner by default)
 *   - Signed-in: renders `children`
 *   - Signed-out: redirects to `signInPath?callbackUrl=<current>`
 *
 * NOTE: this is UX, not security. The server-side requireAuth() in route
 * handlers is the real gate. AuthGuard only prevents the brief flash of
 * gated content before middleware kicks in.
 */
export function AuthGuard({
  children,
  signInPath = "/auth/sign-in",
  withCallback = true,
  fallback,
}: AuthGuardProps) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (isLoading) return;
    if (user) return;

    const target = withCallback && pathname
      ? `${signInPath}?callbackUrl=${encodeURIComponent(pathname)}`
      : signInPath;
    router.replace(target);
  }, [isLoading, user, router, pathname, signInPath, withCallback]);

  if (isLoading || !user) {
    return (
      fallback ?? (
        <div className="grid min-h-[50vh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden />
        </div>
      )
    );
  }

  return <>{children}</>;
}
