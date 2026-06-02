"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

/**
 * "Who's looking at this record right now?" — Upstash-Redis-backed
 * presence. Pair with two trivial API routes you supply:
 *
 *   POST /api/presence/heartbeat → upserts `<channel>:<userId>` with a TTL
 *   GET  /api/presence?channel=… → returns the active members
 *
 *   const { users, isLoading } = usePresence({ channel: `invoice:${id}`, me: { id: user.id, name: user.name } });
 *
 *   <AvatarGroup max={4}>
 *     {users.map(u => <Avatar key={u.id} name={u.name} src={u.image} />)}
 *   </AvatarGroup>
 *
 * The hook beats the heartbeat endpoint every `heartbeatMs` (default
 * 15s) AND when the tab regains focus, then polls the members endpoint
 * every `pollMs` (default 5s) for updates. For instant updates, wire
 * presence events into your existing SSE channel and skip polling
 * (`enablePolling: false`).
 *
 * SERVER ROUTE SKETCHES (your impl details — Redis key pattern below):
 *
 *   // POST /api/presence/heartbeat
 *   const ttl = 30; // seconds — should be 2x heartbeatMs
 *   await redis.set(`presence:${channel}:${me.id}`, JSON.stringify(me), { ex: ttl });
 *
 *   // GET /api/presence?channel=...
 *   const keys = await redis.keys(`presence:${channel}:*`);
 *   const values = keys.length > 0 ? await redis.mget(...keys) : [];
 *   return NextResponse.json({ users: values.filter(Boolean).map(JSON.parse) });
 */

export interface PresenceUser {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface UsePresenceOptions {
  /** Unique channel id (e.g. `invoice:${id}`). */
  channel: string;
  /** This user — sent on every heartbeat. Pass `null` to observe without joining. */
  me: PresenceUser | null;
  /** Heartbeat endpoint. Default: "/api/presence/heartbeat". */
  heartbeatEndpoint?: string;
  /** Members endpoint. Default: "/api/presence". */
  membersEndpoint?: string;
  /** Heartbeat interval (ms). Default: 15000. */
  heartbeatMs?: number;
  /** Member-list poll interval (ms). Default: 5000. */
  pollMs?: number;
  /** Disable polling — use this if you push presence over SSE/WebSocket. */
  enablePolling?: boolean;
}

export function usePresence(options: UsePresenceOptions) {
  const {
    channel,
    me,
    heartbeatEndpoint = "/api/presence/heartbeat",
    membersEndpoint = "/api/presence",
    heartbeatMs = 15_000,
    pollMs = 5_000,
    enablePolling = true,
  } = options;

  // Heartbeat — fires immediately on mount, then on an interval, and on focus
  useEffect(() => {
    if (!me) return;

    let id: ReturnType<typeof setInterval> | null = null;

    async function beat() {
      try {
        await fetch(heartbeatEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel, me }),
        });
      } catch {
        /* presence is best-effort */
      }
    }

    function onVisibility() {
      if (document.visibilityState === "visible") void beat();
    }

    void beat();
    id = setInterval(beat, heartbeatMs);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (id) clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [channel, me, heartbeatEndpoint, heartbeatMs]);

  // Member list — React Query so it integrates with the rest of the cache
  const [now, setNow] = useState(0);
  useEffect(() => {
    if (!enablePolling) return;
    const id = setInterval(() => setNow((n) => n + 1), pollMs);
    return () => clearInterval(id);
  }, [enablePolling, pollMs]);

  const { data, isLoading } = useQuery({
    queryKey: ["presence", channel, now],
    queryFn: async () => {
      const res = await fetch(
        `${membersEndpoint}?channel=${encodeURIComponent(channel)}`,
        { credentials: "include" },
      );
      if (!res.ok) return { users: [] as PresenceUser[] };
      return res.json() as Promise<{ users: PresenceUser[] }>;
    },
    staleTime: pollMs,
  });

  const users = data?.users ?? [];
  // Filter "me" out for the typical "X others are viewing" UI
  const others = me ? users.filter((u) => u.id !== me.id) : users;

  return { users, others, isLoading };
}
