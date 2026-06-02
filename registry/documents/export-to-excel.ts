/**
 * Lazy-loaded Excel export — keeps the `xlsx` library (~430KB minified)
 * out of your initial bundle. The dynamic import only fires when the
 * user actually clicks Export.
 *
 *   await exportToExcel(invoices, {
 *     filename: "invoices.xlsx",
 *     sheetName: "Invoices",
 *     columns: [
 *       { key: "id",        header: "ID",       width: 10 },
 *       { key: "customer",  header: "Customer", format: (i) => i.customer.name,                  width: 24 },
 *       { key: "total",     header: "Total",    format: (i) => i.total / 100, type: "number",   width: 12 },
 *       { key: "createdAt", header: "Created",  format: (i) => i.createdAt,    type: "date",    width: 18 },
 *     ],
 *   });
 *
 * Pair with the framework's master_prompt → LAZY LOADING rule. Don't
 * import this from a server component — it's a browser-only helper.
 */

export interface ExcelColumn<T> {
  key: string;
  header?: string;
  format?: (row: T) => string | number | boolean | Date | null | undefined;
  /** Optional column width (Excel character units). */
  width?: number;
  /** Cell type hint. Default: "string". Use "number" or "date" for native cells. */
  type?: "string" | "number" | "date";
}

interface ExportToExcelOptions<T> {
  filename: string;
  /** Worksheet name (max 31 chars, no `[]:/\?*`). Default: "Sheet1". */
  sheetName?: string;
  columns: ExcelColumn<T>[];
}

export async function exportToExcel<T>(rows: T[], options: ExportToExcelOptions<T>): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("exportToExcel must be called in the browser");
  }

  // Lazy load — keeps xlsx out of the initial bundle
  const XLSX = await import("xlsx");

  const { filename, sheetName = "Sheet1", columns } = options;

  // Build the array-of-arrays the sheet expects: [headerRow, ...dataRows]
  const headerRow = columns.map((c) => c.header ?? c.key);
  const dataRows = rows.map((row) =>
    columns.map((c) => {
      const v = c.format
        ? c.format(row)
        : (row as Record<string, unknown>)[c.key];
      if (c.type === "number" && typeof v === "string") return Number(v);
      if (c.type === "date" && typeof v === "string") return new Date(v);
      return v ?? "";
    }),
  );

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows]);

  // Apply widths
  ws["!cols"] = columns.map((c) => ({ wch: c.width ?? Math.max(10, (c.header ?? c.key).length + 2) }));

  // Style header row bold (best-effort; not all xlsx readers honour styling)
  for (let c = 0; c < columns.length; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    const cell = ws[addr];
    if (cell) cell.s = { font: { bold: true } };
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

  const out = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(wb, out);
}
