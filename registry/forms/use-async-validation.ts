"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Debounced async field validation — for "is this email taken?" /
 * "is this slug available?" checks that need a server round-trip.
 * Pair with React Hook Form's `setError` / `clearErrors` so the result
 * surfaces alongside Zod's sync errors.
 *
 *   const email = form.watch("email");
 *   const status = useAsyncValidation(email, async (value) => {
 *     if (!value) return { kind: "idle" };
 *     const exists = await api.get<{ exists: boolean }>(`/api/users/exists?email=${value}`);
 *     return exists.exists ? { kind: "invalid", message: "Email already in use" } : { kind: "valid" };
 *   });
 *
 *   // Reflect into RHF:
 *   useEffect(() => {
 *     if (status.kind === "invalid") form.setError("email", { type: "async", message: status.message });
 *     else form.clearErrors("email");
 *   }, [status]);
 *
 *   // Disable submit while validating:
 *   <Button disabled={form.formState.isSubmitting || status.kind === "validating"}>Save</Button>
 *
 * Defaults: 400ms debounce, cancel in-flight requests when value changes
 * again (the latest one wins).
 */

export type AsyncValidationStatus =
  | { kind: "idle" }
  | { kind: "validating" }
  | { kind: "valid" }
  | { kind: "invalid"; message: string };

interface UseAsyncValidationOptions {
  /** Debounce window in ms. Default: 400. */
  delay?: number;
  /** Pass false to pause the validator. */
  enabled?: boolean;
  /** Minimum value length before validation runs. Default: 1. */
  minLength?: number;
}

type Validator<T> = (value: T, signal: AbortSignal) => Promise<AsyncValidationStatus | null>;

export function useAsyncValidation<T>(
  value: T,
  validator: Validator<T>,
  options: UseAsyncValidationOptions = {},
): AsyncValidationStatus {
  const { delay = 400, enabled = true, minLength = 1 } = options;
  const [status, setStatus] = useState<AsyncValidationStatus>({ kind: "idle" });
  const debounced = useDebounce(value, delay);

  useEffect(() => {
    if (!enabled) {
      setStatus({ kind: "idle" });
      return;
    }
    // Skip empty / short values
    if (typeof debounced === "string" && debounced.length < minLength) {
      setStatus({ kind: "idle" });
      return;
    }

    const controller = new AbortController();
    setStatus({ kind: "validating" });

    void (async () => {
      try {
        const result = await validator(debounced, controller.signal);
        if (controller.signal.aborted) return;
        setStatus(result ?? { kind: "idle" });
      } catch (err) {
        if (controller.signal.aborted) return;
        if ((err as { name?: string })?.name === "AbortError") return;
        setStatus({
          kind: "invalid",
          message: err instanceof Error ? err.message : "Validation failed",
        });
      }
    })();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, enabled, minLength]);

  return status;
}
