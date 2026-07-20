"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

/**
 * ⌘K-style global search across multiple entities. Different from
 * `command-palette` (which is action-oriented) — this one fetches LIVE
 * results from your API and lets the user jump straight to any record.
 *
 *   <GlobalSearch
 *     fetchResults={async (q) => {
 *       const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
 *       return res.json();
 *     }}
 *     onSelect={(r) => router.push(r.href)}
 *   />
 *
 * `fetchResults` returns `Result[]`, where each result has `id`, `label`,
 * `group` (e.g. "Invoices", "Contacts"), `href`, and optional `description`
 * + `icon`. The component groups results in the palette by `group`.
 *
 * Triggers on ⌘K / Ctrl+K globally. Pair with `<SearchInput shortcut="⌘K"
 * onFocus={openPalette} />` in your topbar for an explicit affordance.
 */

export interface SearchResult {
  id: string;
  label: string;
  group: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  /** Optional keywords for the underlying cmdk filter. Joined into the value string. */
  keywords?: string[];
}

interface GlobalSearchProps {
  /** Async loader. Called whenever the debounced query changes. */
  fetchResults: (query: string) => Promise<SearchResult[]>;
  /** Override the default navigation behaviour (router.push to result.href). */
  onSelect?: (result: SearchResult) => void;
  /** Debounce window in ms. Default: 200. */
  delay?: number;
  /** Minimum chars before fetching. Default: 1. */
  minLength?: number;
  /** Placeholder. Default: "Search anything…". */
  placeholder?: string;
  /** Show / hide the global ⌘K shortcut. Default: true. */
  withShortcut?: boolean;
  /** Recent-items localStorage key. Pass null to disable. Default: "global-search:recent". */
  recentKey?: string | null;
  /** Max number of recents to remember. Default: 5. */
  recentLimit?: number;
}

export function GlobalSearch({
  fetchResults,
  onSelect,
  delay = 200,
  minLength = 1,
  placeholder = "Search anything…",
  withShortcut = true,
  recentKey = "global-search:recent",
  recentLimit = 5,
}: GlobalSearchProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const debounced = useDebounce(query, delay);
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [recents, setRecents] = React.useState<SearchResult[]>([]);

  // Global ⌘K shortcut
  useKeyboardShortcuts(
    withShortcut
      ? { "mod+k": { handler: () => setOpen((v) => !v), allowInInputs: true } }
      : {},
  );

  // Hydrate recents after mount
  React.useEffect(() => {
    if (!recentKey || typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(recentKey);
      if (raw) setRecents(JSON.parse(raw) as SearchResult[]);
    } catch {
      /* ignore */
    }
  }, [recentKey]);

  // Fetch results on debounced query
  React.useEffect(() => {
    if (debounced.length < minLength) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const res = await fetchResults(debounced);
        if (!cancelled) setResults(res);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced, fetchResults, minLength]);

  // Reset query when palette closes
  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function rememberRecent(result: SearchResult) {
    if (!recentKey || typeof window === "undefined") return;
    const next = [result, ...recents.filter((r) => r.id !== result.id)].slice(0, recentLimit);
    setRecents(next);
    try {
      window.localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function handleSelect(result: SearchResult) {
    rememberRecent(result);
    setOpen(false);
    if (onSelect) onSelect(result);
    else router.push(result.href);
  }

  // Group results
  const grouped = React.useMemo(() => {
    const map = new Map<string, SearchResult[]>();
    for (const r of results) {
      const list = map.get(r.group) ?? [];
      list.push(r);
      map.set(r.group, list);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    // shouldFilter={false}: results are ALREADY filtered by the server. cmdk's
    // default client-side filter would then re-filter them by literal substring
    // and hide legitimate matches (fuzzy/synonym/typo-tolerant hits, matches on
    // fields not rendered in the item text).
    //
    // NOTE: shadcn's stock <CommandDialog> spreads its props onto <Dialog>, not
    // <Command>. If yours does that, forward it in components/ui/command.tsx:
    //   function CommandDialog({ shouldFilter, ...props }) → <Command shouldFilter={shouldFilter}>
    <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
      <CommandInput
        placeholder={placeholder}
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Loading hint */}
        {loading ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            <Search className="mx-auto mb-2 h-4 w-4 animate-pulse" aria-hidden />
            Searching…
          </div>
        ) : null}

        {/* Empty state when there's a query but no results */}
        {!loading && debounced.length >= minLength && results.length === 0 ? (
          <CommandEmpty>No results for "{debounced}".</CommandEmpty>
        ) : null}

        {/* Recents — only when no query is active */}
        {!loading && query.length === 0 && recents.length > 0 ? (
          <CommandGroup heading="Recent">
            {recents.map((r) => (
              <CommandItem
                key={`recent-${r.id}`}
                value={`${r.label} ${r.keywords?.join(" ") ?? ""}`}
                onSelect={() => handleSelect(r)}
              >
                {r.icon ? <span className="mr-2 text-muted-foreground">{r.icon}</span> : null}
                <span className="flex-1">{r.label}</span>
                <span className="text-xs text-muted-foreground">{r.group}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ) : null}

        {/* Live results grouped by entity */}
        {grouped.map(([group, items], i) => (
          <React.Fragment key={group}>
            {i > 0 ? <CommandSeparator /> : null}
            <CommandGroup heading={group}>
              {items.map((r) => (
                <CommandItem
                  key={r.id}
                  value={`${r.label} ${r.description ?? ""} ${r.keywords?.join(" ") ?? ""}`}
                  onSelect={() => handleSelect(r)}
                >
                  {r.icon ? <span className="mr-2 text-muted-foreground">{r.icon}</span> : null}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{r.label}</span>
                    {r.description ? (
                      <span className="truncate text-xs text-muted-foreground">{r.description}</span>
                    ) : null}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </React.Fragment>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
