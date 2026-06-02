import { Client, Receiver } from "@upstash/qstash";
import { NextResponse } from "next/server";

/**
 * Typed background-job runner backed by Upstash QStash. Two halves:
 *
 *   1. `enqueue(jobName, payload, { delay?, retries? })`
 *      Called from server routes / actions. Pushes a job to QStash,
 *      which POSTs back to your `/api/jobs/[name]` route at the chosen
 *      time. Returns the QStash message id for tracking.
 *
 *   2. `defineJob(jobName, handler)` + route boilerplate
 *      Define the typed handler ONCE. Per-job routes import the helper
 *      and verify the QStash signature before running.
 *
 * USAGE (project-side wiring):
 *
 *   // lib/jobs.ts
 *   import { z } from "zod";
 *   import { defineJob, jobs } from "@/lib/background-jobs";
 *
 *   export const sendDigest = defineJob("send-digest", {
 *     schema: z.object({ userId: z.string() }),
 *     handler: async ({ userId }) => {
 *       await sendDigestEmail(userId);
 *     },
 *   });
 *
 *   // From anywhere on the server:
 *   await jobs.enqueue("send-digest", { userId: user.id }, { delay: "1d" });
 *
 *   // app/api/jobs/send-digest/route.ts
 *   import { sendDigest } from "@/lib/jobs";
 *   export const POST = sendDigest.handler;
 *
 * Required env:
 *   QSTASH_TOKEN                       // for enqueue
 *   QSTASH_CURRENT_SIGNING_KEY         // for handler verification
 *   QSTASH_NEXT_SIGNING_KEY            // (key rotation)
 *   NEXT_PUBLIC_APP_URL                // QStash needs a public callback URL
 */

import type { z, ZodSchema } from "zod";

const TOKEN = process.env.QSTASH_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

let _client: Client | null = null;
function getClient(): Client {
  if (_client) return _client;
  if (!TOKEN) throw new Error("background-jobs: QSTASH_TOKEN must be set");
  _client = new Client({ token: TOKEN });
  return _client;
}

let _receiver: Receiver | null = null;
function getReceiver(): Receiver {
  if (_receiver) return _receiver;
  const current = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const next = process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!current || !next) {
    throw new Error("background-jobs: QSTASH_CURRENT_SIGNING_KEY + QSTASH_NEXT_SIGNING_KEY must be set");
  }
  _receiver = new Receiver({ currentSigningKey: current, nextSigningKey: next });
  return _receiver;
}

interface EnqueueOptions {
  /** QStash delay string ("60s", "5m", "1h", "1d") OR ISO timestamp. */
  delay?: string;
  /** Number of QStash-side retries on 5xx. Default: 3. */
  retries?: number;
  /** Cron schedule for recurring jobs ("0 9 * * *"). Mutually exclusive with `delay`. */
  cron?: string;
}

export const jobs = {
  async enqueue<T>(jobName: string, payload: T, options: EnqueueOptions = {}): Promise<{ messageId: string }> {
    if (!APP_URL) throw new Error("background-jobs: NEXT_PUBLIC_APP_URL must be set");
    const url = `${APP_URL.replace(/\/$/, "")}/api/jobs/${jobName}`;

    if (options.cron) {
      const res = await getClient().schedules.create({
        destination: url,
        cron: options.cron,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
      return { messageId: res.scheduleId };
    }

    const res = await getClient().publishJSON({
      url,
      body: payload as object,
      delay: options.delay,
      retries: options.retries ?? 3,
    });
    return { messageId: (res as { messageId?: string }).messageId ?? "unknown" };
  },
};

/* ─────────── Handler-side helpers ─────────── */

interface DefineJobOptions<S extends ZodSchema> {
  /** Zod schema for the payload. Validated before the handler runs. */
  schema: S;
  /** Your handler. Throws → QStash retries (up to `retries`). */
  handler: (payload: z.infer<S>) => Promise<void>;
}

interface JobDefinition {
  /** Drop-in POST handler for the route file. */
  handler: (req: Request) => Promise<Response>;
}

export function defineJob<S extends ZodSchema>(
  jobName: string,
  options: DefineJobOptions<S>,
): JobDefinition {
  return {
    async handler(req: Request) {
      // Verify QStash signature
      const signature = req.headers.get("upstash-signature");
      if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }

      const body = await req.text();
      try {
        const isValid = await getReceiver().verify({
          signature,
          body,
          url: req.url,
        });
        if (!isValid) {
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      } catch (err) {
        return NextResponse.json({ error: "Signature verification failed" }, { status: 401 });
      }

      // Parse + validate payload
      let payload: unknown;
      try {
        payload = JSON.parse(body);
      } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
      }
      const parsed = options.schema.safeParse(payload);
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid job payload", issues: parsed.error.issues },
          { status: 422 },
        );
      }

      // Run — propagate errors as 500 so QStash retries
      try {
        await options.handler(parsed.data);
        return NextResponse.json({ ok: true, job: jobName });
      } catch (err) {
        console.error(`[job:${jobName}] failed`, err);
        return NextResponse.json(
          { error: err instanceof Error ? err.message : String(err) },
          { status: 500 },
        );
      }
    },
  };
}
