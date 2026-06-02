"use client";

import { useEffect, useRef } from "react";

/**
 * Typed event listener hook with auto-cleanup.
 *
 *   useEventListener("keydown", (e) => { ... });               // window
 *   useEventListener("click", onClick, buttonRef);             // element ref
 *   useEventListener("scroll", onScroll, undefined, { passive: true });
 *
 * The callback is captured in a ref so consumers don't need to memoise it —
 * the listener stays attached across re-renders and always calls the latest fn.
 */

// Overloads for nice autocomplete on window / document / HTMLElement
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: undefined,
  options?: AddEventListenerOptions,
): void;
export function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  target: React.RefObject<Document | null>,
  options?: AddEventListenerOptions,
): void;
export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  target: React.RefObject<T | null>,
  options?: AddEventListenerOptions,
): void;
export function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  target?: React.RefObject<EventTarget | null>,
  options?: AddEventListenerOptions,
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const node = target?.current ?? (typeof window !== "undefined" ? window : null);
    if (!node || typeof node.addEventListener !== "function") return;

    const listener = (event: Event) => handlerRef.current(event);
    node.addEventListener(eventName, listener, options);
    return () => node.removeEventListener(eventName, listener, options);
  }, [eventName, target, options]);
}
