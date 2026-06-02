"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Copy/paste hook with a "copied" success flag that auto-resets, plus a
 * fallback to `document.execCommand` for older browsers.
 *
 *   const { copy, copied } = useClipboard({ timeout: 2000 });
 *   <button onClick={() => copy("hello")}>{copied ? "Copied" : "Copy"}</button>
 */

interface UseClipboardOptions {
  /** ms before `copied` resets to false. Default: 2000. */
  timeout?: number;
}

export function useClipboard({ timeout = 2000 }: UseClipboardOptions = {}) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(value);
        } else if (typeof document !== "undefined") {
          const ta = document.createElement("textarea");
          ta.value = value;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        } else {
          return false;
        }
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [timeout],
  );

  return { copy, copied };
}
