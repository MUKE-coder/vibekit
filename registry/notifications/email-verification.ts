/**
 * Email-verification flow — `sendEmailVerification(userId)` + `verifyEmailToken(token)`.
 * Issues a single-use, hashed, TTL'd token row and emails the user a
 * confirmation link. The verify side checks expiry, marks the user as
 * verified, and deletes the token.
 *
 * Wire two routes:
 *
 *   // app/api/auth/send-verification/route.ts
 *   export async function POST() {
 *     const session = await requireAuth();
 *     await sendEmailVerification(session.user.id);
 *     return NextResponse.json({ ok: true });
 *   }
 *
 *   // app/api/auth/verify/route.ts
 *   export async function GET(req: Request) {
 *     const token = new URL(req.url).searchParams.get("token");
 *     if (!token) return NextResponse.redirect("/auth/verify-failed");
 *     const result = await verifyEmailToken(token);
 *     return NextResponse.redirect(result.ok ? "/auth/verified" : "/auth/verify-failed");
 *   }
 *
 * Schema requirement:
 *
 *   model EmailVerificationToken {
 *     tokenHash String   @id
 *     userId    String
 *     expiresAt DateTime
 *     createdAt DateTime @default(now())
 *     @@index([userId])
 *     @@index([expiresAt])
 *   }
 *
 *   model User { emailVerifiedAt DateTime? ... }
 */

import { createHash, randomBytes } from "crypto";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/send-email";

const TOKEN_BYTES = 32;
const TTL_HOURS = 24;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface SendOptions {
  /** Override the verify URL. Default: `${NEXT_PUBLIC_APP_URL}/api/auth/verify?token=…` */
  buildUrl?: (token: string) => string;
  /** Subject line override. */
  subject?: string;
}

export async function sendEmailVerification(userId: string, options: SendOptions = {}): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  if (!user) throw new Error("User not found");

  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TTL_HOURS * 60 * 60 * 1000);

  await db.emailVerificationToken.deleteMany({ where: { userId } });
  await db.emailVerificationToken.create({ data: { tokenHash, userId, expiresAt } });

  const url =
    options.buildUrl?.(token) ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/auth/verify?token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: user.email,
    subject: options.subject ?? "Verify your email",
    text: `Hi ${user.name ?? "there"},\n\nConfirm your email by opening this link (valid for ${TTL_HOURS}h):\n\n${url}\n\nIf you didn't sign up, you can ignore this message.`,
  });
}

export type VerifyResult =
  | { ok: true; userId: string }
  | { ok: false; reason: "invalid" | "expired" };

export async function verifyEmailToken(rawToken: string): Promise<VerifyResult> {
  const tokenHash = hashToken(rawToken);
  const row = await db.emailVerificationToken.findUnique({ where: { tokenHash } });
  if (!row) return { ok: false, reason: "invalid" };
  if (row.expiresAt.getTime() < Date.now()) {
    await db.emailVerificationToken.delete({ where: { tokenHash } });
    return { ok: false, reason: "expired" };
  }

  await db.$transaction([
    db.user.update({ where: { id: row.userId }, data: { emailVerifiedAt: new Date() } }),
    db.emailVerificationToken.delete({ where: { tokenHash } }),
  ]);

  return { ok: true, userId: row.userId };
}

/** Optional cleanup — call from a daily QStash cron. */
export async function pruneExpiredEmailTokens(): Promise<number> {
  const result = await db.emailVerificationToken.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
  return result.count;
}
