"use client";

import * as React from "react";
import { format, isToday, isYesterday } from "date-fns";

import { cn } from "@/lib/utils";

/**
 * Vertical activity feed with date grouping. Different from
 * `alternating-timeline` (the marketing primitive) — this is the audit
 * / activity / comment-thread feed you see in a record detail page.
 *
 *   <ActivityTimeline
 *     entries={[
 *       { id: "1", at: "2026-05-18T09:30:00Z", actor: { name: "Alice", image: "/a.png" }, action: "created the invoice" },
 *       { id: "2", at: "2026-05-18T10:01:00Z", actor: { name: "Bob"   }, action: "added line item", detail: "Consulting · $1,200" },
 *       { id: "3", at: "2026-05-17T16:42:00Z", actor: { name: "Carla" }, action: "marked as paid", icon: <Check /> },
 *     ]}
 *   />
 *
 * Groups consecutive entries on the same calendar date under a sticky
 * "Today" / "Yesterday" / "May 17, 2026" header. The vertical rail
 * connects dots through the group. Each entry can supply a custom icon
 * (replaces the default avatar dot) or a `detail` slot for sub-content.
 */

export interface TimelineActor {
  id?: string;
  name: string;
  image?: string | null;
}

export interface ActivityEntry {
  id: string;
  /** ISO string or Date. */
  at: string | Date;
  actor?: TimelineActor;
  /** Short action verb-phrase ("created the invoice"). */
  action: React.ReactNode;
  /** Optional detail block under the headline. */
  detail?: React.ReactNode;
  /** Optional icon to display in the dot (replaces the avatar). */
  icon?: React.ReactNode;
}

interface ActivityTimelineProps {
  entries: ActivityEntry[];
  /** Show date-group headers ("Today" / "Yesterday" / date). Default: true. */
  withGroups?: boolean;
  /** Order. Default: "desc" (newest first). */
  order?: "asc" | "desc";
  className?: string;
}

function initialsOf(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function groupLabel(date: Date): string {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

export function ActivityTimeline({
  entries,
  withGroups = true,
  order = "desc",
  className,
}: ActivityTimelineProps) {
  const ordered = React.useMemo(() => {
    const arr = entries.map((e) => ({ ...e, _at: new Date(e.at) }));
    arr.sort((a, b) => (order === "desc" ? b._at.getTime() - a._at.getTime() : a._at.getTime() - b._at.getTime()));
    return arr;
  }, [entries, order]);

  // Group consecutive entries by date
  const groups = React.useMemo(() => {
    if (!withGroups) return [{ label: "", items: ordered }];
    const out: Array<{ label: string; items: typeof ordered }> = [];
    for (const entry of ordered) {
      const label = groupLabel(entry._at);
      const last = out[out.length - 1];
      if (last && last.label === label) last.items.push(entry);
      else out.push({ label, items: [entry] });
    }
    return out;
  }, [ordered, withGroups]);

  if (entries.length === 0) {
    return (
      <div className={cn("py-6 text-center text-sm text-muted-foreground", className)}>
        No activity yet.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {groups.map((group) => (
        <section key={group.label}>
          {withGroups ? (
            <div className="sticky top-0 z-10 mb-2 inline-block rounded-md bg-background/95 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground backdrop-blur">
              {group.label}
            </div>
          ) : null}

          <ol className="relative space-y-4 pl-8">
            {/* Vertical rail */}
            <span
              aria-hidden
              className="absolute left-3 top-1 bottom-1 w-px bg-border"
            />
            {group.items.map((entry) => (
              <li key={entry.id} className="relative">
                {/* Dot / avatar */}
                <span
                  aria-hidden
                  className="absolute -left-8 top-0.5 flex h-6 w-6 items-center justify-center"
                >
                  {entry.icon ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-foreground text-[10px] text-background">
                      {entry.icon}
                    </span>
                  ) : entry.actor?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.actor.image}
                      alt={entry.actor.name}
                      className="h-6 w-6 rounded-full border-2 border-background object-cover"
                    />
                  ) : entry.actor ? (
                    <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                      {initialsOf(entry.actor.name)}
                    </span>
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-foreground ring-2 ring-background" />
                  )}
                </span>

                <div className="space-y-1">
                  <p className="text-sm leading-snug text-foreground">
                    {entry.actor ? (
                      <span className="font-medium">{entry.actor.name}</span>
                    ) : null}{" "}
                    <span className={entry.actor ? "text-muted-foreground" : undefined}>
                      {entry.action}
                    </span>
                    <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                      {format(entry._at, "HH:mm")}
                    </span>
                  </p>
                  {entry.detail ? (
                    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-foreground">
                      {entry.detail}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
