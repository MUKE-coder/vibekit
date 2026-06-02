"use client";

/**
 * Browser-side upload helper. Requests a presigned PUT URL from your
 * server, then streams the file straight to R2/S3 with progress events
 * and abort support. Returns the public URL (or storage key) on success.
 *
 *   const onChange = async (file: File) => {
 *     const result = await uploadFile(file, {
 *       endpoint: "/api/uploads/sign",   // returns { url, key, publicUrl }
 *       onProgress: setProgress,
 *     });
 *     form.setValue("imageUrl", result.publicUrl);
 *   };
 *
 * The server endpoint should call `getPresignedUploadUrl` from
 * `signed-url` and return `{ url, key, publicUrl }`. The publicUrl is
 * however your project resolves a key into a viewable URL (CDN domain,
 * R2 public bucket, or another presigned download URL).
 *
 * Uses XHR (not fetch) so progress events work — `fetch` doesn't expose
 * upload progress in the browser yet.
 */

interface UploadFileOptions {
  /** Endpoint that returns `{ url, key, publicUrl }`. */
  endpoint: string;
  /** Optional request body sent with the sign request. */
  signBody?: Record<string, unknown>;
  /** Progress callback (0..1). */
  onProgress?: (fraction: number) => void;
  /** Abort signal. */
  signal?: AbortSignal;
}

export interface UploadFileResult {
  /** Storage key inside the bucket. */
  key: string;
  /** Public URL the app can render (may be a CDN, presigned download, or direct). */
  publicUrl: string;
  /** Echoed file metadata. */
  filename: string;
  size: number;
  contentType: string;
}

export class UploadError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "UploadError";
    this.status = status;
  }
}

export async function uploadFile(file: File, options: UploadFileOptions): Promise<UploadFileResult> {
  const { endpoint, signBody, onProgress, signal } = options;

  // 1) Ask server for a presigned URL + key + publicUrl
  const signRes = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
      ...signBody,
    }),
  });
  if (!signRes.ok) {
    throw new UploadError(`Sign request failed: ${signRes.status}`, signRes.status);
  }
  const { url, key, publicUrl } = (await signRes.json()) as {
    url: string;
    key: string;
    publicUrl: string;
  };

  // 2) Upload directly to R2/S3 with progress events
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(event.loaded / event.total);
      }
    });

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new UploadError(`Upload failed: ${xhr.status}`, xhr.status));
    };
    xhr.onerror = () => reject(new UploadError("Network error during upload"));
    xhr.onabort = () => reject(new UploadError("Upload aborted"));

    signal?.addEventListener("abort", () => xhr.abort());

    xhr.send(file);
  });

  return {
    key,
    publicUrl,
    filename: file.name,
    size: file.size,
    contentType: file.type || "application/octet-stream",
  };
}
