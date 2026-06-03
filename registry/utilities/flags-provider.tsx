"use client";

import * as React from "react";

import type { FlagsSnapshot } from "@/lib/feature-flags";

/**
 * Client-side companion to `feature-flags`. Pair with `defineFlags` /
 * `isEnabled` on the server: compute the snapshot in a server component
 * and pass it down via `<FlagsProvider value={snapshot}>`.
 *
 *   // app/layout.tsx (server component)
 *   import { FlagsProvider } from "@/components/flags-provider";
 *
 *   const snapshot = await flags.snapshotFor(user);
 *   return <FlagsProvider value={snapshot}>{children}</FlagsProvider>;
 *
 *   // any client component:
 *   const enabled = useFlag("newPricing");
 *
 * Server-only `isEnabled(...)` calls do NOT need a provider — they read
 * env + the evaluate() callback directly.
 */

const FlagsContext = React.createContext<FlagsSnapshot>({});

export function FlagsProvider({
  value,
  children,
}: {
  value: FlagsSnapshot;
  children: React.ReactNode;
}) {
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

/** Read a flag in a client component. Returns false if the flag isn't in the snapshot. */
export function useFlag(key: string): boolean {
  const snap = React.useContext(FlagsContext);
  return Boolean(snap[key]);
}
