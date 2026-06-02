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
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, disabled, children, className, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
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
  },
);

LoadingButton.displayName = "LoadingButton";
