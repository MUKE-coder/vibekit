"use client";

import {
  useMutation,
  useQueryClient,
  type QueryKey,
  type UseMutationOptions,
} from "@tanstack/react-query";

/**
 * Opinionated wrapper around `useMutation` with built-in optimistic update,
 * automatic rollback on error, and (optional) success/error toast hooks.
 *
 *   const update = useOptimisticMutation<Invoice, UpdateInput>({
 *     mutationFn: (input) => api.patch(`/invoices/${input.id}`, input),
 *     queryKey: keys.invoices.detail(invoiceId),
 *     applyOptimistic: (input, prev) => ({ ...(prev as Invoice), ...input }),
 *     onSuccessToast: "Invoice saved",
 *     onErrorToast: (err) => `Couldn't save: ${err.message}`,
 *   });
 *
 *   update.mutate({ id: invoiceId, amount: 5000 });
 *
 * Pass `invalidateKeys` to also invalidate list/related queries after the
 * server confirms — typical pattern: optimistic on the detail query,
 * invalidate the list query.
 */

type AnyError = Error;

interface UseOptimisticMutationOptions<TData, TVariables>
  extends Omit<UseMutationOptions<TData, AnyError, TVariables>, "mutationFn"> {
  /** The mutation function — the only thing you MUST supply. */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /**
   * The query key whose cached value we'll optimistically update + roll back
   * on failure. Skip if you don't want optimistic updates — falls back to a
   * plain mutation with toast support.
   */
  queryKey?: QueryKey;
  /**
   * Receives the variables and the previous cached value, returns the new
   * cached value. Pure — don't mutate `prev`.
   */
  applyOptimistic?: (variables: TVariables, prev: unknown) => unknown;
  /** Additional query keys to invalidate after the server confirms. */
  invalidateKeys?: QueryKey[];
  /** Toast string OR a function returning one. Wire your toast library inside. */
  onSuccessToast?: string | ((data: TData, variables: TVariables) => string);
  /** Toast string OR function returning one. */
  onErrorToast?: string | ((error: AnyError, variables: TVariables) => string);
  /** Hook into your toast lib (sonner, etc.). Defaults to console. */
  toast?: { success?: (msg: string) => void; error?: (msg: string) => void };
}

function defaultToast() {
  // Best-effort fallback if no toast lib is wired. Replace via the `toast` option.
  if (typeof window !== "undefined") {
    return {
      success: (msg: string) => console.log("[toast.success]", msg),
      error: (msg: string) => console.error("[toast.error]", msg),
    };
  }
  return { success: () => {}, error: () => {} };
}

export function useOptimisticMutation<TData = unknown, TVariables = void>(
  options: UseOptimisticMutationOptions<TData, TVariables>,
) {
  const {
    mutationFn,
    queryKey,
    applyOptimistic,
    invalidateKeys,
    onSuccessToast,
    onErrorToast,
    toast = defaultToast(),
    ...rest
  } = options;

  const qc = useQueryClient();

  return useMutation<TData, AnyError, TVariables, { previous: unknown }>({
    mutationFn,
    onMutate: async (variables) => {
      if (!queryKey || !applyOptimistic) return { previous: undefined };
      await qc.cancelQueries({ queryKey });
      const previous = qc.getQueryData(queryKey);
      qc.setQueryData(queryKey, (prev: unknown) => applyOptimistic(variables, prev));
      return { previous };
    },
    onError: (error, variables, context) => {
      // Roll back optimistic update
      if (queryKey && context && "previous" in context) {
        qc.setQueryData(queryKey, context.previous);
      }
      if (onErrorToast) {
        const msg = typeof onErrorToast === "function" ? onErrorToast(error, variables) : onErrorToast;
        toast.error?.(msg);
      }
      rest.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, context) => {
      if (onSuccessToast) {
        const msg = typeof onSuccessToast === "function" ? onSuccessToast(data, variables) : onSuccessToast;
        toast.success?.(msg);
      }
      rest.onSuccess?.(data, variables, context);
    },
    onSettled: async (...args) => {
      if (queryKey) await qc.invalidateQueries({ queryKey });
      if (invalidateKeys) {
        await Promise.all(invalidateKeys.map((k) => qc.invalidateQueries({ queryKey: k })));
      }
      rest.onSettled?.(...args);
    },
    ...rest,
  });
}
