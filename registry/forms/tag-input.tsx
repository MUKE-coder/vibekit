"use client";

import * as React from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Tag chip input. Type → Enter / Tab / comma to commit a tag, Backspace
 * on empty input removes the previous one. Optional suggestion list,
 * optional dedupe + normaliser, max-tag cap, and a `validate(tag)`
 * hook for things like "email tags only".
 *
 *   <TagInput
 *     value={tags}
 *     onChange={setTags}
 *     placeholder="Add tag…"
 *     suggestions={["urgent", "design", "engineering"]}
 *     validate={(t) => t.length >= 2 ? null : "Min 2 characters"}
 *     max={10}
 *   />
 *
 * Pair with RHF: wrap inside a `FormField` and render `<TagInput value={field.value ?? []} onChange={field.onChange} />`.
 */

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** Filter suggestions match the current input. */
  suggestions?: string[];
  /** Return an error string (or null when valid). */
  validate?: (tag: string) => string | null;
  /** Normalise tags as they're added (e.g. `.toLowerCase()`). */
  normalize?: (tag: string) => string;
  /** Maximum number of tags. */
  max?: number;
  /** Disable removal of these tags (locked-in defaults). */
  readOnlyTags?: string[];
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add tag…",
  suggestions,
  validate,
  normalize = (t) => t.trim(),
  max,
  readOnlyTags = [],
  disabled,
  className,
  id,
}: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredSuggestions = React.useMemo(() => {
    if (!suggestions) return [];
    const q = draft.toLowerCase();
    return suggestions
      .filter((s) => !value.includes(s) && (q === "" || s.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [suggestions, draft, value]);

  function commit(raw: string): void {
    const tag = normalize(raw);
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    if (max !== undefined && value.length >= max) {
      setError(`Maximum ${max} tags`);
      return;
    }
    if (validate) {
      const err = validate(tag);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    onChange([...value, tag]);
    setDraft("");
    setHoverIndex(0);
  }

  function remove(tag: string): void {
    if (readOnlyTags.includes(tag)) return;
    onChange(value.filter((t) => t !== tag));
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter" || e.key === "Tab" || e.key === ",") {
      if (draft.trim()) {
        e.preventDefault();
        commit(filteredSuggestions[hoverIndex] ?? draft);
      }
    } else if (e.key === "Backspace" && draft === "" && value.length > 0) {
      const last = value[value.length - 1];
      if (!readOnlyTags.includes(last)) {
        onChange(value.slice(0, -1));
      }
    } else if (e.key === "ArrowDown" && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHoverIndex((i) => Math.min(i + 1, filteredSuggestions.length - 1));
    } else if (e.key === "ArrowUp" && filteredSuggestions.length > 0) {
      e.preventDefault();
      setHoverIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setDraft("");
    }
  }

  const atMax = max !== undefined && value.length >= max;

  return (
    <div className={cn("relative", className)}>
      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          "flex min-h-[40px] flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm focus-within:ring-1 focus-within:ring-ring",
          error && "border-destructive",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        {value.map((tag) => {
          const locked = readOnlyTags.includes(tag);
          return (
            <Badge
              key={tag}
              variant="secondary"
              className={cn("gap-1 px-2 py-0.5 text-xs font-normal", locked && "opacity-70")}
            >
              {tag}
              {!locked && !disabled ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(tag);
                  }}
                  aria-label={`Remove ${tag}`}
                  className="rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3 w-3" aria-hidden />
                </button>
              ) : null}
            </Badge>
          );
        })}
        <input
          ref={inputRef}
          id={id}
          type="text"
          disabled={disabled || atMax}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKey}
          onBlur={() => {
            if (draft.trim()) commit(draft);
          }}
          placeholder={atMax ? "Max reached" : value.length === 0 ? placeholder : ""}
          className="min-w-[8ch] flex-1 bg-transparent px-1 outline-none placeholder:text-muted-foreground"
        />
      </div>

      {filteredSuggestions.length > 0 ? (
        <div className="absolute left-0 right-0 z-10 mt-1 rounded-md border border-border bg-popover py-1 shadow-md">
          {filteredSuggestions.map((s, i) => (
            <button
              key={s}
              type="button"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                commit(s);
              }}
              className={cn(
                "block w-full px-3 py-1.5 text-left text-sm",
                i === hoverIndex ? "bg-muted" : "hover:bg-muted",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
