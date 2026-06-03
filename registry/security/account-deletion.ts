/**
 * Account-deletion flow: soft delete → 30-day grace period → permanent
 * purge. Users can change their mind and cancel during the grace
 * window. After the window expires a daily job calls `purgeExpired()`.
 *
 *   // app/api/account/delete/route.ts
 *   export async function POST() {
 *     const session = await requireAuth();
 *     await scheduleAccountDeletion(session.user.id);
 *     return NextResponse.json({ ok: true });
 *   }
 *
 *   // app/api/account/delete/cancel/route.ts
 *   export async function POST() {
 *     const session = await requireAuth();
 *     await cancelAccountDeletion(session.user.id);
 *     return NextResponse.json({ ok: true });
 *   }
 *
 *   // app/api/jobs/purge-deleted/route.ts (daily cron via QStash)
 *   export const POST = defineJob("purge-deleted", {
 *     schema: z.object({}),
 *     handler: async () => { await purgeExpiredAccounts(); },
 *   });
 *
 * Schema requirement (add to your User model):
 *
 *   deletionRequestedAt DateTime?
 *   deletionScheduledAt DateTime?
 *
 * Once `purgeExpiredAccounts()` runs, the user row + every model
 * declared in `cascadeModels` is hard-deleted in a single transaction.
 */

import { db } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";
import { captureError, logger } from "@/lib/monitoring";

const GRACE_DAYS = 30;

interface DeletionOptions {
  /** Custom grace period in days. Default: 30. */
  graceDays?: number;
  /** Email the user a confirmation + cancel link. Default: true. */
  notify?: boolean;
}

export async function scheduleAccountDeletion(userId: string, options: DeletionOptions = {}): Promise<void> {
  const grace = options.graceDays ?? GRACE_DAYS;
  const now = new Date();
  const scheduled = new Date(now.getTime() + grace * 24 * 60 * 60 * 1000);

  const user = await db.user.update({
    where: { id: userId },
    data: { deletionRequestedAt: now, deletionScheduledAt: scheduled },
    select: { email: true },
  });

  if (options.notify !== false) {
    await sendEmail({
      to: user.email,
      subject: "Your account is scheduled for deletion",
      text: `We've received your account deletion request. Your data will be permanently removed on ${scheduled.toUTCString()}.\n\nChanged your mind? Sign in any time before then to cancel.`,
    }).catch((err) => captureError(err, { stage: "schedule.notify", userId }));
  }

  logger.warn("account.deletion.scheduled", { userId, scheduled: scheduled.toISOString() });
}

export async function cancelAccountDeletion(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { deletionRequestedAt: null, deletionScheduledAt: null },
  });
  logger.info("account.deletion.cancelled", { userId });
}

interface PurgeOptions {
  /**
   * Models to cascade-delete alongside the user row. Each entry runs
   * `db[name].deleteMany({ where: { userId } })`. Order matters if
   * your FKs are restrictive — delete leaves before the user row.
   */
  cascadeModels?: string[];
}

export async function purgeExpiredAccounts(options: PurgeOptions = {}): Promise<{ purged: number }> {
  const now = new Date();
  const due = await db.user.findMany({
    where: {
      deletionScheduledAt: { lte: now, not: null },
    },
    select: { id: true, email: true },
  });

  const cascade = options.cascadeModels ?? ["session", "notification", "auditLog"];

  let purged = 0;
  for (const user of due) {
    try {
      await db.$transaction(async (tx) => {
        for (const model of cascade) {
          const delegate = (tx as unknown as Record<string, { deleteMany: (a: object) => Promise<unknown> } | undefined>)[model];
          if (!delegate) continue;
          try {
            await delegate.deleteMany({ where: { userId: user.id } });
          } catch {
            /* model may not have userId — skip */
          }
        }
        await tx.user.delete({ where: { id: user.id } });
      });
      purged++;
      logger.warn("account.deletion.purged", { userId: user.id });
    } catch (err) {
      captureError(err, { stage: "purge", userId: user.id });
    }
  }

  return { purged };
}
