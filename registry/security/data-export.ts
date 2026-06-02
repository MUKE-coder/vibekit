/**
 * GDPR / "download my data" export. Bundles the user's records across
 * any number of Prisma models into a single zipped JSON archive, then
 * uploads it to private object storage and emails a signed URL.
 *
 * Designed as a background job — exports for active users can easily
 * be 10–100 MB. Queue from any user-facing route:
 *
 *   // app/api/account/export/route.ts
 *   export async function POST() {
 *     const session = await requireAuth();
 *     await jobs.enqueue("data-export", { userId: session.user.id });
 *     return NextResponse.json({ queued: true });
 *   }
 *
 *   // app/api/jobs/data-export/route.ts
 *   export const POST = defineJob("data-export", {
 *     schema: z.object({ userId: z.string() }),
 *     handler: async ({ userId }) => {
 *       await exportUserData(userId, {
 *         models: ["user", "post", "comment", "notification", "auditLog"],
 *         emailWhenReady: true,
 *       });
 *     },
 *   });
 *
 * Storage: writes to `exports/{userId}/{timestamp}.zip` via the same
 * R2/S3 client as `signed-url`. Email step delivers a 7-day download
 * link.
 */

import { Readable } from "stream";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import archiver from "archiver";

import { db } from "@/lib/db";
import { getPresignedDownloadUrl } from "@/lib/signed-url";
import { sendEmail } from "@/lib/send-email";
import { captureError, logger } from "@/lib/monitoring";

interface ExportOptions {
  /** Prisma model names to include. Each must support `findMany`. */
  models: string[];
  /** Send the user the download link when finished. Default: false. */
  emailWhenReady?: boolean;
  /** Custom prefix for the storage key. Default: "exports". */
  prefix?: string;
}

export async function exportUserData(userId: string, options: ExportOptions): Promise<{ key: string }> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { id: true, email: true } });
  if (!user) throw new Error("User not found");

  const data: Record<string, unknown[]> = {};
  for (const model of options.models) {
    try {
      // Each model is expected to expose a `userId` foreign key.
      // Customise per-model in a switch if your schema is different.
      const records = await (db as unknown as Record<string, { findMany: (a: object) => Promise<unknown[]> }>)
        [model]
        .findMany({ where: { userId } });
      data[model] = records;
    } catch (err) {
      captureError(err, { stage: "collect", userId, model });
      data[model] = [];
    }
  }

  const zip = archiver("zip", { zlib: { level: 9 } });
  const chunks: Buffer[] = [];
  zip.on("data", (chunk) => chunks.push(Buffer.from(chunk)));

  zip.append(JSON.stringify({ exportedAt: new Date().toISOString(), userId }, null, 2), {
    name: "metadata.json",
  });
  for (const [model, records] of Object.entries(data)) {
    zip.append(JSON.stringify(records, null, 2), { name: `${model}.json` });
  }
  await zip.finalize();
  const buf = Buffer.concat(chunks);

  const key = `${options.prefix ?? "exports"}/${userId}/${Date.now()}.zip`;

  const { S3Client } = await import("@aws-sdk/client-s3");
  const s3 = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: Boolean(process.env.S3_ENDPOINT),
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
    },
  });

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: Readable.from(buf),
      ContentType: "application/zip",
      ContentLength: buf.byteLength,
    }),
  );

  logger.info("data-export.done", { userId, key, sizeBytes: buf.byteLength });

  if (options.emailWhenReady) {
    const url = await getPresignedDownloadUrl(key, { expiresIn: 60 * 60 * 24 * 7 });
    await sendEmail({
      to: user.email,
      subject: "Your data export is ready",
      text: `Your account data export is ready. Download (link valid for 7 days):\n\n${url}\n\nIf you didn't request this, contact support immediately.`,
    });
  }

  return { key };
}
