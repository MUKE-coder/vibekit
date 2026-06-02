"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Silent session refresh manager. Two responsibilities:
 *
 * 1. **Periodic refresh** — pings `/api/auth/get-session` on an interval
 *    (default: every 4 minutes) and invalidates the React Query cache so
 *    `useCurrentUser` re-pulls the fresh user.
 * 2. **Cross-tab broadcast** — listens on a BroadcastChannel so a
 *    sign-in / sign-out / role-change in one tab updates every other
 *    open tab without a page reload.
 *
 *   // In a top-level client provider:
 *   useSessionRefresh();
 *
 *   // Anywhere else (after sign-in, sign-out, role change):
 *   broadcastSessionChange("signed-in");
 *
 * Skips entirely on screens that aren't visible (no point burning a
 * fetch on a backgrounded tab).
 */

const CHANNEL_NAME = "vibekit-session";
const DEFAULT_INTERVAL = 4 * 60 * 1000; // 4 minutes

type SessionEvent =
  | { type: "signed-in" }
  | { type: "signed-out" }
  | { type: "role-changed" }
  | { type: "refresh" };

interface UseSessionRefreshOptions {
  /** Polling interval in ms. Default: 240000 (4 min). Pass 0 to disable. */
  intervalMs?: number;
  /** Override the endpoint. Default: "/api/auth/get-session". */
  endpoint?: string;
}

export function useSessionRefresh(options: UseSessionRefreshOptions = {}) {
  const { intervalMs = DEFAULT_INTERVAL, endpoint = "/api/auth/get-session" } = options;
  const qc = useQueryClient();
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    const invalidate = () => {
      qc.invalidateQueries({ queryKey: ["session"] });
    };

    channel.onmessage = (event: MessageEvent<SessionEvent>) => {
      // Anything that affects the session triggers a re-fetch
      invalidate();
    };

    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, [qc]);

  useEffect(() => {
    if (intervalMs <= 0) return;
    if (typeof window === "undefined") return;

    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        await fetch(endpoint, { credentials: "include", cache: "no-store" });
        qc.invalidateQueries({ queryKey: ["session"] });
      } catch {
        // Best-effort — silent failure
      }
    };

    const id = setInterval(tick, intervalMs);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [intervalMs, endpoint, qc]);
}

/** Notify every open tab that the session changed. Call after sign-in / sign-out / role change. */
export function broadcastSessionChange(type: SessionEvent["type"] = "refresh") {
  if (typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;
  const channel = new BroadcastChannel(CHANNEL_NAME);
  channel.postMessage({ type } satisfies SessionEvent);
  channel.close();
}
