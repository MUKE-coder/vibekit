"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  /** When true, shows a spinner and disables the button. */
  loading?: boolean;
  /** Optional override text shown next to the spinner while loading. */
  loadingText?: string;
}

/**
 * Drop-in replacement for `<Button>` that shows a spinner and disables itself
 * when `loading` is true. Saves you the inline conditional on every async action.
 *
 *   const [saving, setSaving] = useState(false);
 *   <LoadingButton loading={saving} loadingText="Saving…" onClick={...}>Save</LoadingButton>
 */
// No `forwardRef`: React 19 passes `ref` as an ordinary prop, so it arrives in
// `...props` (via ButtonProps) and is forwarded to <Button> by the spread.
// Wrapping in forwardRef would instead try to hand a ref to <Button> out-of-band.
export function LoadingButton({
  loading = false,
  loadingText,
  disabled,
  children,
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      className={cn(className)}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
