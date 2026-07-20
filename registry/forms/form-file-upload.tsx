"use client";

import * as React from "react";
import { File as FileIcon, Loader2, Upload, X } from "lucide-react";
import { useFormContext, type FieldPath, type FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { uploadFile, UploadError } from "@/lib/upload-file";

/**
 * Drag-drop FILE upload field bound to React Hook Form. The companion
 * for `image-upload` — same upload mechanics, but optimised for arbitrary
 * file types (PDFs, documents, archives) and storing just the {key, url}
 * pair in form state.
 *
 *   <FormFileUpload
 *     name="contractFile"
 *     label="Contract"
 *     endpoint="/api/uploads/sign"
 *     accept="application/pdf,.docx"
 *     maxSizeMb={20}
 *     description="PDF or Word doc, up to 20 MB."
 *   />
 *
 * Form state shape (single file mode):
 *   { key: string; url: string; name: string; size: number; contentType: string } | null
 *
 * Pair with `signed-url` on the server. For multi-file uploads, pass
 * `multiple` and the field becomes an array of the same shape.
 */

interface UploadedFile {
  key: string;
  url: string;
  name: string;
  size: number;
  contentType: string;
}

interface FormFileUploadProps {
  name: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** Sign endpoint that returns { url, key, publicUrl }. */
  endpoint: string;
  /** MIME types CSV — what the browser will allow in its picker. */
  accept?: string;
  /** Max single-file size in megabytes. Default: 20. */
  maxSizeMb?: number;
  /** Allow multiple uploads. Form state becomes UploadedFile[]. Default: false. */
  multiple?: boolean;
  /** Optional helper text for the dropzone. */
  helperText?: React.ReactNode;
  className?: string;
}

export function FormFileUpload<V extends FieldValues = FieldValues>({
  name,
  label,
  description,
  endpoint,
  accept,
  maxSizeMb = 20,
  multiple = false,
  helperText,
  className,
}: FormFileUploadProps) {
  const { control } = useFormContext<V>();

  return (
    <FormField
      control={control}
      name={name as FieldPath<V>}
      render={({ field }) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <FileUploadInner
              value={field.value}
              onChange={field.onChange}
              endpoint={endpoint}
              accept={accept}
              maxSizeMb={maxSizeMb}
              multiple={multiple}
              helperText={helperText}
            />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function FileUploadInner({
  value,
  onChange,
  endpoint,
  accept,
  maxSizeMb,
  multiple,
  helperText,
}: {
  value: UploadedFile | UploadedFile[] | null | undefined;
  onChange: (next: UploadedFile | UploadedFile[] | null) => void;
  endpoint: string;
  accept?: string;
  maxSizeMb: number;
  multiple: boolean;
  helperText?: React.ReactNode;
}) {
  const [progress, setProgress] = React.useState<Record<string, number>>({});
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const items: UploadedFile[] = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value && !Array.isArray(value)
      ? [value]
      : [];

  async function handleFiles(filesList: FileList | null) {
    if (!filesList) return;
    setError(null);
    const files = Array.from(filesList);
    // `items` is captured at render time and does NOT update between awaits in
    // this loop, so `onChange([...items, entry])` per iteration would overwrite
    // the previous file instead of appending. Accumulate locally instead —
    // dropping 3 files must keep all 3 in form state.
    const accumulated: UploadedFile[] = [...items];

    for (const file of files) {
      if (accept) {
        const allowed = accept.split(",").map((s) => s.trim());
        const matchesMime = allowed.includes(file.type);
        const matchesExt = allowed.some((a) => a.startsWith(".") && file.name.toLowerCase().endsWith(a.toLowerCase()));
        if (!matchesMime && !matchesExt) {
          setError(`Unsupported file type: ${file.name}`);
          continue;
        }
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`${file.name} is too large. Max ${maxSizeMb} MB.`);
        continue;
      }

      const tempId = `${file.name}-${file.size}-${Date.now()}`;
      setProgress((p) => ({ ...p, [tempId]: 0 }));
      try {
        const result = await uploadFile(file, {
          endpoint,
          onProgress: (p) => setProgress((prev) => ({ ...prev, [tempId]: p })),
        });
        const entry: UploadedFile = {
          key: result.key,
          url: result.publicUrl,
          name: result.filename,
          size: result.size,
          contentType: result.contentType,
        };
        if (multiple) {
          accumulated.push(entry);
          // Push the running accumulator so the UI updates after each upload.
          onChange([...accumulated]);
        } else {
          onChange(entry);
        }
      } catch (err) {
        setError(err instanceof UploadError ? err.message : "Upload failed");
      } finally {
        setProgress((prev) => {
          const next = { ...prev };
          delete next[tempId];
          return next;
        });
      }

      if (!multiple) break;
    }
  }

  function removeAt(i: number) {
    if (multiple) {
      const next = items.filter((_, idx) => idx !== i);
      onChange(next.length === 0 ? null : next);
    } else {
      onChange(null);
    }
  }

  const uploadingCount = Object.keys(progress).length;

  return (
    <div className="flex flex-col gap-2">
      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-sm text-muted-foreground transition-colors",
          dragOver ? "border-foreground bg-muted/60 text-foreground" : "border-border hover:border-foreground/40 hover:text-foreground",
        )}
      >
        <Upload className="h-5 w-5" aria-hidden />
        <span className="font-medium text-foreground">
          {multiple ? "Drop files, or click to browse" : "Drop a file, or click to browse"}
        </span>
        <span className="text-xs">
          {accept ? `${accept} · ` : ""}max {maxSizeMb}MB per file
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {/* In-flight uploads */}
      {uploadingCount > 0 ? (
        <div className="space-y-1.5">
          {Object.entries(progress).map(([id, p]) => (
            <div key={id} className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              <div className="min-w-0 flex-1 truncate text-muted-foreground">{id.split("-").slice(0, -2).join("-")}</div>
              <span className="tabular-nums">{Math.round(p * 100)}%</span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Completed files */}
      {items.length > 0 ? (
        <ul className="space-y-1.5">
          {items.map((file, i) => (
            <li
              key={`${file.key}-${i}`}
              className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <FileIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate text-foreground underline-offset-2 hover:underline"
              >
                {file.name}
              </a>
              <span className="text-xs text-muted-foreground">{formatBytes(file.size)}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAt(i)}
                aria-label="Remove file"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}

      {error ? <p className="text-xs text-destructive">{error}</p> : helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
