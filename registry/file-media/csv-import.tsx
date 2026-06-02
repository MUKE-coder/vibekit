"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * 4-step CSV import wizard: Upload → Map → Validate → Import.
 *
 * Bring your own field schema and import handler:
 *
 *   <CsvImport
 *     fields={[
 *       { key: "email",     label: "Email",     required: true },
 *       { key: "firstName", label: "First name" },
 *       { key: "lastName",  label: "Last name" },
 *       { key: "role",      label: "Role",      validate: (v) => ["ADMIN","USER"].includes(v) ? null : "must be ADMIN or USER" },
 *     ]}
 *     onImport={async (rows) => {
 *       const r = await fetch("/api/users/import", { method:"POST", body: JSON.stringify({ rows }) });
 *       return r.json();    // expected: { ok: true } or { errors: [{ row, error }] }
 *     }}
 *   />
 *
 * The wizard runs in the browser — no upload until the user clicks
 * "Import N rows". Rejects with row + error info per bad row so the
 * user can re-export and re-try.
 */

export interface ImportField {
  key: string;
  label: string;
  required?: boolean;
  /** Return an error string (or null when valid). */
  validate?: (value: string) => string | null;
}

interface CsvImportProps {
  fields: ImportField[];
  onImport: (rows: Record<string, string>[]) => Promise<{ ok?: boolean; errors?: { row: number; error: string }[] }>;
  /** Allow rows that have headers we don't map. Default: true (drops them silently). */
  ignoreExtraColumns?: boolean;
  className?: string;
}

type Step = "upload" | "map" | "validate" | "import" | "done";

