"use client";

import * as React from "react";
import { Check, Loader2 } from "lucide-react";
import type { UseFormReturn, FieldValues } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Debounced auto-save for React Hook Form. Watches the form's values,
 * waits for `delay` ms of inactivity, validates against the form's
 * schema, then fires the supplied save callback. Shows the standard
 * three-state indicator (idle / saving / saved + error fallback).
 *
 *   const form = useForm({...});
 *   const status = useFormAutosave(form, async (values) => {
 *     await api.patch(`/notes/${noteId}`, values);
 *   });
 *
 *   <FormAutosaveIndicator status={status} />
 *
 * Skips the initial render (no save on mount) and skips when the form
 * has validation errors — only saves when the schema passes.
 */

export type AutosaveStatus =
  | { state: "idle" }
  | { state: "saving" }
  | { state: "saved"; at: Date }
  | { state: "error"; error: Error };

interface UseFormAutosaveOptions {
  /** Debounce window in ms. Default: 800. */
  delay?: number;
  /** Pass false to disable temporarily (e.g. while a modal is closing). */
  enabled?: boolean;
}

export function useFormAutosave<V extends FieldValues>(
  form: UseFormReturn<V>,
  save: (values: V) => void | Promise<void>,
  options: UseFormAutosaveOptions = {},
): AutosaveStatus {
  const { delay = 800, enabled = true } = options;
  const [status, setStatus] = React.useState<AutosaveStatus>({ state: "idle" });

  // Track every change so the debounced effect re-runs
  const values = form.watch();
  const debouncedValues = useDebounce(values, delay);

  // Skip the very first run so we don't save on mount
  const initial = React.useRef(true);

  // Keep the latest save fn in a ref so consumers don't need to memoise
  const saveRef = React.useRef(save);
  React.useEffect(() => {
    saveRef.current = save;
  }, [save]);

  React.useEffect(() => {
    if (!enabled) return;
    if (initial.current) {
      initial.current = false;
      return;
    }

    // Skip if there are validation errors — wait for them to clear
    if (Object.keys(form.formState.errors).length > 0) {
      return;
    }
    // Skip if nothing has changed since the last successful save
    if (!form.formState.isDirty) {
      return;
    }

    let cancelled = false;
    (async () => {
      setStatus({ state: "saving" });
      try {
        await saveRef.current(debouncedValues as V);
        if (cancelled) return;
        form.reset(debouncedValues as V, { keepValues: true });
        setStatus({ state: "saved", at: new Date() });
      } catch (err) {
        if (cancelled) return;
        setStatus({ state: "error", error: err instanceof Error ? err : new Error(String(err)) });
      }
    })();

    return () => {
      cancelled = true;
    };
    // Re-run on debounced value change only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, enabled]);

  return status;
}

/* ─────────── UI indicator ─────────── */

interface FormAutosaveIndicatorProps {
  status: AutosaveStatus;
  className?: string;
}

/**
 * Tiny right-aligned status badge: shows "Saving…" while in flight,
 * "Saved" with a checkmark on success (fades after 2s), and the error
 * message in destructive colour on failure.
 */
export function FormAutosaveIndicator({ status, className }: FormAutosaveIndicatorProps) {
  const [showSaved, setShowSaved] = React.useState(false);

  React.useEffect(() => {
    if (status.state !== "saved") {
      setShowSaved(false);
      return;
    }
    setShowSaved(true);
    const id = setTimeout(() => setShowSaved(false), 2000);
    return () => clearTimeout(id);
  }, [status]);

  if (status.state === "idle") return null;

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 text-xs",
        status.state === "error" ? "text-destructive" : "text-muted-foreground",
        className,
      )}
    >
      {status.state === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          Saving…
        </>
      ) : status.state === "saved" && showSaved ? (
        <>
          <Check className="h-3 w-3" aria-hidden />
          Saved
        </>
      ) : status.state === "error" ? (
        <>Couldn't save: {status.error.message}</>
      ) : null}
    </span>
  );
}
