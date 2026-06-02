"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Inline-edit table cell with optimistic save, Esc-to-cancel, and
 * Enter-to-commit. Drop into a TanStack Table cell renderer — no
 * dialog, no separate edit mode, just click + type.
 *
 *   columnHelper.accessor("title", {
 *     header: "Title",
 *     cell: ({ row, getValue }) => (
 *       <EditableCell
 *         value={getValue() as string}
 *         onSave={(next) => api.patch(`/items/${row.original.id}`, { title: next })}
 *         placeholder="Untitled"
 *       />
 *     ),
 *   })
 *
 * Behaviour:
 *   - Click to enter edit mode (or Tab into it)
 *   - Enter commits, Esc cancels back to the prior value
 *   - Optimistic UI — shows the new value immediately, reverts on error
 *   - Inline spinner while save is in flight; red border + error toast on failure
 *   - `validate` runs before save and blocks commit on a string error
 */

interface EditableCellProps {
  value: string;
  onSave: (next: string) => void | Promise<void>;
  placeholder?: string;
  /** Return null/undefined for valid; return a string to mark the value invalid. */
  validate?: (next: string) => string | null | undefined;
  /** Input type. Default: "text". */
  type?: "text" | "number" | "email" | "tel" | "url";
  /** Trim whitespace before saving. Default: true. */
  trim?: boolean;
  /** Skip the save if the value didn't change. Default: true. */
  skipUnchanged?: boolean;
  className?: string;
}

export function EditableCell({
  value,
  onSave,
  placeholder,
  validate,
  type = "text",
  trim = true,
  skipUnchanged = true,
  className,
}: EditableCellProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [displayed, setDisplayed] = React.useState(value);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Sync external value changes when not editing
  React.useEffect(() => {
    if (!editing) setDisplayed(value);
  }, [value, editing]);

  React.useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function startEdit() {
    setDraft(displayed);
    setEditing(true);
    setError(null);
  }

  function cancel() {
    setEditing(false);
    setDraft(displayed);
    setError(null);
  }

  async function commit() {
    const next = trim ? draft.trim() : draft;
    const message = validate?.(next);
    if (message) {
      setError(message);
      inputRef.current?.focus();
      return;
    }
    if (skipUnchanged && next === displayed) {
      setEditing(false);
      return;
    }

    // Optimistic update
    const previous = displayed;
    setDisplayed(next);
    setEditing(false);
    setSaving(true);
    try {
      await onSave(next);
    } catch (err) {
      // Roll back
      setDisplayed(previous);
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      void commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  }

  if (editing) {
    return (
      <div className={cn("relative", className)}>
        <Input
          ref={inputRef}
          type={type}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => void commit()}
          placeholder={placeholder}
          aria-invalid={!!error}
          className={cn("h-8 px-2 text-sm", error && "border-destructive")}
        />
        {error ? <p className="absolute left-0 top-full mt-1 text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          startEdit();
        }
      }}
      className={cn(
        "group relative -mx-2 inline-flex w-[calc(100%+1rem)] items-center gap-2 rounded-md px-2 py-1 text-left text-sm transition-colors hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none",
        !displayed && "text-muted-foreground",
        className,
      )}
    >
      <span className="min-w-0 flex-1 truncate">{displayed || placeholder}</span>
      {saving ? <Loader2 className="h-3 w-3 shrink-0 animate-spin text-muted-foreground" aria-hidden /> : null}
    </button>
  );
}
