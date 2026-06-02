"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";

/**
 * Pre-configured Sonner toaster + a typed `toast` helper. Drop the
 * `<Toaster />` once near the root (just inside `<body>` in your root
 * layout), then call `toast.success()` / `toast.error()` / etc. from
 * anywhere.
 *
 * Variants beyond plain success/error:
 *
 *   toast.promise(saveInvoice(), {
 *     loading: "Saving…",
 *     success: (data) => `Saved invoice #${data.id}`,
 *     error: (err) => `Couldn't save: ${err.message}`,
 *   });
 *
 *   toast.confirm("Are you sure you want to delete?", {
 *     onConfirm: () => deleteIt(),
 *   });
 *
 * Why this and not raw Sonner? Centralised defaults (position, theme,
 * close-button, duration) + a `confirm` variant for quick inline
 * confirmations without spinning up a dialog.
 */

interface ToasterProps extends Omit<React.ComponentProps<typeof SonnerToaster>, "richColors" | "position" | "closeButton"> {
  /** Override the default toast position. */
  position?: React.ComponentProps<typeof SonnerToaster>["position"];
  /** Hide the close button (default: shown). */
  hideCloseButton?: boolean;
}

export function Toaster({ position = "bottom-right", hideCloseButton = false, ...props }: ToasterProps = {}) {
  return (
    <SonnerToaster
      {...props}
      position={position}
      richColors
      closeButton={!hideCloseButton}
      toastOptions={{
        // Match the rest of the design system
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
    />
  );
}

/**
 * Inline confirm via toast — useful for low-stakes confirms (e.g. "Remove
 * tag?") where a full dialog would be overkill. For high-stakes
 * destructive actions, use `confirm-dialog` (`MUKE-coder/vibekit/
 * confirm-dialog`) instead.
 */
function confirmToast(
  message: string,
  options: {
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
  },
) {
  const { description, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel } = options;
  sonnerToast(message, {
    description,
    duration: 10000,
    action: {
      label: confirmLabel,
      onClick: () => onConfirm(),
    },
    cancel: onCancel
      ? { label: cancelLabel, onClick: onCancel }
      : { label: cancelLabel, onClick: () => {} },
  });
}

/**
 * Re-export Sonner's `toast` with a `confirm` extension. Use exactly
 * like `import { toast } from "sonner"` — same methods, same types.
 */
export const toast = Object.assign(sonnerToast, { confirm: confirmToast });