export function CsvImport({ fields, onImport, ignoreExtraColumns = true, className }: CsvImportProps) {
  const [step, setStep] = React.useState<Step>("upload");
  const [file, setFile] = React.useState<File | null>(null);
  const [headers, setHeaders] = React.useState<string[]>([]);
  const [rows, setRows] = React.useState<string[][]>([]);
  const [mapping, setMapping] = React.useState<Record<string, string>>({}); // fieldKey → csvHeader
  const [errors, setErrors] = React.useState<{ row: number; field: string; error: string }[]>([]);
  const [serverErrors, setServerErrors] = React.useState<{ row: number; error: string }[]>([]);
  const [progress, setProgress] = React.useState(0);

  function reset(): void {
    setStep("upload");
    setFile(null);
    setHeaders([]);
    setRows([]);
    setMapping({});
    setErrors([]);
    setServerErrors([]);
    setProgress(0);
  }

  async function handleFile(f: File): Promise<void> {
    setFile(f);
    const text = await f.text();
    const parsed = parseCsv(text);
    if (parsed.length === 0) {
      alert("File is empty");
      return;
    }
    setHeaders(parsed[0]);
    setRows(parsed.slice(1));
    const next: Record<string, string> = {};
    for (const field of fields) {
      const guess = parsed[0].find((h) => h.toLowerCase().replace(/\s/g, "") === field.key.toLowerCase());
      if (guess) next[field.key] = guess;
    }
    setMapping(next);
    setStep("map");
  }

  function validate(): void {
    const found: typeof errors = [];
    for (let r = 0; r < rows.length; r++) {
      for (const field of fields) {
        const col = mapping[field.key];
        if (!col) {
          if (field.required) found.push({ row: r + 2, field: field.key, error: "column not mapped" });
          continue;
        }
        const colIndex = headers.indexOf(col);
        const value = (rows[r][colIndex] ?? "").trim();
        if (field.required && !value) {
          found.push({ row: r + 2, field: field.key, error: "missing required value" });
          continue;
        }
        if (value && field.validate) {
          const err = field.validate(value);
          if (err) found.push({ row: r + 2, field: field.key, error: err });
        }
      }
    }
    setErrors(found);
    setStep("validate");
  }

  async function runImport(): Promise<void> {
    setStep("import");
    const records = rows.map((row) => {
      const out: Record<string, string> = {};
      for (const field of fields) {
        const col = mapping[field.key];
        if (!col) continue;
        const colIndex = headers.indexOf(col);
        out[field.key] = (row[colIndex] ?? "").trim();
      }
      if (!ignoreExtraColumns) {
        headers.forEach((h, i) => {
          if (!Object.values(mapping).includes(h)) out[h] = (row[i] ?? "").trim();
        });
      }
      return out;
    });

    setProgress(20);
    const result = await onImport(records);
    setProgress(100);

    if (result?.errors?.length) setServerErrors(result.errors);
    setStep("done");
  }

  const validRowCount = rows.length - new Set(errors.map((e) => e.row)).size;

  return (
    <Card className={cn("space-y-5 p-6", className)}>
      <Stepper step={step} />

      {step === "upload" ? (
        <UploadZone onFile={handleFile} file={file} />
      ) : null}

      {step === "map" ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Match your CSV columns to the import fields. {rows.length} rows detected.
          </p>
          <div className="grid gap-2">
            {fields.map((field) => (
              <div key={field.key} className="grid grid-cols-2 items-center gap-3 rounded-md border border-border p-2">
                <div className="text-sm font-medium text-foreground">
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </div>
                <Select
                  value={mapping[field.key] ?? "__none__"}
                  onValueChange={(value) =>
                    setMapping((m) => ({ ...m, [field.key]: value === "__none__" ? "" : value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose column…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— don&apos;t import —</SelectItem>
                    {headers.map((h) => (
                      <SelectItem key={h} value={h}>
                        {h}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              Cancel
            </Button>
            <Button onClick={validate}>Next: validate</Button>
          </div>
        </div>
      ) : null}

      {step === "validate" ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {validRowCount} valid · {errors.length} issue{errors.length === 1 ? "" : "s"}
            </p>
            <span className={cn("inline-flex items-center gap-1 text-xs", errors.length === 0 ? "text-emerald-600" : "text-amber-600")}>
              {errors.length === 0 ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
              {errors.length === 0 ? "Ready to import" : "Fix issues or skip invalid rows"}
            </span>
          </div>
          {errors.length > 0 ? (
            <div className="max-h-60 overflow-auto rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1 text-left">Row</th>
                    <th className="px-2 py-1 text-left">Field</th>
                    <th className="px-2 py-1 text-left">Issue</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.slice(0, 100).map((err, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2 py-1">{err.row}</td>
                      <td className="px-2 py-1 font-medium">{err.field}</td>
                      <td className="px-2 py-1 text-muted-foreground">{err.error}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep("map")}>
              Back
            </Button>
            <Button onClick={runImport} disabled={errors.length > 0}>
              Import {validRowCount} rows
            </Button>
          </div>
        </div>
      ) : null}

      {step === "import" ? (
        <div className="space-y-3">
          <Progress value={progress} />
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Importing rows…
          </p>
        </div>
      ) : null}

      {step === "done" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            {serverErrors.length === 0 ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Imported {rows.length} rows.</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span>
                  Imported {rows.length - serverErrors.length} of {rows.length} rows. {serverErrors.length} failed.
                </span>
              </>
            )}
          </div>
          {serverErrors.length > 0 ? (
            <div className="max-h-40 overflow-auto rounded-md border border-border text-xs">
              {serverErrors.slice(0, 100).map((err, i) => (
                <div key={i} className="flex justify-between border-t border-border px-2 py-1 first:border-t-0">
                  <span>Row {err.row}</span>
                  <span className="text-muted-foreground">{err.error}</span>
                </div>
              ))}
            </div>
          ) : null}
          <Button onClick={reset} variant="outline">
            Import another file
          </Button>
        </div>
      ) : null}
    </Card>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: Step[] = ["upload", "map", "validate", "import"];
  const idx = step === "done" ? steps.length : steps.indexOf(step);
  return (
    <ol className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <li
            className={cn(
              "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 font-medium capitalize",
              i < idx
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                : i === idx
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-muted text-muted-foreground",
            )}
          >
            {i + 1}. {s}
          </li>
          {i < steps.length - 1 ? <span className="text-muted-foreground">→</span> : null}
        </React.Fragment>
      ))}
    </ol>
  );
}

function UploadZone({ file, onFile }: { file: File | null; onFile: (f: File) => void }) {
  const [dragging, setDragging] = React.useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border-2 border-dashed p-10 text-center text-sm transition",
        dragging ? "border-foreground bg-muted" : "border-border bg-card",
      )}
    >
      {file ? (
        <FileSpreadsheet className="h-8 w-8 text-emerald-500" aria-hidden />
      ) : (
        <Upload className="h-8 w-8 text-muted-foreground" aria-hidden />
      )}
      <div className="font-medium text-foreground">{file ? file.name : "Drop your CSV here"}</div>
      <div className="text-xs text-muted-foreground">
        or
        <label className="ml-1 cursor-pointer text-foreground underline">
          browse
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </label>
      </div>
    </div>
  );
}

/**
 * Minimal CSV parser — handles quoted fields, embedded quotes (`""`),
 * and Windows line endings. For most realistic exports this is fine;
 * upgrade to `papaparse` if you need RFC 4180 edge cases.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        field = "";
        rows.push(row);
        row = [];
      } else if (c === "\r") {
        // skip
      } else {
        field += c;
      }
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}
