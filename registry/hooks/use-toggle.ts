"use client";

import { useCallback, useState } from "react";

/**
 * Boolean state with `{ value, toggle, on, off, set }`. Used everywhere
 * — dialog open state, sidebar collapse, "show advanced", filter
 * panels. Stable references for every action so it's safe to pass into
 * memoised children.
 *
 *   const sidebar = useToggle(false);
 *   <Button onClick={sidebar.toggle}>Menu</Button>
 *   <Sidebar open={sidebar.value} onClose={sidebar.off} />
 */

export interface ToggleControls {
  value: boolean;
  toggle: () => void;
  on: () => void;
  off: () => void;
  set: (next: boolean) => void;
}

export function useToggle(initial = false): ToggleControls {
  const [value, set] = useState(initial);
  const toggle = useCallback(() => set((v) => !v), []);
  const on = useCallback(() => set(true), []);
  const off = useCallback(() => set(false), []);
  return { value, toggle, on, off, set };
}
