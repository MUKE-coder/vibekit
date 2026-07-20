"use client";

import * as React from "react";
import { Loader2, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Extends the native input attributes rather than `ComponentProps<typeof Input>`:
// shadcn's <Input> accepts every native input prop, and depending on the local
// Input's declaration (some carry an index signature) `Omit` can collapse the
// named props to `unknown`, silently untyping every destructured prop below.
interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Show a spinner inside the input. Pass `true` while fetching. */
  loading?: boolean;
  /** Show a clear (X) button when the value is non-empty. */
  clearable?: boolean;
  /** Called when the user clicks the clear button. */
  onClear?: () => void;
  /** Show a keyboard hint badge (e.g. ⌘K). */
  shortcut?: string;
  /** Controls the prefixed Search icon. Default: true. */
  showIcon?: boolean;
}

/**
 * Standardised search box with a leading icon, optional spinner, clear
 * button, and a keyboard-shortcut hint slot. Pure UI — pair with your
 * own debounced state or `useDebouncedQuery` for the fetch.
 *
 *   <SearchInput
 *     value={input}
 *     onChange={(e) => setInput(e.target.value)}
 *     loading={query.isFetching}
 *     onClear={() => setInput("")}
 *     placeholder="Search invoices…"
 *     shortcut="⌘K"
 *   />
 */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ loading, clearable = true, onClear, shortcut, showIcon = true, className, value, onChange, ...props }, ref) => {
    const hasValue = typeof value === "string" ? value.length > 0 : false;
    return (
      <div className={cn("relative w-full", className)}>
        {showIcon ? (
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
        ) : null}
        <Input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          {...props}
          className={cn(showIcon && "pl-9", (loading || (clearable && hasValue) || shortcut) && "pr-10")}
        />
        <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
          ) : clearable && hasValue ? (
            <button
              type="button"
              onClick={onClear}
              className="pointer-events-auto rounded-sm p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : shortcut ? (
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
              {shortcut}
            </kbd>
          ) : null}
        </div>
      </div>
    );
  },
);
SearchInput.displayName = "SearchInput";
