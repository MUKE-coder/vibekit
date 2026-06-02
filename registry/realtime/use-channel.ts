"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useSseChannel } from "@/hooks/use-sse-channel";

/**
 * Transport-agnostic pub/sub hook. Wraps the SSE channel from
 * `sse-channel` with channel-scoped subscriptions and a typed publish
 * helper. Swap the transport (Pusher / Ably / your WebSocket) without
 * the consumer noticing.
 *
 *   const channel = useChannel(`invoice:${id}`);
 *
 *   useEffect(() => channel.subscribe("comment.added", (data) => addComment(data)), [channel]);
 *
 *   // Publish from anywhere on the client (the SSE transport routes it
 *   // through your server `/api/channel/publish` endpoint):
 *   channel.publish("typing", { userId: me.id });
 *
 * For typing-indicator / presence / live-cursor patterns, build on top
 * of this hook so each feature stays decoupled from the transport.
 *
 * Default transport: SSE (one connection per `channelName`, multiplexed
 * by event type). For higher-throughput, swap to Pusher / Ably by
 * providing a custom `transport` factory.
 */

type Handler<T = unknown> = (data: T) => void;

interface Channel {
  /** Subscribe to a typed event. Returns an unsubscribe fn. */
  subscribe<T = unknown>(event: string, handler: Handler<T>): () => void;
  /** Publish a typed event. */
  publish<T = unknown>(event: string, data: T): Promise<void>;
}

interface UseChannelOptions {
  /** Endpoint that accepts `{ channel, event, data }` and broadcasts to the SSE stream. */
  publishEndpoint?: string;
  /** Override the SSE subscribe URL. Default: `/api/channel?name=<channelName>`. */
  subscribeUrl?: (channelName: string) => string;
  /** Pause the channel entirely. */
  enabled?: boolean;
}

export function useChannel(channelName: string, options: UseChannelOptions = {}): Channel {
  const {
    publishEndpoint = "/api/channel/publish",
    subscribeUrl = (name) => `/api/channel?name=${encodeURIComponent(name)}`,
    enabled = true,
  } = options;

  // event → Set<Handler>
  const handlersRef = useRef<Map<string, Set<Handler>>>(new Map());

  // Single SSE connection — dispatches to per-event handler sets
  useSseChannel(
    subscribeUrl(channelName),
    (msg) => {
      const set = handlersRef.current.get(msg.type);
      if (!set) return;
      for (const fn of set) {
        try {
          fn(msg.data);
        } catch {
          /* a faulty handler shouldn't kill the dispatch loop */
        }
      }
    },
    { enabled },
  );

  const subscribe = useCallback<Channel["subscribe"]>((event, handler) => {
    const set = handlersRef.current.get(event) ?? new Set<Handler>();
    set.add(handler as Handler);
    handlersRef.current.set(event, set);
    return () => {
      set.delete(handler as Handler);
      if (set.size === 0) handlersRef.current.delete(event);
    };
  }, []);

  const publish = useCallback<Channel["publish"]>(
    async (event, data) => {
      try {
        await fetch(publishEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channel: channelName, event, data }),
        });
      } catch {
        /* best-effort */
      }
    },
    [channelName, publishEndpoint],
  );

  // Drop handlers when unmounted (the SSE hook already disconnects)
  useEffect(() => {
    return () => {
      handlersRef.current.clear();
    };
  }, []);

  return useMemo<Channel>(() => ({ subscribe, publish }), [subscribe, publish]);
}
