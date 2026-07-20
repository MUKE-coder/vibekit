"use client";

import * as React from "react";
import { Lock, LockOpen, Unlock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChannel } from "@/hooks/use-channel";

/**
 * "X is editing this record" — a soft collaborative lock for resources
 * that don't want simultaneous edits (invoices, settings pages, configs).
 *
 *   const { state, acquire, release, takeover, holder } = useCollaborativeLock(
 *     `invoice:${id}`,
 *     { me: { id: user.id, name: user.name } },
 *   );
 *
 *   if (state === "locked-by-other") return (
 *     <LockBanner holder={holder} onTakeOver={takeover} />
 *   );
 *
 *   <Button onClick={acquire}>Edit</Button>
 *
 * Wire-shape on the channel:
 *   event: "lock.acquired" | "lock.released" | "lock.heartbeat"
 *   data:  { holder: { id, name?, image? }, expiresAt: ISO string }
 *
 * Server-side: the channel-broadcast endpoint should also persist the
 * lock (Redis SET with TTL keyed by resource) so refresh / new clients
 * see the same state on first load. The hook handles client-side
 * heartbeat + expiry; the server is the authority on conflict.
 */

interface LockHolder {
  id: string;
  name?: string | null;
  image?: string | null;
}

type LockState = "unlocked" | "locked-by-me" | "locked-by-other";

interface UseCollaborativeLockOptions {
  me: LockHolder | null;
  /** Heartbeat interval ms. Default: 10000. */
  heartbeatMs?: number;
  /** Lock TTL ms (held forwards from each heartbeat). Default: 30000. */
  ttlMs?: number;
}

export function useCollaborativeLock(channelName: string, options: UseCollaborativeLockOptions) {
  const { me, heartbeatMs = 10_000, ttlMs = 30_000 } = options;
  const channel = useChannel(channelName);

  const [holder, setHolder] = React.useState<LockHolder | null>(null);
  const [expiresAt, setExpiresAt] = React.useState<number>(0);
  const heartbeat = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Subscribe to lock events
  React.useEffect(() => {
    const offAcquired = channel.subscribe<{ holder: LockHolder; expiresAt: string }>("lock.acquired", (data) => {
      setHolder(data.holder);
      setExpiresAt(new Date(data.expiresAt).getTime());
    });
    const offReleased = channel.subscribe<{ holder: LockHolder }>("lock.released", () => {
      setHolder(null);
      setExpiresAt(0);
    });
    const offHeartbeat = channel.subscribe<{ holder: LockHolder; expiresAt: string }>("lock.heartbeat", (data) => {
      setHolder(data.holder);
      setExpiresAt(new Date(data.expiresAt).getTime());
    });
    return () => {
      offAcquired();
      offReleased();
      offHeartbeat();
    };
  }, [channel]);

  // Expire stale locks client-side (the holder went away)
  React.useEffect(() => {
    if (expiresAt === 0) return;
    const wait = expiresAt - Date.now();
    if (wait <= 0) {
      setHolder(null);
      setExpiresAt(0);
      return;
    }
    const id = setTimeout(() => {
      setHolder(null);
      setExpiresAt(0);
    }, wait);
    return () => clearTimeout(id);
  }, [expiresAt]);

  const state: LockState = !holder ? "unlocked" : me && holder.id === me.id ? "locked-by-me" : "locked-by-other";

  const acquire = React.useCallback(async () => {
    if (!me) return;
    const newExpiry = new Date(Date.now() + ttlMs).toISOString();
    await channel.publish("lock.acquired", { holder: me, expiresAt: newExpiry });
    // Start heartbeat
    if (heartbeat.current) clearInterval(heartbeat.current);
    heartbeat.current = setInterval(() => {
      void channel.publish("lock.heartbeat", { holder: me, expiresAt: new Date(Date.now() + ttlMs).toISOString() });
    }, heartbeatMs);
  }, [me, channel, ttlMs, heartbeatMs]);

  const release = React.useCallback(async () => {
    if (!me) return;
    if (heartbeat.current) {
      clearInterval(heartbeat.current);
      heartbeat.current = null;
    }
    await channel.publish("lock.released", { holder: me });
  }, [me, channel]);

  // The "take over" path — for the rare case where the lock holder is unreachable
  // (closed tab without releasing). Acquiring blasts a new acquired event that wins.
  const takeover = React.useCallback(async () => {
    await acquire();
  }, [acquire]);

  // Release on unmount (page navigation, tab close).
  // WHY the refs + empty deps: callers pass `me` as an inline object, so with
  // [state, channel, me] the cleanup ran on EVERY render while the lock was
  // held — clearing the heartbeat and publishing "lock.released" one render
  // after acquiring it. This must fire on real unmount only, so it reads the
  // latest state/me/channel from refs instead of depending on them.
  const stateRef = React.useRef(state);
  stateRef.current = state;
  const meRef = React.useRef(me);
  meRef.current = me;
  const channelRef = React.useRef(channel);
  channelRef.current = channel;

  React.useEffect(() => {
    return () => {
      if (heartbeat.current) {
        clearInterval(heartbeat.current);
        heartbeat.current = null;
      }
      if (stateRef.current === "locked-by-me") {
        void channelRef.current.publish("lock.released", { holder: meRef.current });
      }
    };
  }, []);

  return { state, holder, acquire, release, takeover };
}

/* ─────────── Drop-in banner UI ─────────── */

interface LockBannerProps {
  holder: LockHolder | null;
  /** Show a Take-over button (admins / opt-in). */
  onTakeOver?: () => void;
  className?: string;
}

export function LockBanner({ holder, onTakeOver, className }: LockBannerProps) {
  if (!holder) return null;
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
        className,
      )}
    >
      <Lock className="h-4 w-4 shrink-0" aria-hidden />
      <span className="flex-1">
        <strong>{holder.name ?? "Someone"}</strong> is currently editing — changes are read-only until they release.
      </span>
      {onTakeOver ? (
        <Button size="sm" variant="outline" onClick={onTakeOver}>
          <Unlock className="mr-1.5 h-3.5 w-3.5" /> Take over
        </Button>
      ) : null}
    </div>
  );
}

/** Tiny status icon — for sidebars, breadcrumbs, anywhere you can't fit a banner. */
export function LockBadge({ state, className }: { state: LockState; className?: string }) {
  if (state === "unlocked") return null;
  const Icon = state === "locked-by-me" ? LockOpen : Lock;
  const tone = state === "locked-by-me" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";
  return <Icon className={cn("h-3.5 w-3.5", tone, className)} aria-hidden />;
}
