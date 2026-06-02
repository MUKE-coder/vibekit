"use client";

import * as React from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  /** Rendered on the server and during the first client render. Default: null. */
  fallback?: React.ReactNode;
}

/**
 * Defers rendering of `children` until after mount on the client. Use it to
 * dodge hydration mismatches when a child reads from window / localStorage /
 * navigator / Date.now() / Math.random() — anything whose server snapshot
 * can't match the client.
 *
 *   <ClientOnly fallback={<Skeleton />}>
 *     <SomethingThatReadsLocalStorage />
 *   </ClientOnly>
 *
 * The fallback renders on the server AND on the first client render to keep
 * the two HTML trees in sync; the real children take over after mount.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  return <>{mounted ? children : fallback}</>;
}
