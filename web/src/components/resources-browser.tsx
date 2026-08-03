"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  resources,
  resourceCategories,
  type ResourceCategory,
} from "@/lib/resources-data";
import { cn } from "@/lib/utils";

export function ResourcesBrowser() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ResourceCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      const matchesCategory = active === "all" || r.category === active;
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.categoryLabel.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        (r.author?.toLowerCase().includes(q) ?? false);
      return matchesCategory && matchesQuery;
    });
  }, [query, active]);

  return (
    <div>
      {/* Search bar */}
      <div className="reveal flex items-center gap-3 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-4 py-3 transition-colors focus-within:border-[color:var(--border-strong)]">
        <Search className="h-4 w-4 shrink-0 text-[color:var(--text-tertiary)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, description, tag, or author..."
          className="w-full bg-transparent font-mono text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
          aria-label="Search resources"
        />
        <kbd className="hidden font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)] sm:inline">
          {filtered.length} / {resources.length}
        </kbd>
      </div>

      {/* Category filter */}
      <div className="reveal mt-5 flex flex-wrap gap-2">
        {resourceCategories.map((cat) => {
          const count =
            cat.value === "all"
              ? resources.length
              : resources.filter((r) => r.category === cat.value).length;
          if (cat.value !== "all" && count === 0) return null;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setActive(cat.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
                active === cat.value
                  ? "border-[color:var(--text-primary)] bg-[color:var(--text-primary)] text-[color:var(--text-inverse)]"
                  : "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
              )}
            >
              {cat.label}
              <span
                className={cn(
                  "inline-block tabular-nums",
                  active === cat.value
                    ? "opacity-70"
                    : "text-[color:var(--text-tertiary)]"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="reveal mt-10 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-12 text-center">
          <p className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            No resources match
          </p>
          <p className="mt-2 text-[15px] text-[color:var(--text-secondary)]">
            Try clearing your search or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="reveal mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <a
              key={r.slug}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  {r.categoryLabel}
                </span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
              </div>
              <h3 className="mt-3 font-mono text-[14px] font-medium uppercase tracking-tight text-[color:var(--text-primary)]">
                {r.name}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
                {r.description}
              </p>

              {r.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1">
                  {r.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--text-tertiary)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {r.author ? (
                <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  by {r.author}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
