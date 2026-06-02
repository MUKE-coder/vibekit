"use client";

import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

/**
 * Side panel for detail views and quick-edit forms. Wraps the shadcn
 * Sheet primitive with two opinions baked in:
 *
 *   1. **Responsive surface**: side panel on desktop (right-anchored,
 *      configurable width), bottom sheet on mobile.
 *   2. **Sized content slots** so consumers don't reach for header /
 *      footer arrangement every time.
 *
 *   <Drawer
 *     open={isOpen}
 *     onOpenChange={setIsOpen}
 *     title="Invoice #INV-2026-001"
 *     description="View and edit the details."
 *     footer={<><Button variant="outline">Cancel</Button><Button>Save</Button></>}
 *   >
 *     <InvoiceForm />
 *   </Drawer>
 */

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Optional sticky footer slot. */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Desktop width preset. Default: "md" (max-w-xl). */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

const DESKTOP_SIZE: Record<NonNullable<DrawerProps["size"]>, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
  full: "sm:max-w-full",
};

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  size = "md",
  className,
}: DrawerProps) {
  const isMobile = useMediaQuery("(max-width: 639px)");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={cn(
          "flex flex-col gap-0 p-0",
          !isMobile && DESKTOP_SIZE[size],
          isMobile && "max-h-[90vh] rounded-t-lg",
          className,
        )}
      >
        {(title || description) && (
          <SheetHeader className="border-b border-border px-6 py-4">
            {title ? <SheetTitle>{title}</SheetTitle> : null}
            {description ? <SheetDescription>{description}</SheetDescription> : null}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? (
          <SheetFooter className="flex flex-row items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3">
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
