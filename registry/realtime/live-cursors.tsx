"use client";

import * as React from "react";

import { useChannel } from "@/hooks/use-channel";
import { cn } from "@/lib/utils";

/**
 * Live cursors — every viewer in a `channelName` sees every other
 * viewer's cursor as a coloured arrow + name label. Useful in docs,
 * boards, design tools, support sessions.
 *
 *   <LiveCursors
 *     channelName={`doc-${docId}`}
 *     me={{ id: user.id, name: user.name }}
 *   />
 *
 * The component:
 *   1. Listens to `cursor.move` events on the channel and renders each
 *      remote cursor as an absolute-positioned arrow.
 *   2. Throttles its OWN cursor publishes to ~24/sec.
 *   3. Drops cursors that haven't pinged in 5s (`stale`).
 *
 * The X/Y coords are relative to the document scroll origin so cursors
 * stay accurate when the user scrolls. Wrap the area you want to track
 * with `containerRef` if you want page-anchored coords instead.
 */

export interface CursorPeer {
  id: string;
  name: string;
}

interface LiveCursorsProps {
  channelName: string;
  me: CursorPeer;
  /** Override the colour palette. Cursor colour is hashed from peer ID. */
  palette?: string[];
  /** Throttle publish rate. Default: 40ms (~24 fps). */
  publishIntervalMs?: number;
  /** Drop cursors that haven't been seen for this long. Default: 5000ms. */
  staleMs?: number;
  /** Constrain tracking to a specific element. Default: window. */
  containerRef?: React.RefObject<HTMLElement>;
  className?: string;
}

interface CursorState extends CursorPeer {
  x: number;
  y: number;
  lastSeen: number;
}

const DEFAULT_PALETTE = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

function colourFor(id: string, palette: string[]): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

export function LiveCursors({
  channelName,
  me,
  palette = DEFAULT_PALETTE,
  publishIntervalMs = 40,
  staleMs = 5000,
  containerRef,
  className,
}: LiveCursorsProps) {
  const [peers, setPeers] = React.useState<Record<string, CursorState>>({});
  const lastPublishRef = React.useRef(0);

  const channel = useChannel(channelName);

  type CursorPayload = { id: string; name: string; x: number; y: number };

  React.useEffect(() => {
    const offMove = channel.subscribe<CursorPayload>("cursor.move", (data) => {
      if (!data || data.id === me.id) return;
      setPeers((prev) => ({
        ...prev,
        [data.id]: { id: data.id, name: data.name, x: data.x, y: data.y, lastSeen: Date.now() },
      }));
    });
    const offLeave = channel.subscribe<{ id: string }>("cursor.leave", (data) => {
      if (!data || data.id === me.id) return;
      setPeers((prev) => {
        const next = { ...prev };
        delete next[data.id];
        return next;
      });
    });
    return () => {
      offMove();
      offLeave();
    };
  }, [channel, me.id]);

  React.useEffect(() => {
    const target: EventTarget = containerRef?.current ?? window;
    const onMove = (event: Event) => {
      const e = event as MouseEvent;
      const now = Date.now();
      if (now - lastPublishRef.current < publishIntervalMs) return;
      lastPublishRef.current = now;
      void channel.publish<CursorPayload>("cursor.move", { id: me.id, name: me.name, x: e.pageX, y: e.pageY });
    };
    target.addEventListener("mousemove", onMove);

    const beforeUnload = () => {
      void channel.publish<{ id: string }>("cursor.leave", { id: me.id });
    };
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      target.removeEventListener("mousemove", onMove);
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [containerRef, me.id, me.name, channel, publishIntervalMs]);

  React.useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      setPeers((prev) => {
        let dirty = false;
        const next: Record<string, CursorState> = {};
        for (const [k, v] of Object.entries(prev)) {
          if (now - v.lastSeen < staleMs) next[k] = v;
          else dirty = true;
        }
        return dirty ? next : prev;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [staleMs]);

  return (
    <div className={cn("pointer-events-none fixed inset-0 z-[60]", className)} aria-hidden>
      {Object.values(peers).map((peer) => (
        <Cursor key={peer.id} peer={peer} colour={colourFor(peer.id, palette)} />
      ))}
    </div>
  );
}

function Cursor({ peer, colour }: { peer: CursorState; colour: string }) {
  return (
    <div
      style={{
        transform: `translate3d(${peer.x}px, ${peer.y}px, 0)`,
        transition: "transform 80ms linear",
      }}
      className="absolute left-0 top-0"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.25))" }}>
        <path d="M3 2 L17 9 L10 11 L8 18 Z" fill={colour} stroke="white" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
      <span
        className="absolute left-4 top-3 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-white shadow"
        style={{ backgroundColor: colour }}
      >
        {peer.name}
      </span>
    </div>
  );
}
