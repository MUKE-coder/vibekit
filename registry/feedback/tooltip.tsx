"use client";

import * as React from "react";
import {
  Tooltip as ShadTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/**
 * Standardised tooltip wrapper — consistent delay, positioning, sizing,
 * and keyboard support across the app. Replaces the four-component
 * shadcn boilerplate at every call site.
 *
 *   <Tooltip content="Delete invoice">
 *     <Button variant="ghost" size="icon"><Trash /></Button>
 *   </Tooltip>
 *
 *   <Tooltip content={<span>Pin <kbd>P</kbd></span>} side="right" delayMs={500}>
 *     <PinIcon />
 *   </Tooltip>
 *
 * Wrap your app once in <TooltipProvider> (shadcn's) — typically in
 * root layout — then use <Tooltip> anywhere.
 */

interface TooltipProps {
  /** The element the tooltip describes — usually a Button. */
  children: React.ReactNode;
  /** Tooltip body. Pass null/undefined to skip rendering. */
  content: React.ReactNode;
  /** Side of the trigger to anchor to. Default: "top". */
  side?: "top" | "right" | "bottom" | "left";
  /** Alignment along the side. Default: "center". */
  align?: "start" | "center" | "end";
  /** Open delay in ms. Default: 200. */
  delayMs?: number;
  /** Additional class on the content. */
  className?: string;
  /** Disabled — children render but the tooltip never opens. */
  disabled?: boolean;
}

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayMs = 200,
  className,
  disabled,
}: TooltipProps) {
  if (!content || disabled) return <>{children}</>;

  return (
    <ShadTooltip delayDuration={delayMs}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={cn("max-w-xs text-xs", className)}
      >
        {content}
      </TooltipContent>
    </ShadTooltip>
  );
}

/** Re-export the provider so consumers only import from one place. */
export { TooltipProvider };
