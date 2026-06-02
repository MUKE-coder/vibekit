"use client";

import * as React from "react";
import { Download, ExternalLink, FileArchive, FileAudio, FileCode, FileImage, FileText, FileVideo, File as FileIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Lightweight inline preview for the common file types — image, PDF, video,
 * audio, plain text — with a graceful icon + download fallback for
 * everything else.
 *
 *   <FilePreview src={url} name="contract.pdf" />
 *   <FilePreview src={url} name="screenshot.png" mimeType="image/png" />
 *
 * For a multi-file gallery / lightbox, compose <FilePreview> inside your
 * own carousel — this is the single-asset preview block.
 */

interface FilePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Public URL to the file. Use a signed URL for private R2/S3 assets. */
  src: string;
  /** File name shown in the fallback card and as the default download filename. */
  name: string;
  /** Optional explicit MIME type. If omitted, infer from the URL/extension. */
  mimeType?: string;
  /** Optional file size in bytes (shown in the fallback card if provided). */
  size?: number;
  /** Show / hide the Download button. Default: true. */
  showDownload?: boolean;
  /** Maximum image/video height. Default: "h-96". */
  maxHeightClass?: string;
}

export function FilePreview({
  src,
  name,
  mimeType,
  size,
  showDownload = true,
  maxHeightClass = "h-96",
  className,
  ...props
}: FilePreviewProps) {
  const kind = detectKind(mimeType, name);

  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className,
      )}
    >
      {kind === "image" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className={cn("w-full object-contain bg-muted", maxHeightClass)} />
      ) : kind === "video" ? (
        <video src={src} controls className={cn("w-full", maxHeightClass)} />
      ) : kind === "audio" ? (
        <audio src={src} controls className="w-full p-4" />
      ) : kind === "pdf" ? (
        <iframe
          src={src}
          title={name}
          className={cn("w-full", maxHeightClass)}
        />
      ) : (
        <FallbackCard name={name} size={size} kind={kind} src={src} />
      )}

      {(showDownload || kind === "fallback") && (
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3 py-2 text-xs">
          <div className="min-w-0 truncate text-muted-foreground">{name}</div>
          <div className="flex shrink-0 items-center gap-1">
            {showDownload && (
              <Button variant="ghost" size="sm" asChild>
                <a href={src} download={name} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            )}
            <Button variant="ghost" size="sm" asChild>
              <a href={src} target="_blank" rel="noopener noreferrer" aria-label="Open in new tab">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

type FileKind = "image" | "video" | "audio" | "pdf" | "text" | "code" | "archive" | "fallback";

function detectKind(mimeType: string | undefined, name: string): FileKind {
  const mt = (mimeType ?? "").toLowerCase();
  const ext = name.split(".").pop()?.toLowerCase() ?? "";

  if (mt.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(ext)) return "image";
  if (mt.startsWith("video/") || ["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
  if (mt.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a", "flac"].includes(ext)) return "audio";
  if (mt === "application/pdf" || ext === "pdf") return "pdf";
  if (mt.startsWith("text/") || ["txt", "md", "csv", "log"].includes(ext)) return "text";
  if (["ts", "tsx", "js", "jsx", "json", "py", "rb", "go", "rs", "java", "html", "css"].includes(ext)) return "code";
  if (["zip", "tar", "gz", "rar", "7z"].includes(ext)) return "archive";
  return "fallback";
}

function FallbackCard({ name, size, kind, src }: { name: string; size?: number; kind: FileKind; src: string }) {
  const Icon = ICON_FOR[kind] ?? FileIcon;
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-6 transition-colors hover:bg-accent/40"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-border bg-muted text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-foreground">{name}</div>
        {size !== undefined ? (
          <div className="text-xs text-muted-foreground">{formatBytes(size)}</div>
        ) : null}
      </div>
    </a>
  );
}

const ICON_FOR: Partial<Record<FileKind, React.ComponentType<{ className?: string }>>> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  pdf: FileText,
  text: FileText,
  code: FileCode,
  archive: FileArchive,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
