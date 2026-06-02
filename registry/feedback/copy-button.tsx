"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  /** The string to copy to clipboard when the button is clicked. */
  value: string;
  /** Label shown next to the icon. Hide by passing null. Default: "Copy". */
  label?: React.ReactNode | null;
  /** Label shown briefly after copy. Default: "Copied". */
  copiedLabel?: React.ReactNode;
  /** ms to show the copied state. Default: 2000. */
  duration?: number;
  /** Called after a successful copy. */
  onCopy?: (value: string) => void;
}

/**
 * Click-to-copy button with a "copied" success state. Falls back to a
 * hidden textarea + `document.execCommand` for older browsers without
 * the Clipboard API.
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  duration = 2000,
  onCopy,
  className,
  variant = "outline",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const ta = document.createElement("textarea");
        ta.value = value;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      onCopy?.(value);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), duration);
    } catch {
      // Silent — copying is best-effort
    }
  }

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(className)}
      aria-label={typeof label === "string" ? label : "Copy"}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {label !== null && <span>{copied ? copiedLabel : label}</span>}
    </Button>
  );
}
