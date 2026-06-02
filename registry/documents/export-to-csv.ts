/**
 * Lightweight CSV export. No xlsx dependency, no server round-trip — runs
 * client-side and triggers a download.
 *
 *   exportToCSV(invoices, {
 *     filename: "invoices.csv",
 *     columns: [
 *       { key: "id",        header: "ID" },
 *       { key: "customer",  header: "Customer", format: (i) => i.customer.name },
 *       { key: "total",     header: "Total",    format: (i) => formatCurrency(i.total / 100, "USD") },
 *       { key: "createdAt", header: "Created",  format: (i) => formatDate(i.createdAt) },
 *     ],
 *   });
 *
 * Handles RFC-4180 escaping (quotes, commas, newlines inside cells) so
 * the file opens cleanly in Excel / Google Sheets / Numbers without
 * mangling. Adds a UTF-8 BOM so Excel detects the encoding correctly.
 */

export interface CsvColumn<T> {
  /** Object key (used as fallback label if `header` is omitted). */
  key: string;
  /** Column header label in the CSV. */
  header?: string;
  /** Custom value extractor. Defaults to `row[key]`. */
  format?: (row: T) => string | number | boolean | null | undefined;
}

interface ExportToCsvOptions<T> {
  filename: string;
  columns: CsvColumn<T>[];
  /** Field delimiter. Default: ",". Pass ";" for European locales. */
  delimiter?: string;
  /** Add a UTF-8 BOM so Excel detects encoding. Default: true. */
  bom?: boolean;
}

export function toCsvString<T>(rows: T[], options: Omit<ExportToCsvOptions<T>, "filename">): string {
  const { columns, delimiter = "," } = options;

  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map((c) => escape(c.header ?? c.key)).join(delimiter);
  const body = rows
    .map((row) =>
      columns
        .map((c) =>
          escape(
            c.format
              ? c.format(row)
              : ((row as Record<string, unknown>)[c.key] as string | number | boolean | null | undefined),
          ),
        )
        .join(delimiter),
    )
    .join("\r\n");

  return `${header}\r\n${body}`;
}

export function exportToCSV<T>(rows: T[], options: ExportToCsvOptions<T>): void {
  if (typeof window === "undefined") {
    throw new Error("exportToCSV must be called in the browser");
  }
  const { filename, bom = true } = options;
  const csv = toCsvString(rows, options);
  const blob = new Blob([bom ? "﻿" + csv : csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Defer revoke so the download has time to fire
  setTimeout(() => URL.revokeObjectURL(url), 100);
}
