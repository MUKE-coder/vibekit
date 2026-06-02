/**
 * Notification digest scheduler — batches in-app notifications into a
 * single periodic email so high-volume users aren't drowned in per-event
 * messages.
 *
 *   1. App emits notifications via `notify(userId, type, data)` — the
 *      individual emails honour `prefs.email = true`.
 *   2. Users whose prefs are `prefs.email = false, prefs.digest = "daily" | "weekly"`
 *      accumulate notifications in the DB without an email send.
 *   3. A QStash cron (defined here) fires once a day / once a week and
 *      calls `sendUserDigest(userId, range)` for every user with at
 *      least one unread digest-bound notification.
 *
 * Wire the QStash job route:
 *
 *   // app/api/jobs/digest/route.ts
 *   import { defineJob } from "@/lib/background-jobs";
 *   import { runDigestBatch } from "@/lib/digest-scheduler";
 *
 *   export const POST = defineJob("digest", {
 *     schema: z.object({ cadence: z.enum(["daily","weekly"]) }),
 *     handler: async ({ cadence }) => { await runDigestBatch(cadence); },
 *   });
 *
 * Schedule from `instrumentation.ts` (or a one-shot setup script):
 *
 *   await jobs.enqueue("digest", { cadence: "daily" },  { cron: "0 8 * * *" });
 *   await jobs.enqueue("digest", { cadence: "weekly" }, { cron: "0 8 * * 1" });
 */

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { captureError, logger } from "@/lib/monitoring";

export type Cadence = "daily" | "weekly";

const WINDOW_HOURS: Record<Cadence, number> = { daily: 24, weekly: 24 * 7 };

interface DigestRow {
  id: string;
  type: string;
  title: string;
  body: string | null;
  href: string | null;
  createdAt: Date;
}

/** Render the email body. Override per-app for fancier templates. */
export function renderDigestText(items: DigestRow[]): { subject: string; text: string } {
  const subject = `Your ${items.length === 1 ? "update" : `${items.length} updates`}`;
  const lines = items.map(
    (n) => `• ${n.title}${n.body ? ` — ${n.body}` : ""}${n.href ? `\n  ${n.href}` : ""}`,
  );
  const text = ["Here's what happened since your last digest:", "", ...lines, ""].join("\n");
  return { subject, text };
}

/**
 * Send the digest for a single user. Skips silently when there's
 * nothing new. Marks every included notification as "digestSentAt"
 * to avoid re-including it in the next batch.
 */
export async function sendUserDigest(userId: string, cadence: Cadence): Promise<{ sent: number }> {
  const since = new Date(Date.now() - WINDOW_HOURS[cadence] * 60 * 60 * 1000);

  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return { sent: 0 };

  const items = (await db.notification.findMany({
    where: {
      userId,
      createdAt: { gte: since },
      digestSentAt: null,
    },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: { id: true, type: true, title: true, body: true, href: true, createdAt: true },
  })) as DigestRow[];

  if (items.length === 0) return { sent: 0 };

  const { subject, text } = renderDigestText(items);
  await sendEmail({ to: user.email, subject, text });

  await db.notification.updateMany({
    where: { id: { in: items.map((i) => i.id) } },
    data: { digestSentAt: new Date() },
  });

  return { sent: items.length };
}

/**
 * Run the digest for every user whose preferences select this cadence.
 * Sequential per-user so a single bad row doesn't fail the batch.
 */
export async function runDigestBatch(cadence: Cadence): Promise<{ users: number; total: number }> {
  const recipients = await db.notificationPreference.findMany({
    where: { digest: cadence },
    select: { userId: true },
    distinct: ["userId"],
  });

  let total = 0;
  for (const r of recipients) {
    try {
      const { sent } = await sendUserDigest(r.userId, cadence);
      total += sent;
    } catch (err) {
      captureError(err, { userId: r.userId, cadence });
    }
  }

  logger.info("digest.batch.done", { cadence, users: recipients.length, total });
  return { users: recipients.length, total };
}
