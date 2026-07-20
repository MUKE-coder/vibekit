"use client";

import * as React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, BellOff, Check, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Topbar notification bell. Polls (or wire your own pub/sub) for the
 * current user's in-app notifications, renders the unread count as a
 * badge, and shows the latest items in a popover with "mark all as
 * read".
 *
 *   <NotificationBell
 *     loadNotifications={async () => fetch("/api/notifications").then(r => r.json())}
 *     markRead={async (id) => { await fetch(`/api/notifications/${id}/read`, { method: "POST" }); }}
 *     markAllRead={async () => { await fetch("/api/notifications/read-all", { method: "POST" }); }}
 *     pollMs={30_000}
 *   />
 *
 * Expected notification shape:
 *
 *   {
 *     id: string,
 *     title: string,
 *     body?: string | null,
 *     href?: string | null,
 *     readAt?: string | null,
 *     createdAt: string,
 *   }
 *
 * Pair with `useChannel`-based realtime push so new items appear
 * instantly — call `invalidateQueries(["notifications"])` whenever the
 * channel fires a `notification.created` event.
 */

export interface Notification {
  id: string;
  title: string;
  body?: string | null;
  href?: string | null;
  readAt?: string | null;
  createdAt: string;
}

interface NotificationBellProps {
  loadNotifications: () => Promise<Notification[]>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  /** Refetch interval. Default: 60_000. Pass 0 to disable polling. */
  pollMs?: number;
  className?: string;
}

export function NotificationBell({
  loadNotifications,
  markRead,
  markAllRead,
  pollMs = 60_000,
  className,
}: NotificationBellProps) {
  const qc = useQueryClient();
  const queryKey = ["notifications"] as const;
  const [open, setOpen] = React.useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    queryFn: loadNotifications,
    refetchInterval: pollMs > 0 ? pollMs : false,
    refetchOnWindowFocus: true,
  });

  const unread = items.filter((n) => !n.readAt);

  const readOne = useMutation({
    mutationFn: markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  const readAll = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`${unread.length} unread notifications`}
          className={cn("relative h-9 w-9", className)}
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unread.length > 0 ? (
            <span className="absolute right-1 top-1 grid h-4 min-w-[1rem] place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
              {unread.length > 9 ? "9+" : unread.length}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-sm font-medium">Notifications</span>
          {unread.length > 0 ? (
            <button
              type="button"
              onClick={() => readAll.mutate()}
              disabled={readAll.isPending}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {readAll.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Mark all read
            </button>
          ) : null}
        </div>

        <ul className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <li className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            </li>
          ) : items.length === 0 ? (
            <li className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <BellOff className="h-6 w-6" aria-hidden />
              <span className="text-sm">You&apos;re all caught up.</span>
            </li>
          ) : (
            items.map((n) => {
              const onActivate = () => {
                if (!n.readAt) readOne.mutate(n.id);
                setOpen(false);
              };
              const rowClass = "flex items-start gap-2 px-3 py-2 text-sm hover:bg-muted";
              const rowBody = (
                <>
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.readAt ? "bg-transparent" : "bg-primary",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">{n.title}</span>
                    {n.body ? (
                      <span className="block truncate text-xs text-muted-foreground">{n.body}</span>
                    ) : null}
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wide text-muted-foreground">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </span>
                </>
              );
              return (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-border/60 last:border-b-0",
                    !n.readAt && "bg-primary/5",
                  )}
                >
                  {/* Branch on the element rather than picking a dynamic
                      `Wrapper` component: <Link> requires `href`, and a
                      `Link | "div"` union widens it back to optional. */}
                  {n.href ? (
                    <Link href={n.href} onClick={onActivate} className={rowClass}>
                      {rowBody}
                    </Link>
                  ) : (
                    <div onClick={onActivate} className={rowClass}>
                      {rowBody}
                    </div>
                  )}
                </li>
              );
            })
          )}
        </ul>

        <div className="border-t border-border px-3 py-2 text-center">
          <Link href="/notifications" className="text-xs text-muted-foreground hover:text-foreground">
            See all notifications
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
