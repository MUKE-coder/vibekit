import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

/** Generate a presigned GET URL for a private object. */
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
  /** Max content length to enforce (bytes). Optional. */
  maxSizeBytes?: number;
}

/** Generate a presigned PUT URL the browser can use to upload directly. */
export async function getPresignedUploadUrl(
  options: PresignedUploadOptions,
): Promise<{ url: string; key: string }> {
  const { keyPrefix = "uploads", filename, contentType, expiresIn = 600 } = options;
  const ext = filename.includes(".") ? filename.slice(filename.lastIndexOf(".")) : "";
  const key = `${keyPrefix.replace(/\/$/, "")}/${crypto.randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: key,
    ContentType: contentType,
    ContentLength: options.maxSizeBytes,
  });

  const url = await getSignedUrl(getClient(), command, { expiresIn });
  return { url, key };
}
