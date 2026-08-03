"use client";

import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { components, categories, type ComponentCategory } from "@/lib/components-data";
import { cn } from "@/lib/utils";

export function ComponentsBrowser() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<ComponentCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return components.filter((c) => {
      const matchesCategory = active === "all" || c.category === active;
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.features.some((f) => f.toLowerCase().includes(q));
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
          placeholder="Search components, features, integrations..."
          className="w-full bg-transparent font-mono text-[14px] text-[color:var(--text-primary)] placeholder:text-[color:var(--text-tertiary)] focus:outline-none"
          aria-label="Search components"
        />
        <kbd className="hidden font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)] sm:inline">
          {filtered.length} / {components.length}
        </kbd>
      </div>

      {/* Category filter */}
      <div className="reveal mt-5 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setActive(cat.value)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors",
              active === cat.value
                ? "border-[color:var(--text-primary)] bg-[color:var(--text-primary)] text-[color:var(--text-inverse)]"
                : "border-[color:var(--border)] bg-[color:var(--bg-elevated)] text-[color:var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="reveal mt-10 rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-12 text-center">
          <p className="font-mono text-[12px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
            No components match
          </p>
          <p className="mt-2 text-[15px] text-[color:var(--text-secondary)]">
            Try clearing your search or selecting a different category.
          </p>
        </div>
      ) : (
        <div className="reveal mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/components/${c.slug}`}
              className="group flex flex-col rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
                  {c.categoryLabel}
                </span>
                <ArrowUpRight className="h-4 w-4 text-[color:var(--text-tertiary)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--text-primary)]" />
              </div>
              <h3 className="mt-3 font-mono text-[15px] font-medium uppercase tracking-tight text-[color:var(--text-primary)]">
                {c.name}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--text-secondary)]">
                {c.tagline}
              </p>
              {c.envVars && c.envVars.length > 0 ? (
                <div className="mt-4 flex items-center gap-2 text-[11px] text-[color:var(--text-tertiary)]">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                  <span className="font-mono uppercase tracking-wider">{c.envVars.length} env vars</span>
                </div>
              ) : (
                <div className="mt-4 flex items-center gap-2 text-[11px] text-[color:var(--text-tertiary)]">
                  <span className="h-1 w-1 rounded-full bg-[color:var(--text-tertiary)]" />
                  <span className="font-mono uppercase tracking-wider">No env required</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
