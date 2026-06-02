"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Returns the currently authenticated user from the session endpoint.
 *
 * Defaults to the Better Auth endpoint at `/api/auth/get-session`. Override
 * via the `endpoint` option if your auth client uses a different path.
 *
 * Cached forever in React Query until invalidated — most apps will want to
 * invalidate after sign-in / sign-out using `queryClient.invalidateQueries({ queryKey: ["session"] })`.
 */

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

interface UseCurrentUserOptions {
  /** Endpoint that returns `{ user, session } | null`. Default: `/api/auth/get-session`. */
  endpoint?: string;
  /** Refetch interval in ms. Off by default. */
  refetchInterval?: number;
}

export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { endpoint = "/api/auth/get-session", refetchInterval } = options;

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["session", endpoint],
    queryFn: async () => {
      const res = await fetch(endpoint, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 401) return null;
        throw new Error(`Session fetch failed: ${res.status}`);
      }
      const body = await res.json();
      // Normalise both shapes: { user } and { user, session }
      const user: SessionUser | null = body?.user ?? null;
      return user;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval,
  });

  return {
    user: data ?? null,
    isLoading,
    isFetching,
    isAuthenticated: !!data,
    error: error instanceof Error ? error : null,
    refetch,
  };
}
