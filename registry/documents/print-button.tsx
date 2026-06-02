"use client";

import * as React from "react";
import { Printer } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

/**
 * Print button + print-stylesheet hook. Pair with `printable-templates`
 * from the JB registry (invoice / receipt / report layouts) or any
 * `print:` Tailwind classes you sprinkle on your own components.
 *
 *   <PrintButton>Print invoice</PrintButton>           // prints the whole page
 *
 *   <PrintButton targetId="invoice-print">             // prints only the chosen element
 *     Print
 *   </PrintButton>
 *
 *   // Or use the hook directly:
 *   const print = usePrint();
 *   <Button onClick={() => print("invoice-print")}>Print</Button>
 *
 * When `targetId` is set, every other element on the page is hidden via
 * a temporary `@media print` rule so the user gets a clean printout of
 * just that block. The rule is removed after `afterprint` fires.
 */

interface PrintButtonProps extends Omit<ButtonProps, "onClick"> {
  /** When set, only the element with this id is printed. */
  targetId?: string;
  /** Override the icon (Lucide Printer by default; pass null to hide). */
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function PrintButton({
  targetId,
  icon = <Printer className="mr-2 h-3.5 w-3.5" aria-hidden />,
  children = "Print",
  ...props
}: PrintButtonProps) {
  const print = usePrint();
  return (
    <Button {...props} onClick={() => print(targetId)}>
      {icon}
      {children}
    </Button>
  );
}

/**
 * Returns a `print(targetId?)` function. When `targetId` is provided,
 * a scoped @media print rule hides everything else for the duration of
 * the print dialog, then is removed automatically.
 */
export function usePrint() {
  return React.useCallback((targetId?: string) => {
    if (typeof window === "undefined") return;

    if (!targetId) {
      window.print();
      return;
    }

    const STYLE_ID = "vibekit-scoped-print-style";

    // Remove any leftover stylesheet from a previous print
    document.getElementById(STYLE_ID)?.remove();

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #${cssEscape(targetId)}, #${cssEscape(targetId)} * { visibility: visible !important; }
        #${cssEscape(targetId)} {
          position: absolute !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
        }
      }
    `;
    document.head.appendChild(style);

    function cleanup() {
      document.getElementById(STYLE_ID)?.remove();
      window.removeEventListener("afterprint", cleanup);
    }
    window.addEventListener("afterprint", cleanup);

    // Some browsers don't fire afterprint reliably — guarantee cleanup
    setTimeout(cleanup, 30_000);

    window.print();
  }, []);
}

function cssEscape(value: string): string {
  if (typeof (CSS as { escape?: (s: string) => string }).escape === "function") {
    return CSS.escape(value);
  }
  // Conservative fallback for older browsers
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}
