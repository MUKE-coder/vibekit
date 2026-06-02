"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/hooks/use-channel";

/**
 * "User is typing…" indicator backed by `use-channel`. Two pieces:
 *
 *   1. `useTypingPublisher(channelName, me)` — hook that exposes
 *      `notifyTyping()` you call on every keystroke. Throttled to one
 *      broadcast every `throttleMs`, and auto-emits a "stopped" event
 *      after `stopAfterMs` of inactivity.
 *
 *   2. `<TypingIndicator>` — UI that renders the active typers via
 *      "Alice is typing…", "Alice and Bob are typing…", or "3 people
 *      are typing…". Subscribes to the same channel.
 *
 *   const me = { id: user.id, name: user.name };
 *   const { notifyTyping } = useTypingPublisher(`thread:${threadId}`, me);
 *   <Textarea onChange={(e) => { setValue(e.target.value); notifyTyping(); }} />
 *
 *   <TypingIndicator channelName={`thread:${threadId}`} me={me} />
 *
 * Wire-shape on the channel:
 *   event: "typing.start" | "typing.stop"
 *   data:  { id: string; name?: string; image?: string | null }
 */

interface TypingActor {
  id: string;
  name?: string | null;
  image?: string | null;
}

interface UseTypingPublisherOptions {
  /** Broadcast at most once every N ms. Default: 1500. */
  throttleMs?: number;
  /** Send "typing.stop" after N ms with no further notify(). Default: 3000. */
  stopAfterMs?: number;
}

export function useTypingPublisher(
  channelName: string,
  me: TypingActor | null,
  options: UseTypingPublisherOptions = {},
) {
  const { throttleMs = 1500, stopAfterMs = 3000 } = options;
  const channel = useChannel(channelName);
  const lastSentAt = React.useRef(0);
  const stopTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const notifyTyping = React.useCallback(() => {
    if (!me) return;
    const now = Date.now();
    if (now - lastSentAt.current >= throttleMs) {
      lastSentAt.current = now;
      void channel.publish("typing.start", me);
    }
    if (stopTimer.current) clearTimeout(stopTimer.current);
    stopTimer.current = setTimeout(() => {
      void channel.publish("typing.stop", me);
      lastSentAt.current = 0; // allow next start immediately
    }, stopAfterMs);
  }, [me, channel, throttleMs, stopAfterMs]);

  // Send a final stop on unmount so other clients don't see ghost typers
  React.useEffect(() => {
    return () => {
      if (!me) return;
      if (stopTimer.current) clearTimeout(stopTimer.current);
      void channel.publish("typing.stop", me);
    };
  }, [me, channel]);

  return { notifyTyping };
}

interface TypingIndicatorProps {
  channelName: string;
  /** The viewer — their own typing is filtered out of the display. */
  me?: TypingActor | null;
  /** ms before a typer is considered idle and removed. Default: 4000. */
  expireAfterMs?: number;
  className?: string;
}

export function TypingIndicator({ channelName, me, expireAfterMs = 4000, className }: TypingIndicatorProps) {
  const channel = useChannel(channelName);
  const [typers, setTypers] = React.useState<Map<string, TypingActor>>(new Map());

  // Listen for typing events
  React.useEffect(() => {
    const offStart = channel.subscribe<TypingActor>("typing.start", (actor) => {
      if (!actor?.id) return;
      if (me && actor.id === me.id) return;
      setTypers((prev) => {
        const next = new Map(prev);
        next.set(actor.id, actor);
        return next;
      });
    });
    const offStop = channel.subscribe<TypingActor>("typing.stop", (actor) => {
      if (!actor?.id) return;
      setTypers((prev) => {
        if (!prev.has(actor.id)) return prev;
        const next = new Map(prev);
        next.delete(actor.id);
        return next;
      });
    });
    return () => {
      offStart();
      offStop();
    };
  }, [channel, me]);

  // Auto-expire stale typers (someone closed their tab without sending stop)
  React.useEffect(() => {
    if (typers.size === 0) return;
    const id = setTimeout(() => setTypers(new Map()), expireAfterMs);
    return () => clearTimeout(id);
  }, [typers, expireAfterMs]);

  const list = Array.from(typers.values());
  if (list.length === 0) return null;

  let label: string;
  if (list.length === 1) label = `${list[0].name ?? "Someone"} is typing…`;
  else if (list.length === 2) label = `${list[0].name ?? "Someone"} and ${list[1].name ?? "someone"} are typing…`;
  else label = `${list.length} people are typing…`;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}
    >
      <span className="inline-flex items-end gap-0.5" aria-hidden>
        <span className="h-1 w-1 animate-bounce rounded-full bg-current" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:120ms]" />
        <span className="h-1 w-1 animate-bounce rounded-full bg-current [animation-delay:240ms]" />
      </span>
      <span>{label}</span>
    </div>
  );
}
