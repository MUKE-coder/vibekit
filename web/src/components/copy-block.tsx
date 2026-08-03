"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type CopyBlockProps = {
  label?: string;
  language?: string;
  code: string;
  className?: string;
  filename?: string;
};

export function CopyBlock({
  label,
  language = "",
  code,
  className,
  filename,
}: CopyBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers / missing clipboard API
        const ta = document.createElement("textarea");
        ta.value = code;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors silently
    }
  };

  return (
    <div
      className={cn(
        // w-full + min-w-0 force this container to fit its parent's available
        // width even when nested in a flex/grid item with intrinsic-content sizing.
        // overflow-hidden clips the rounded corners.
        "relative w-full min-w-0 overflow-hidden rounded-md border border-[color:var(--border)] bg-[color:var(--bg-elevated)]",
        className
      )}
    >
      {/* Header - copy button is sticky to the right and never pushed off */}
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] bg-[color:var(--bg-subtle)] px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 truncate">
          {filename ? (
            <code className="truncate font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              {filename}
            </code>
          ) : null}
          {label ? (
            <span className="truncate font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-tertiary)]">
              {label}
            </span>
          ) : null}
          {language ? (
            <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--text-tertiary)]/70">
              {language}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded border border-[color:var(--border)] bg-[color:var(--bg-elevated)] px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--text-secondary)] transition-colors hover:border-[color:var(--border-strong)] hover:text-[color:var(--text-primary)]"
          aria-label={copied ? "Copied" : "Copy to clipboard"}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-[color:var(--accent)]" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code body - width is locked to container, content scrolls horizontally inside.
          max-w-full prevents intrinsic content width from blowing up the parent. */}
      <pre className="m-0 w-full max-w-full overflow-x-auto overflow-y-auto p-4 sm:p-5 font-mono text-[12.5px] leading-relaxed text-[color:var(--text-primary)] max-h-[460px]">
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
