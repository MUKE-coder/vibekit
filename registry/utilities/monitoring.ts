/**
 * Centralised error + event monitoring shim. Defaults to a structured
 * console logger so the helper works the moment it's installed; wire it
 * to Sentry / Axiom / Datadog / Logtail by setting one adapter:
 *
 *   // app-side wiring (server):
 *   import { setMonitoringAdapter } from "@/lib/monitoring";
 *   import * as Sentry from "@sentry/nextjs";
 *
 *   setMonitoringAdapter({
 *     captureException: (err, ctx) => Sentry.captureException(err, { extra: ctx }),
 *     captureMessage:   (msg, level, ctx) => Sentry.captureMessage(msg, { level, extra: ctx }),
 *     setUser:          (u) => Sentry.setUser(u),
 *     setContext:       (k, v) => Sentry.setContext(k, v),
 *   });
 *
 * Then call from anywhere:
 *
 *   import { captureError, captureMessage, logger } from "@/lib/monitoring";
 *
 *   try { await dangerous() } catch (err) {
 *     captureError(err, { route: req.url, userId: session.user.id });
 *   }
 *
 *   logger.info("invoice.created", { invoiceId, amount });
 *
 * The default console adapter outputs JSON lines (`{"level":"info",
 * "message":"…","ts":…}`) so they're greppable / parseable in logs.
 */

export interface MonitoringUser {
  id: string;
  email?: string;
  username?: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface MonitoringAdapter {
  captureException: (error: Error, context?: Record<string, unknown>) => void;
  captureMessage: (message: string, level: LogLevel, context?: Record<string, unknown>) => void;
  setUser?: (user: MonitoringUser | null) => void;
  setContext?: (key: string, value: Record<string, unknown> | null) => void;
}

/* ─────────── Default adapter (console) ─────────── */

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value, jsonReplacer);
  } catch {
    return String(value);
  }
}

const jsonReplacer = (_key: string, value: unknown): unknown => {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
};

const consoleAdapter: MonitoringAdapter = {
  captureException(error, context) {
    const line = {
      ts: new Date().toISOString(),
      level: "error" as LogLevel,
      message: error.message,
      error: { name: error.name, stack: error.stack },
      ...context,
    };
    console.error(safeStringify(line));
  },
  captureMessage(message, level, context) {
    const line = { ts: new Date().toISOString(), level, message, ...context };
    const fn = level === "error" || level === "fatal" ? console.error : level === "warn" ? console.warn : console.log;
    fn(safeStringify(line));
  },
  setUser() {
    /* no-op for console */
  },
  setContext() {
    /* no-op for console */
  },
};

let adapter: MonitoringAdapter = consoleAdapter;
let baseContext: Record<string, unknown> = {};

/** Replace the adapter at app boot (typically once, in instrumentation.ts). */
export function setMonitoringAdapter(next: MonitoringAdapter): void {
  adapter = next;
}

/** Attach context (e.g. release, env) that's mixed into every event. */
export function setBaseContext(context: Record<string, unknown>): void {
  baseContext = { ...baseContext, ...context };
}

/* ─────────── Public API ─────────── */

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  const err = error instanceof Error ? error : new Error(typeof error === "string" ? error : "Unknown error");
  adapter.captureException(err, { ...baseContext, ...context });
}

export function captureMessage(message: string, level: LogLevel = "info", context?: Record<string, unknown>): void {
  adapter.captureMessage(message, level, { ...baseContext, ...context });
}

export function setMonitoringUser(user: MonitoringUser | null): void {
  adapter.setUser?.(user);
}

export function setMonitoringContext(key: string, value: Record<string, unknown> | null): void {
  adapter.setContext?.(key, value);
}

/**
 * Structured logger — one-liner methods for each level. Useful in
 * server routes where you want `logger.info(...)` reading style.
 */
export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => captureMessage(message, "debug", context),
  info: (message: string, context?: Record<string, unknown>) => captureMessage(message, "info", context),
  warn: (message: string, context?: Record<string, unknown>) => captureMessage(message, "warn", context),
  error: (message: string, context?: Record<string, unknown>) => captureMessage(message, "error", context),
  fatal: (message: string, context?: Record<string, unknown>) => captureMessage(message, "fatal", context),
};

/**
 * Wrap a server handler so any thrown error is reported AND re-thrown
 * (so Next.js still produces the 500). Cuts boilerplate in route files.
 *
 *   export const POST = withErrorReporting(async (req) => { ... });
 */
export function withErrorReporting<Args extends unknown[], R>(
  handler: (...args: Args) => Promise<R>,
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    try {
      return await handler(...args);
    } catch (err) {
      captureError(err);
      throw err;
    }
  };
}
