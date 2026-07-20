import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

/**
 * Time-limited presigned URLs for R2 / S3 objects. Use these so your
 * private bucket assets can be served / uploaded without exposing
 * credentials to the browser.
 *
 *   // Get a presigned URL for a private avatar:
 *   const url = await getPresignedDownloadUrl("avatars/u_123.png", { expiresIn: 600 });
 *
 *   // Get a presigned URL for direct browser upload (no server proxy):
 *   const { url, key } = await getPresignedUploadUrl({
 *     keyPrefix: "uploads",
 *     filename: "screenshot.png",
 *     contentType: "image/png",
 *     expiresIn: 600,
 *   });
 *
 * The S3 client is shared and constructed lazily so this file is safe to
 * import from server components (no client-side cost). Works with Cloudflare
 * R2 via the `endpoint` env var. AWS S3 leaves the endpoint env var blank.
 *
 * Required env (the framework's standard names):
 *   AWS_S3_REGION
 *   AWS_S3_BUCKET_NAME
 *   AWS_S3_ACCESS_KEY_ID
 *   AWS_S3_SECRET_ACCESS_KEY
 *
 * Optional (R2 only):
 *   AWS_S3_ENDPOINT          // e.g. "https://<account>.r2.cloudflarestorage.com"
 *   AWS_S3_FORCE_PATH_STYLE  // "true" for R2 (path-style addressing)
 */

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (_client) return _client;

  const region = process.env.AWS_S3_REGION;
  const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("signed-url: AWS_S3_REGION / ACCESS_KEY_ID / SECRET_ACCESS_KEY must be set");
  }

  _client = new S3Client({
    region,
    endpoint: process.env.AWS_S3_ENDPOINT || undefined,
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === "true",
    credentials: { accessKeyId, secretAccessKey },
  });
  return _client;
}

function getBucket(): string {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) throw new Error("signed-url: AWS_S3_BUCKET_NAME must be set");
  return bucket;
}

/**
 * Generate a presigned GET URL for a private object.
 *
 * ⚠️ SECURITY — THIS FUNCTION PERFORMS NO AUTHORIZATION. It will happily sign
 * a URL for ANY key in the bucket, and the resulting URL bypasses your app
 * entirely. The CALLER MUST verify the current user is allowed to read `key`
 * before calling — otherwise any user who can guess or enumerate a key
 * (`avatars/u_124.png`, `exports/<other-user-id>/...`) gets a working link.
 *
 *   const file = await db.file.findFirst({ where: { key, ownerId: session.user.id } });
 *   if (!file) throw new Error("Not found");     // ← do this FIRST
 *   const url = await getPresignedDownloadUrl(file.key);
 *
 * Never pass a raw `key` straight from a request body or query param.
 */
export async function getPresignedDownloadUrl(
  key: string,
  options: { expiresIn?: number } = {},
): Promise<string> {
  const { expiresIn = 600 } = options;
  const command = new GetObjectCommand({ Bucket: getBucket(), Key: key });
  return getSignedUrl(getClient(), command, { expiresIn });
}

interface PresignedUploadOptions {
  /** Folder-style prefix inside the bucket. Default: "uploads". */
  keyPrefix?: string;
  /** Original filename — used for the extension only; key is randomised. */
  filename: string;
  /** Content type the client will PUT with. */
  contentType: string;
  /** URL TTL in seconds. Default: 600. */
  expiresIn?: number;
}

/**
 * Generate a presigned PUT URL the browser can use to upload directly.
 *
 * ⚠️ A presigned PUT CANNOT enforce a size *cap*. SigV4 signs `content-length`
 * as an EXACT value, not a maximum — signing a 10 MB limit would make every
 * upload that isn't exactly 10,000,000 bytes fail with
 * `403 SignatureDoesNotMatch`. That's why no size option exists here.
 *
 * To actually enforce a maximum, use `createPresignedUploadPost` below, which
 * uses POST policy conditions (`["content-length-range", 0, max]`) — the only
 * presigned mechanism S3/R2 offers that expresses a range.
 */
export async function getPresignedUploadUrl(
  options: PresignedUploadOptions,
): Promise<{ url: string; key: string }> {
  const { keyPrefix = "uploads", filename, contentType, expiresIn = 600 } = options;
  const key = buildKey(keyPrefix, filename);

  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(getClient(), command, { expiresIn });
  return { url, key };
}

/**
 * Presigned POST — the size-enforcing alternative to `getPresignedUploadUrl`.
 * Returns `{ url, fields, key }`; the browser must send a `multipart/form-data`
 * POST with every entry of `fields` appended BEFORE the file:
 *
 *   const { url, fields, key } = await createPresignedUploadPost({
 *     filename: "scan.pdf",
 *     contentType: "application/pdf",
 *     maxSizeBytes: 10_000_000,
 *   });
 *
 *   const form = new FormData();
 *   Object.entries(fields).forEach(([k, v]) => form.append(k, v));
 *   form.append("file", file);                  // must be LAST
 *   await fetch(url, { method: "POST", body: form });
 *
 * S3/R2 rejects anything over `maxSizeBytes` with 400 EntityTooLarge — the cap
 * is enforced by the storage provider, not by trusting the client.
 */
export async function createPresignedUploadPost(
  options: PresignedUploadOptions & { maxSizeBytes: number },
): Promise<{ url: string; fields: Record<string, string>; key: string }> {
  const { keyPrefix = "uploads", filename, contentType, expiresIn = 600, maxSizeBytes } = options;
  const key = buildKey(keyPrefix, filename);

  const { url, fields } = await createPresignedPost(getClient(), {
    Bucket: getBucket(),
    Key: key,
    Expires: expiresIn,
    Conditions: [
      ["content-length-range", 0, maxSizeBytes],
      ["eq", "$Content-Type", contentType],
    ],
    Fields: { "Content-Type": contentType },
  });

  return { url, fields, key };
}

/** Randomised object key that preserves the original extension only. */
function buildKey(keyPrefix: string, filename: string): string {
  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
  return `${keyPrefix.replace(/\/$/, "")}/${crypto.randomUUID()}${ext}`;
}
