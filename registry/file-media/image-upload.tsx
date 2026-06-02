"use client";

import * as React from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { uploadFile, UploadError } from "@/lib/upload-file";

/**
 * Drag-and-drop image upload with preview. Calls your server endpoint
 * (which returns a presigned URL via `signed-url`), uploads directly to
 * R2/S3 with progress, and emits the resulting publicUrl back to the
 * caller — typically wired into a React Hook Form field.
 *
 *   <ImageUpload
 *     value={form.watch("avatarUrl")}
 *     onChange={(url) => form.setValue("avatarUrl", url, { shouldDirty: true })}
 *     endpoint="/api/uploads/sign"
 *     maxSizeMb={5}
 *     accept="image/png,image/jpeg,image/webp"
 *   />
 *
 * Behaviour:
 *   - Validates type + size client-side BEFORE upload (no wasted bytes)
 *   - Shows an inline preview when `value` is set
 *   - Progress bar while uploading; full-bar then disappears on done
 *   - "Replace" / "Remove" actions on the preview
 *   - Abort current upload if the user clicks Remove mid-flight
 */

interface ImageUploadProps {
  /** Current image URL (controlled). */
  value?: string | null;
  /** Called after a successful upload (`null` when removed). */
  onChange: (url: string | null) => void;
  /** Server endpoint that returns { url, key, publicUrl }. */
  endpoint: string;
  /** Accept header — mime types CSV. Default: any image. */
  accept?: string;
  /** Max file size in megabytes. Default: 10. */
  maxSizeMb?: number;
  /** Visual size of the preview/dropzone. Default: "md". */
  size?: "sm" | "md" | "lg";
  /** Optional helper text below the dropzone. */
  helperText?: React.ReactNode;
  className?: string;
}

const SIZE_CLASS: Record<NonNullable<ImageUploadProps["size"]>, string> = {
  sm: "h-32",
  md: "h-48",
  lg: "h-64",
};

export function ImageUpload({
  value,
  onChange,
  endpoint,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/avif",
  maxSizeMb = 10,
  size = "md",
  helperText,
  className,
}: ImageUploadProps) {
  const [progress, setProgress] = React.useState<number | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  function validateAndStart(file: File | undefined) {
    setError(null);
    if (!file) return;

    const acceptList = accept.split(",").map((s) => s.trim());
    if (!acceptList.includes(file.type)) {
      setError(`Unsupported file type. Allowed: ${accept}`);
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File is too large. Max ${maxSizeMb} MB.`);
      return;
    }

    void startUpload(file);
  }

  async function startUpload(file: File) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setProgress(0);
    try {
      const result = await uploadFile(file, {
        endpoint,
        signal: controller.signal,
        onProgress: (p) => setProgress(p),
      });
      onChange(result.publicUrl);
    } catch (err) {
      if (err instanceof UploadError) setError(err.message);
      else setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setProgress(null);
      abortRef.current = null;
    }
  }

  function handleRemove() {
    abortRef.current?.abort();
    onChange(null);
    setError(null);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const uploading = progress !== null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {value && !uploading ? (
        // Preview state
        <div
          className={cn(
            "group relative w-full overflow-hidden rounded-lg border border-border bg-muted",
            SIZE_CLASS[size],
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded image" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button type="button" size="sm" variant="secondary" onClick={() => inputRef.current?.click()}>
              <ImagePlus className="mr-1.5 h-3.5 w-3.5" /> Replace
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={handleRemove}>
              <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        // Dropzone state
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (uploading) return;
            validateAndStart(e.dataTransfer.files[0]);
          }}
          disabled={uploading}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground transition-colors",
            SIZE_CLASS[size],
            dragOver ? "border-foreground bg-muted/60 text-foreground" : "border-border hover:border-foreground/40 hover:text-foreground",
            uploading && "cursor-not-allowed opacity-70",
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              <div className="w-2/3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full bg-foreground transition-[width] duration-150"
                    style={{ width: `${Math.round((progress ?? 0) * 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-center text-xs">
                  Uploading… {Math.round((progress ?? 0) * 100)}%
                </div>
              </div>
            </>
          ) : (
            <>
              <ImagePlus className="h-6 w-6" aria-hidden />
              <span className="font-medium text-foreground">Drop an image, or click to browse</span>
              <span className="text-xs">
                {accept.replace(/image\//g, "")} · max {maxSizeMb}MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => validateAndStart(e.target.files?.[0])}
      />

      {error ? <p className="text-xs text-destructive">{error}</p> : helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
