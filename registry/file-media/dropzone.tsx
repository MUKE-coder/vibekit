"use client";

import * as React from "react";
import { File as FileIcon, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Generic drag-drop zone. Headless-ish — handles the drag-over visual,
 * file-type / size validation, and gives you back `{ accepted, rejected }`.
 * Use this when you need to wire something custom (e.g. an avatar
 * cropper) and don't want the full `ImageUpload` / `FormFileUpload`
 * stack.
 *
 *   <Dropzone
 *     accept={["image/*", "application/pdf"]}
 *     maxSizeMb={10}
 *     onFiles={({ accepted, rejected }) => {
 *       handle(accepted);
 *       rejected.forEach((r) => toast.error(`${r.file.name}: ${r.reason}`));
 *     }}
 *   />
 *
 * `multiple` is on by default. Pass `multiple={false}` for single-file
 * pickers — the zone only accepts the first dropped/selected file.
 */

export interface DropzoneRejection {
  file: File;
  reason: "type" | "size";
}

interface DropzoneProps {
  onFiles: (result: { accepted: File[]; rejected: DropzoneRejection[] }) => void;
  /** Accepted MIME globs or extensions, e.g. ["image/*", ".csv"]. */
  accept?: string[];
  /** Reject files larger than this (MB). */
  maxSizeMb?: number;
  multiple?: boolean;
  disabled?: boolean;
  /** Override the default empty-state content. */
  children?: React.ReactNode;
  className?: string;
}

export function Dropzone({
  onFiles,
  accept,
  maxSizeMb,
  multiple = true,
  disabled,
  children,
  className,
}: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function classify(files: FileList | File[]): { accepted: File[]; rejected: DropzoneRejection[] } {
    const accepted: File[] = [];
    const rejected: DropzoneRejection[] = [];
    const list = Array.from(files);
    const items = multiple ? list : list.slice(0, 1);

    for (const file of items) {
      if (accept && !matchesAccept(file, accept)) {
        rejected.push({ file, reason: "type" });
        continue;
      }
      if (maxSizeMb !== undefined && file.size > maxSizeMb * 1024 * 1024) {
        rejected.push({ file, reason: "size" });
        continue;
      }
      accepted.push(file);
    }
    return { accepted, rejected };
  }

  function handle(files: FileList | File[]): void {
    if (disabled) return;
    const result = classify(files);
    onFiles(result);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files?.length) handle(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center text-sm transition",
        dragging
          ? "border-foreground bg-muted text-foreground"
          : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept?.join(",")}
        multiple={multiple}
        disabled={disabled}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handle(e.target.files);
          e.target.value = ""; // allow re-selecting the same file
        }}
      />
      {children ?? (
        <>
          {dragging ? (
            <FileIcon className="h-7 w-7" aria-hidden />
          ) : (
            <Upload className="h-7 w-7" aria-hidden />
          )}
          <div className="font-medium">
            {dragging ? "Drop to upload" : multiple ? "Drag files or click to browse" : "Drag a file or click to browse"}
          </div>
          {accept || maxSizeMb !== undefined ? (
            <div className="text-xs">
              {accept ? accept.join(", ") : "Any file type"}
              {maxSizeMb !== undefined ? ` · up to ${maxSizeMb}MB` : ""}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

function matchesAccept(file: File, accept: string[]): boolean {
  return accept.some((pattern) => {
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -1);
      return file.type.startsWith(prefix);
    }
    return file.type === pattern;
  });
}
