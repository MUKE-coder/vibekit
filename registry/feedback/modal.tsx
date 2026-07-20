"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Stack-aware modal manager. Pair with `<ModalRoot />` at the app root,
 * then call `useModal()` from any component to open a modal whose
 * content lives where the caller wants — no centralised `<Modal>`
 * boilerplate, no JSX gymnastics.
 *
 *   // app/layout.tsx (client component)
 *   <ModalProvider>
 *     {children}
 *     <ModalRoot />
 *   </ModalProvider>
 *
 *   // From anywhere:
 *   const modal = useModal();
 *   modal.open(({ close }) => (
 *     <Modal>
 *       <Modal.Header title="Edit invoice" description="Update line items + totals." />
 *       <Modal.Body>
 *         <EditInvoiceForm onCancel={close} onSaved={close} />
 *       </Modal.Body>
 *     </Modal>
 *   ), { size: "lg" });
 *
 * The stack is FIFO — opening a new modal pushes onto the top; closing
 * pops it. Esc / backdrop click closes the topmost only.
 */

interface ModalEntry {
  id: string;
  render: (api: { close: () => void; id: string }) => React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Skip close-on-outside-click + close-on-escape. Default: false. */
  preventOutsideClose?: boolean;
}

interface ModalContextValue {
  open: (
    render: ModalEntry["render"],
    options?: Omit<ModalEntry, "id" | "render">,
  ) => string;
  close: (id?: string) => void;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);
const ModalStackContext = React.createContext<ModalEntry[]>([]);

const SIZE_CLASS: Record<NonNullable<ModalEntry["size"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-lg",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-4xl",
};

export function useModal() {
  const ctx = React.useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider>");
  return ctx;
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [stack, setStack] = React.useState<ModalEntry[]>([]);

  const open = React.useCallback<ModalContextValue["open"]>((render, options) => {
    const id = crypto.randomUUID();
    setStack((prev) => [...prev, { id, render, ...options }]);
    return id;
  }, []);

  const close = React.useCallback<ModalContextValue["close"]>((id) => {
    setStack((prev) => {
      if (!id) return prev.slice(0, -1); // pop top
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const value = React.useMemo(() => ({ open, close }), [open, close]);

  return (
    <ModalContext.Provider value={value}>
      <ModalStackContext.Provider value={stack}>{children}</ModalStackContext.Provider>
    </ModalContext.Provider>
  );
}

/**
 * Mount this once near the root (inside ModalProvider, beside `children`).
 * It renders the stack — each entry becomes its own Dialog.
 */
export function ModalRoot() {
  const stack = React.useContext(ModalStackContext);
  const { close } = useModal();

  return (
    <>
      {stack.map((entry) => (
        <Dialog
          key={entry.id}
          open
          onOpenChange={(open) => {
            if (!open && !entry.preventOutsideClose) close(entry.id);
          }}
        >
          <DialogContent
            className={cn(entry.size ? SIZE_CLASS[entry.size] : SIZE_CLASS.md, "max-h-[85vh] overflow-y-auto")}
            // Radix dispatches native DOM events here, not React synthetic ones:
            // onEscapeKeyDown gets a KeyboardEvent, onPointerDownOutside a
            // CustomEvent (PointerDownOutsideEvent).
            onEscapeKeyDown={(e: KeyboardEvent) => entry.preventOutsideClose && e.preventDefault()}
            onPointerDownOutside={(e: Event) => entry.preventOutsideClose && e.preventDefault()}
          >
            {entry.render({ close: () => close(entry.id), id: entry.id })}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}

/* ─────────── Slot helpers — Modal.Header / Body / Footer ─────────── */

function Modal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col gap-4", className)}>{children}</div>;
}

function ModalHeader({
  title,
  description,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <DialogHeader className={className}>
      <DialogTitle>{title}</DialogTitle>
      {description ? <DialogDescription>{description}</DialogDescription> : null}
    </DialogHeader>
  );
}

function ModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function ModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <DialogFooter className={className}>{children}</DialogFooter>;
}

Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export { Modal };
