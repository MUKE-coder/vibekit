"use client";

import { useEffect, useMemo, useRef } from "react";

/**
 * Register keyboard shortcuts with a tiny, typed API. Composable across
 * components — each call's listeners are auto-cleaned on unmount.
 *
 *   useKeyboardShortcuts({
 *     "mod+k":         () => openCommandPalette(),
 *     "mod+shift+n":   () => createNew(),
 *     "?":             () => openShortcutHelp(),
 *     "escape":        { handler: close, allowInInputs: true },
 *   });
 *
 * Notation:
 *   - `mod`             = ⌘ on macOS, Ctrl elsewhere
 *   - `shift`, `alt`, `ctrl`, `meta` modifiers
 *   - key names match `e.key` (case-insensitive), lowercased
 *   - `?` and other single chars are matched literally
 *
 * Defaults:
 *   - Shortcuts are IGNORED when the user is typing in an input,
 *     textarea, contenteditable, or shadcn Combobox. Override per-binding
 *     with `allowInInputs: true`.
 *   - Calls `preventDefault()` automatically. Override with
 *     `preventDefault: false`.
 */

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutBinding {
  handler: ShortcutHandler;
  /** Allow firing while focus is in an editable element. Default: false. */
  allowInInputs?: boolean;
  /** Call event.preventDefault() before the handler. Default: true. */
  preventDefault?: boolean;
}

type ShortcutMap = Record<string, ShortcutHandler | ShortcutBinding>;

interface UseKeyboardShortcutsOptions {
  /** Pass false to temporarily disable all bindings (e.g. inside a modal). */
  enabled?: boolean;
  /** Override the target. Default: window. */
  target?: HTMLElement | null;
}

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.platform);

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  if (target.isContentEditable) return true;
  // shadcn Combobox / Command input
  if (target.getAttribute("role") === "combobox") return true;
  return false;
}

function normaliseCombo(combo: string): string {
  return combo
    .toLowerCase()
    .split("+")
    .map((p) => p.trim())
    .sort((a, b) => {
      const order = ["ctrl", "meta", "alt", "shift"];
      const ai = order.indexOf(a);
      const bi = order.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .join("+");
}

function comboFromEvent(event: KeyboardEvent): string {
  const parts: string[] = [];
  if (event.ctrlKey) parts.push("ctrl");
  if (event.metaKey) parts.push("meta");
  if (event.altKey) parts.push("alt");
  if (event.shiftKey) parts.push("shift");
  const key = event.key.toLowerCase();
  if (!["control", "meta", "alt", "shift"].includes(key)) parts.push(key);
  return normaliseCombo(parts.join("+"));
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  options: UseKeyboardShortcutsOptions = {},
) {
  const { enabled = true, target } = options;
  const ref = useRef(shortcuts);
  useEffect(() => {
    ref.current = shortcuts;
  }, [shortcuts]);

  // Pre-normalise + handle `mod` alias
  const normalised = useMemo(() => {
    const map = new Map<string, ShortcutBinding>();
    for (const [raw, value] of Object.entries(shortcuts)) {
      const binding: ShortcutBinding = typeof value === "function" ? { handler: value } : value;
      const variants = raw.includes("mod")
        ? [raw.replace(/mod/gi, IS_MAC ? "meta" : "ctrl")]
        : [raw];
      for (const v of variants) map.set(normaliseCombo(v), binding);
    }
    return map;
    // We re-derive each render so the latest keys are matched. The handler
    // itself comes from the ref so consumers don't have to memoise.
  }, [shortcuts]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const el: EventTarget = target ?? window;

    const onKeyDown = (event: Event) => {
      const ke = event as KeyboardEvent;
      const combo = comboFromEvent(ke);
      const binding = normalised.get(combo);
      if (!binding) return;
      if (!binding.allowInInputs && isEditableTarget(ke.target)) return;
      if (binding.preventDefault !== false) ke.preventDefault();
      binding.handler(ke);
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [enabled, normalised, target]);
}

/** UI helper — pretty-print a shortcut for help dialogs. */
export function formatShortcut(combo: string): string {
  return combo
    .split("+")
    .map((p) => {
      const k = p.toLowerCase();
      if (k === "mod") return IS_MAC ? "⌘" : "Ctrl";
      if (k === "meta") return IS_MAC ? "⌘" : "Win";
      if (k === "ctrl") return IS_MAC ? "⌃" : "Ctrl";
      if (k === "alt") return IS_MAC ? "⌥" : "Alt";
      if (k === "shift") return "⇧";
      if (k === "escape") return "Esc";
      if (k === "enter" || k === "return") return "↵";
      return k.toUpperCase();
    })
    .join(IS_MAC ? "" : "+");
}
