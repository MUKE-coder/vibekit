/**
 * Server-Sent Events helpers — a lighter-weight alternative to WebSocket
 * for one-way server → client streaming (notifications, live record
 * updates, log tails). Two halves:
 *
 *   1. `defineSseRoute({ subscribe })` — Server: returns the route
 *      handler. `subscribe` registers callbacks with your pub/sub
 *      (Upstash Pub/Sub, Redis Streams, your own queue) and returns an
 *      unsubscribe fn.
 *
 *   2. `useSseChannel(url, onMessage)` — Client: maintains a connection,
 *      auto-reconnects with exponential back-off, JSON-parses events.
 *
 * USAGE (server):
 *
 *   // app/api/events/route.ts
 *   import { defineSseRoute } from "@/lib/sse-channel";
 *   import { subscribeToUserChannel } from "@/lib/pubsub"; // your impl
 *
 *   export const GET = defineSseRoute({
 *     subscribe: (send, req) => subscribeToUserChannel(req.userId, send),
 *   });
 *
 * USAGE (client):
 *
 *   useSseChannel("/api/events", (event) => {
 *     if (event.type === "invoice.updated") qc.invalidateQueries(keys.invoices);
 *   });
 *
 * The server helper writes the standard `event: ping` heartbeat every
 * 15s so proxies (Cloudflare, nginx) don't close the connection. The
 * client filters those out automatically.
 */

/* ─────────── Server ─────────── */

import { NextResponse } from "next/server";

export interface SseEvent {
  /** Event type. Use a stable name like "invoice.updated", "comment.added". */
  type: string;
  /** Arbitrary JSON payload. */
  data?: unknown;
  /** Optional event id (browser stores; sent back in Last-Event-ID on reconnect). */
  id?: string;
}

type SendFn = (event: SseEvent) => void;

interface DefineSseRouteOptions {
  /** Hook the client connection into your pub/sub. Return an unsubscribe fn. */
  subscribe: (send: SendFn, req: Request) => Promise<() => void> | (() => void);
  /** Heartbeat interval in ms. Default: 15000. */
  heartbeatMs?: number;
}

export function defineSseRoute(options: DefineSseRouteOptions) {
  const { subscribe, heartbeatMs = 15_000 } = options;

  return async function GET(req: Request): Promise<NextResponse> {
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let closed = false;

        function write(chunk: string) {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(chunk));
          } catch {
            closed = true;
          }
        }

        function send(event: SseEvent) {
          if (event.id) write(`id: ${event.id}\n`);
          write(`event: ${event.type}\n`);
          write(`data: ${event.data === undefined ? "" : JSON.stringify(event.data)}\n\n`);
        }

        // Initial heartbeat tells proxies the stream is alive
        write(": connected\n\n");

        const heartbeat = setInterval(() => write(`event: ping\ndata: ${Date.now()}\n\n`), heartbeatMs);

        let unsubscribe: (() => void) | null = null;
        let torndown = false;

        function teardown() {
          // `unsubscribe` may still be null here (abort fired mid-`subscribe`);
          // the post-await check below calls teardown again once it's set.
          if (unsubscribe) {
            const fn = unsubscribe;
            unsubscribe = null;
            try {
              fn();
            } catch {
              /* ignore */
            }
          }
          if (torndown) return;
          torndown = true;
          closed = true;
          clearInterval(heartbeat);
          try {
            controller.close();
          } catch {
            /* ignore */
          }
        }

        // Registered BEFORE awaiting `subscribe`: a client that disconnects
        // during that await has already fired `abort`, and a listener added
        // afterwards never runs — leaking the heartbeat interval and the
        // pub/sub subscription for the lifetime of the process.
        req.signal.addEventListener("abort", teardown);

        try {
          unsubscribe = await subscribe(send, req);
        } catch (err) {
          send({ type: "error", data: { message: (err as Error).message } });
        }

        // ...and because `abort` may have fired while we were awaiting above
        // (teardown then ran against a no-op unsubscribe), re-check and tear
        // down the subscription we just created.
        if (req.signal.aborted) teardown();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no", // Disable nginx buffering
      },
    });
  };
}

/* ─────────── Client ─────────── */

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

// Type-only client API (the implementation lives in useSseChannel)
export type SseMessageHandler = (event: { type: string; data: unknown }) => void;
