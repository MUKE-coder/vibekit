/**
 * Server-side activity broadcaster — emit one event on every mutation
 * and the rest of the system fans out (in-app notify, audit log,
 * realtime channel update). Designed to be the single funnel through
 * which every "something happened" passes.
 *
 *   // lib/activity.ts (project-side wiring)
 *   import { defineActivityBroadcaster } from "@/lib/activity-broadcast";
 *   import { recordAudit } from "@/lib/audit";
 *   import { notify } from "@/lib/notify";
 *
 *   export const broadcast = defineActivityBroadcaster({
 *     publish: async (event) => {
 *       // Push to your SSE channel route so connected clients see live updates
 *       await fetch(`${appUrl}/api/channel/publish`, {
 *         method: "POST",
 *         body: JSON.stringify({ channel: `org:${event.organizationId}`, event: event.type, data: event.data }),
 *       });
 *     },
 *     persist: async (event) => {
 *       await db.activity.create({ data: { ...event } });
 *       await recordAudit({ organizationId: event.organizationId, actorId: event.actorId, action: event.type, resource: event.resource });
 *     },
 *     notify: async (event) => {
 *       // Map activity types to user notifications
 *       if (event.type === "invoice.paid" && event.data.payeeId) {
 *         await notify(event.data.payeeId, "invoice.paid", event.data);
 *       }
 *     },
 *   });
 *
 *   // From any mutation:
 *   await broadcast({
 *     type: "invoice.created",
 *     organizationId: org.id,
 *     actorId: user.id,
 *     resource: `invoice:${invoice.id}`,
 *     data: { invoiceId: invoice.id, amount: invoice.amount },
 *   });
 *
 * The three sinks (publish / persist / notify) run in parallel.
 * Errors from any one don't block the others — activity broadcasting
 * is best-effort and never blocks the mutation it follows.
 */

export interface ActivityEvent {
  /** Stable, namespaced event type. e.g. "invoice.created". */
  type: string;
  /** Tenant scope. Used to route to the right channel + audit log. */
  organizationId: string;
  /** Who did it. Null for system actions (cron, webhook handlers). */
  actorId?: string | null;
  /** Affected resource identifier — e.g. "invoice:abc123". */
  resource?: string;
  /** Arbitrary JSON payload — keep it small. */
  data?: Record<string, unknown>;
  /** Server-set; included in the event passed to sinks. */
  occurredAt?: Date;
}

interface DefineActivityBroadcasterOptions {
  /** Push to a realtime transport (SSE / WebSocket / Pusher). */
  publish?: (event: ActivityEvent) => Promise<void> | void;
  /** Persist to a durable store (activity table + audit log). */
  persist?: (event: ActivityEvent) => Promise<void> | void;
  /** Route into the notify() helper for in-app + email. */
  notify?: (event: ActivityEvent) => Promise<void> | void;
  /** Called when any sink throws. Defaults to console.error. */
  onError?: (sink: "publish" | "persist" | "notify", event: ActivityEvent, error: unknown) => void;
}

/**
 * Build the project-side `broadcast()` function. Returns a single
 * function that fans the event out to the configured sinks in parallel.
 */
export function defineActivityBroadcaster(options: DefineActivityBroadcasterOptions) {
  const { publish, persist, notify, onError } = options;

  return async function broadcast(event: ActivityEvent): Promise<void> {
    const enriched: ActivityEvent = { ...event, occurredAt: event.occurredAt ?? new Date() };
    const tasks: Promise<unknown>[] = [];

    if (publish) {
      tasks.push(
        Promise.resolve(publish(enriched)).catch((err) => {
          (onError ?? defaultErrorHandler)("publish", enriched, err);
        }),
      );
    }
    if (persist) {
      tasks.push(
        Promise.resolve(persist(enriched)).catch((err) => {
          (onError ?? defaultErrorHandler)("persist", enriched, err);
        }),
      );
    }
    if (notify) {
      tasks.push(
        Promise.resolve(notify(enriched)).catch((err) => {
          (onError ?? defaultErrorHandler)("notify", enriched, err);
        }),
      );
    }

    await Promise.allSettled(tasks);
  };
}

function defaultErrorHandler(sink: string, event: ActivityEvent, error: unknown): void {
  console.error(`[activity-broadcast:${sink}] ${event.type} failed`, error);
}
