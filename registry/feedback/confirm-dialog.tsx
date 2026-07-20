"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Imperative confirm dialog. Drop `<ConfirmDialogProvider>` once at the app root
 * (typically in `app/layout.tsx`), then call `useConfirm()` from anywhere:
 *
 *   const confirm = useConfirm();
 *   const ok = await confirm({
 *     title: "Delete invoice?",
 *     description: "This cannot be undone.",
 *     confirmLabel: "Delete",
 *     destructive: true,
 *   });
 *   if (!ok) return;
 *
 * No JSX boilerplate at the call site. Returns a Promise<boolean>.
 */

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = React.createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used inside <ConfirmDialogProvider>");
  }
  return ctx;
}

interface PendingState extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

export function ConfirmDialogProvider({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = React.useState<PendingState | null>(null);
  // Mirrors `pending.resolve` so `confirm()` can settle an outstanding promise
  // without depending on (stale) render state — and without doing side effects
  // inside a state updater, which React may invoke twice in StrictMode.
  const pendingResolve = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = React.useCallback<ConfirmFn>(
    (options) =>
      new Promise<boolean>((resolve) => {
        // Opening a second confirm while one is pending used to drop the first
        // `resolve` on the floor — its caller's `await` (and any `finally`
        // cleanup) would hang forever. Settle it as "cancelled" first.
        pendingResolve.current?.(false);
        pendingResolve.current = resolve;
        setPending({ ...options, resolve });
      }),
    [],
  );

  const handleResolve = React.useCallback((value: boolean) => {
    const resolve = pendingResolve.current;
    if (!resolve) return;
    pendingResolve.current = null;
    resolve(value);
    setPending(null);
  }, []);

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) handleResolve(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pending?.title ?? ""}</AlertDialogTitle>
            {pending?.description ? (
              <AlertDialogDescription>{pending.description}</AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleResolve(false)}>
              {pending?.cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleResolve(true)}
              className={pending?.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
            >
              {pending?.confirmLabel ?? "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
