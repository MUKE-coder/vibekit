"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Cross-entity "recently viewed" history backed by localStorage. Each
 * entry has a stable key (`type:id`) so re-visiting an item bumps it to
 * the top instead of duplicating.
 *
 * Register a view from anywhere:
 *
 *   const track = useRecentlyViewedRecorder();
 *
 *   useEffect(() => {
 *     track({ type: "post", id: post.id, label: post.title, href: `/posts/${post.slug}` });
 *   }, [post.id]);
 *
 * Render the panel (e.g. in a sidebar or under ⌘K):
 *
 *   <RecentlyViewed
 *     limit={8}
 *     renderIcon={(item) => <Tag type={item.type} />}
 *   />
 *
 * The store survives reloads, is capped (default 20 entries), and
 * dedupes by `type:id`.
 */

export interface RecentItem {
  type: string;
  id: string | number;
  label: string;
  href: string;
  /** Optional secondary line, e.g. category or workspace name. */
  hint?: string;
  /** Optional ISO timestamp — populated automatically when not provided. */
  viewedAt?: string;
}

const STORAGE_KEY = "vibekit.recently-viewed";
const MAX_ENTRIES = 20;
const EVENT_NAME = "vibekit:recently-viewed-changed";

function readStore(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStore(items: RecentItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

function keyOf(item: Pick<RecentItem, "type" | "id">): string {
  return `${item.type}:${item.id}`;
}

/** Imperative recorder — call inside an effect on the page being viewed. */
export function useRecentlyViewedRecorder() {
  return React.useCallback((item: RecentItem) => {
    const list = readStore();
    const k = keyOf(item);
    const filtered = list.filter((entry) => keyOf(entry) !== k);
    filtered.unshift({ ...item, viewedAt: item.viewedAt ?? new Date().toISOString() });
    writeStore(filtered.slice(0, MAX_ENTRIES));
  }, []);
}

/** Read-only access — re-renders whenever the store changes (this tab or another). */
export function useRecentlyViewed(): {
  items: RecentItem[];
  remove: (item: Pick<RecentItem, "type" | "id">) => void;
  clear: () => void;
} {
  const [items, setItems] = React.useState<RecentItem[]>([]);

  React.useEffect(() => {
    setItems(readStore());
    const refresh = () => setItems(readStore());
    window.addEventListener(EVENT_NAME, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(EVENT_NAME, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const remove = React.useCallback((item: Pick<RecentItem, "type" | "id">) => {
    const k = keyOf(item);
    writeStore(readStore().filter((entry) => keyOf(entry) !== k));
  }, []);

  const clear = React.useCallback(() => writeStore([]), []);

  return { items, remove, clear };
}

interface RecentlyViewedProps {
  /** Cap the number rendered (default 8). */
  limit?: number;
  /** Filter to a subset of entity types. */
  types?: string[];
  /** Custom icon renderer per item. */
  renderIcon?: (item: RecentItem) => React.ReactNode;
  /** Title rendered above the list. Pass null to hide. */
  title?: React.ReactNode;
  className?: string;
}

export function RecentlyViewed({
  limit = 8,
  types,
  renderIcon,
  title = "Recently viewed",
  className,
}: RecentlyViewedProps) {
  const { items, remove, clear } = useRecentlyViewed();
  const filtered = (types ? items.filter((i) => types.includes(i.type)) : items).slice(0, limit);

  if (filtered.length === 0) {
    return (
      <div className={cn("text-xs text-muted-foreground", className)}>
        {title ? <div className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          <span>{title}</span>
        </div> : null}
        Nothing here yet — items you open will appear here.
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {title ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            <span>{title}</span>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
        </div>
      ) : null}
      <ul className="space-y-0.5">
        {filtered.map((item) => (
          <li key={keyOf(item)} className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-muted">
            <Link href={item.href} className="flex min-w-0 flex-1 items-center gap-2">
              {renderIcon ? (
                <span className="shrink-0 text-muted-foreground">{renderIcon(item)}</span>
              ) : (
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-sm bg-muted text-[10px] font-medium uppercase text-muted-foreground">
                  {item.type.slice(0, 2)}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">{item.label}</div>
                {item.hint ? <div className="truncate text-[11px] text-muted-foreground">{item.hint}</div> : null}
              </div>
            </Link>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => remove(item)}
              className="h-6 w-6 opacity-0 transition group-hover:opacity-100"
              aria-label="Remove from recently viewed"
            >
              <X className="h-3 w-3" aria-hidden />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
