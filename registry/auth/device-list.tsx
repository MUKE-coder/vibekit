"use client";

import * as React from "react";
import { Laptop, Loader2, Monitor, Smartphone, Tablet, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Active-session manager. Lists every session the current user has open
 * (device, location, last-active) and lets them revoke individual ones
 * or sign out everywhere else. Pair with Better Auth's session API (or
 * your own).
 *
 *   <DeviceList
 *     loadSessions={async () => (await fetch("/api/auth/sessions", { credentials: "include" })).json()}
 *     revokeSession={async (id) => { await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" }); }}
 *     revokeOthers={async () => { await fetch("/api/auth/sessions/others", { method: "DELETE" }); }}
 *   />
 *
 * Expected session shape:
 *
 *   {
 *     id: "sess_abc",
 *     userAgent: "Mozilla/5.0 (Macintosh; …) Safari/…",
 *     ipAddress: "192.0.2.10",
 *     location: "Kampala, Uganda",          // optional, derived from IP
 *     lastActiveAt: "2026-05-18T09:30:00Z",
 *     isCurrent: true                       // marks "this session"
 *   }
 *
 * Detects device class from userAgent for the icon (Phone / Tablet /
 * Laptop / Monitor). For sessions older than 30 days the row is greyed.
 */

export interface DeviceSession {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  location?: string | null;
  lastActiveAt: string | Date;
  isCurrent?: boolean;
}

interface DeviceListProps {
  loadSessions: () => Promise<DeviceSession[]>;
  revokeSession: (id: string) => Promise<void>;
  /** Optional bulk action. If provided, a "Sign out everywhere else" button is shown. */
  revokeOthers?: () => Promise<void>;
  className?: string;
}

export function DeviceList({ loadSessions, revokeSession, revokeOthers, className }: DeviceListProps) {
  const qc = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ["device-list"],
    queryFn: loadSessions,
  });

  const revokeOne = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["device-list"] }),
  });

  const revokeAllOthers = useMutation({
    mutationFn: async () => {
      if (revokeOthers) await revokeOthers();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["device-list"] }),
  });

  if (isLoading) {
    return (
      <div className={cn("grid place-items-center py-12", className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-hidden />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={cn("rounded-lg border border-border bg-card p-8 text-center text-sm text-muted-foreground", className)}>
        No active sessions.
      </div>
    );
  }

  const otherCount = sessions.filter((s) => !s.isCurrent).length;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">Devices & sessions</h2>
          <p className="text-sm text-muted-foreground">
            {sessions.length} active {sessions.length === 1 ? "session" : "sessions"}
            {otherCount > 0 ? ` · ${otherCount} other ${otherCount === 1 ? "device" : "devices"}` : ""}
          </p>
        </div>
        {revokeOthers && otherCount > 0 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => revokeAllOthers.mutate()}
            disabled={revokeAllOthers.isPending}
          >
            {revokeAllOthers.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : null}
            Sign out everywhere else
          </Button>
        ) : null}
      </div>

      <ul className="space-y-2">
        {sessions.map((session) => (
          <DeviceRow
            key={session.id}
            session={session}
            onRevoke={() => revokeOne.mutate(session.id)}
            isRevoking={revokeOne.isPending && revokeOne.variables === session.id}
          />
        ))}
      </ul>
    </div>
  );
}

function DeviceRow({
  session,
  onRevoke,
  isRevoking,
}: {
  session: DeviceSession;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const ua = session.userAgent ?? "";
  const Icon = iconFor(ua);
  const browser = browserName(ua);
  const os = osName(ua);
  const lastActive = typeof session.lastActiveAt === "string" ? new Date(session.lastActiveAt) : session.lastActiveAt;
  const isStale = Date.now() - lastActive.getTime() > 30 * 24 * 60 * 60 * 1000;

  return (
    <Card className={cn("flex items-center gap-4 px-4 py-3", isStale && "opacity-60")}>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-medium text-foreground">{browser || "Unknown browser"}</span>
          <span className="text-xs text-muted-foreground">on {os || "Unknown OS"}</span>
          {session.isCurrent ? (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
              This device
            </span>
          ) : null}
        </div>
        <div className="text-xs text-muted-foreground">
          {session.location ? `${session.location} · ` : ""}
          {session.ipAddress ? `${session.ipAddress} · ` : ""}
          Last active {formatDistanceToNow(lastActive, { addSuffix: true })}
        </div>
      </div>

      {!session.isCurrent ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRevoke}
          disabled={isRevoking}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Revoke session"
        >
          {isRevoking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </Button>
      ) : null}
    </Card>
  );
}

function iconFor(ua: string): React.ComponentType<{ className?: string }> {
  const u = ua.toLowerCase();
  if (/mobi|android|iphone|ipod/.test(u) && !/ipad/.test(u)) return Smartphone;
  if (/ipad|tablet/.test(u)) return Tablet;
  if (/mac|win|linux/.test(u) && !/mobi/.test(u)) return Laptop;
  return Monitor;
}

function browserName(ua: string): string {
  if (/edg/i.test(ua)) return "Edge";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/chrome/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "";
}

function osName(ua: string): string {
  if (/iphone/i.test(ua)) return "iOS";
  if (/ipad/i.test(ua)) return "iPadOS";
  if (/android/i.test(ua)) return "Android";
  if (/mac os/i.test(ua)) return "macOS";
  if (/windows nt/i.test(ua)) return "Windows";
  if (/linux/i.test(ua)) return "Linux";
  return "";
}
