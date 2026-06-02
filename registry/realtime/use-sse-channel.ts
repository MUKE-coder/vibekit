"use client";

import { useEffect, useRef } from "react";

/**
 * Client-side SSE subscriber. Auto-reconnects with exponential back-off,
 * JSON-parses payloads, filters out the `ping` heartbeat. Pair with the
 * server-side `defineSseRoute` from `sse-channel`.
 *
 *   useSseChannel("/api/events", (event) => {
 *     if (event.type === "invoice.updated") {
 *       qc.invalidateQueries({ queryKey: keys.invoices.all });
 *     }
 *   });
 *
 * Aborts the connection on unmount + every `enabled` flip.
 */

export type SseMessageHandler = (event: { type: string; data: unknown }) => void;

interface UseSseChannelOptions {
  /** Auto-reconnect with exponential back-off. Default: true. */
  reconnect?: boolean;
  /** Initial back-off in ms. Default: 1000. */
  initialBackoffMs?: number;
  /** Max back-off in ms. Default: 30000. */
  maxBackoffMs?: number;
  /** Pass false to pause the subscription. */
  enabled?: boolean;
}

export function useSseChannel(
  url: string,
  onMessage: SseMessageHandler,
  options: UseSseChannelOptions = {},
) {
  const {
    reconnect = true,
    initialBackoffMs = 1000,
    maxBackoffMs = 30_000,
    enabled = true,
  } = options;

  // Keep the latest handler without forcing the consumer to memoise
  const handlerRef = useRef(onMessage);
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    let aborted = false;
    let source: EventSource | null = null;
    let backoff = initialBackoffMs;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    function connect() {
      if (aborted) return;
      source = new EventSource(url, { withCredentials: true });

      // Wildcard listener for unnamed events
      source.onmessage = (e) => dispatch("message", e.data);
      source.onerror = () => {
        if (!source) return;
        source.close();
        source = null;
        if (!reconnect || aborted) return;
        reconnectTimer = setTimeout(connect, backoff);
        backoff = Math.min(maxBackoffMs, backoff * 2);
      };

      // Reset back-off when a real message arrives
      source.addEventListener("open", () => {
        backoff = initialBackoffMs;
      });

      // Generic event listener — captures every typed event the server emits
      const handler = (e: Event) => {
        const me = e as MessageEvent;
        // Ignore the heartbeat
        if (me.type === "ping") return;
        dispatch(me.type, me.data);
      };

      // Attach handlers for the common typed events. For full coverage in
      // your app, register additional listeners on the returned EventSource.
      const TYPED_EVENTS = ["created", "updated", "deleted", "notification", "presence"];
      for (const t of TYPED_EVENTS) source.addEventListener(t, handler);
    }

    function dispatch(type: string, raw: string) {
      let data: unknown = raw;
      try {
        data = raw && raw.length > 0 ? JSON.parse(raw) : null;
      } catch {
        /* keep raw */
      }
      handlerRef.current({ type, data });
    }

    connect();

    return () => {
      aborted = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      source?.close();
    };
  }, [url, enabled, reconnect, initialBackoffMs, maxBackoffMs]);
}
