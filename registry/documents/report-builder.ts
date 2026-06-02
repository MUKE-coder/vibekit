/**
 * Config-driven report builder. Pass a column schema + rows and get
 * back a typed PDF or Excel buffer. Used for invoice summaries,
 * monthly KPI reports, sales rosters — anything that's "table of
 * data + title + a few totals" rather than a hand-designed PDF.
 *
 *   const buf = await buildReport({
 *     title: "March 2026 — Pipeline",
 *     subtitle: `Generated ${new Date().toLocaleDateString()}`,
 *     columns: [
 *       { key: "owner",    label: "Owner" },
 *       { key: "stage",    label: "Stage" },
 *       { key: "amount",   label: "Amount", align: "right", format: "currency" },
 *       { key: "closeAt",  label: "Close",  format: "date" },
 *     ],
 *     rows: deals,
 *     totals: { amount: deals.reduce((a, d) => a + d.amount, 0) },
 *     currency: "USD",
 *     format: "pdf",       // or "xlsx"
 *   });
 *
 * Use it from a route handler:
 *
 *   return new Response(buf, {
 *     headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="pipeline.pdf"` },
 *   });
 */

import { Buffer } from "buffer";
import * as React from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

export type ReportFormat = "pdf" | "xlsx";

export type ColumnFormat = "text" | "number" | "currency" | "percent" | "date" | "datetime";

export interface ReportColumn {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: number;
  format?: ColumnFormat;
}

export interface BuildReportArgs<Row extends Record<string, unknown>> {
  title: string;
  subtitle?: string;
  columns: ReportColumn[];
  rows: Row[];
  /** Footer totals keyed by column key. */
  totals?: Record<string, number>;
  /** ISO currency. Default: "USD". */
  currency?: string;
  format: ReportFormat;
}

export async function buildReport<Row extends Record<string, unknown>>(args: BuildReportArgs<Row>): Promise<Buffer> {
  return args.format === "pdf" ? buildPdf(args) : buildXlsx(args);
}

/* ─────────── Formatting ─────────── */

function fmtValue(value: unknown, column: ReportColumn, currency: string): string {
  if (value === null || value === undefined) return "";
  switch (column.format) {
    case "currency":
      return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value));
    case "percent":
      return `${(Number(value) * 100).toFixed(1)}%`;
    case "number":
      return new Intl.NumberFormat("en-US").format(Number(value));
    case "date":
      return new Date(value as string | Date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    case "datetime":
      return new Date(value as string | Date).toLocaleString("en-US");
    default:
      return String(value);
  }
}

/* ─────────── PDF ─────────── */

const pdfStyles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#111" },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#666", marginBottom: 16 },
  thead: { flexDirection: "row", borderBottom: 1, borderColor: "#000", paddingBottom: 4, marginBottom: 4 },
  tr: { flexDirection: "row", borderBottom: 0.5, borderColor: "#ddd", paddingVertical: 3 },
  th: { fontWeight: 700, fontSize: 9 },
  td: { fontSize: 9 },
  totals: { flexDirection: "row", borderTop: 1, borderColor: "#000", paddingTop: 4, marginTop: 8, fontWeight: 700 },
});

async function buildPdf<Row extends Record<string, unknown>>(args: BuildReportArgs<Row>): Promise<Buffer> {
  const currency = args.currency ?? "USD";

  const Doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: pdfStyles.page, orientation: "landscape" },
      React.createElement(Text, { style: pdfStyles.title }, args.title),
      args.subtitle ? React.createElement(Text, { style: pdfStyles.subtitle }, args.subtitle) : null,
      React.createElement(
        View,
        { style: pdfStyles.thead },
        ...args.columns.map((col) =>
          React.createElement(
            Text,
            {
              key: col.key,
              style: [
                pdfStyles.th,
                {
                  width: col.width ?? 120,
                  textAlign: col.align ?? "left",
                  paddingHorizontal: 4,
                },
              ],
            },
            col.label,
          ),
        ),
      ),
      ...args.rows.map((row, i) =>
        React.createElement(
          View,
          { key: i, style: pdfStyles.tr },
          ...args.columns.map((col) =>
            React.createElement(
              Text,
              {
                key: col.key,
                style: [
                  pdfStyles.td,
                  {
                    width: col.width ?? 120,
                    textAlign: col.align ?? "left",
                    paddingHorizontal: 4,
                  },
                ],
              },
              fmtValue(row[col.key], col, currency),
            ),
          ),
        ),
      ),
      args.totals
        ? React.createElement(
            View,
            { style: pdfStyles.totals },
            ...args.columns.map((col) =>
              React.createElement(
                Text,
                {
                  key: col.key,
                  style: {
                    width: col.width ?? 120,
                    textAlign: col.align ?? "left",
                    paddingHorizontal: 4,
                  },
                },
                args.totals![col.key] !== undefined ? fmtValue(args.totals![col.key], col, currency) : "",
              ),
            ),
          )
        : null,
    ),
  );

  return renderToBuffer(Doc);
}

/* ─────────── XLSX ─────────── */

async function buildXlsx<Row extends Record<string, unknown>>(args: BuildReportArgs<Row>): Promise<Buffer> {
  const XLSX = await import("xlsx");

  const aoa: unknown[][] = [
    [args.title],
    args.subtitle ? [args.subtitle] : [],
    [],
    args.columns.map((c) => c.label),
    ...args.rows.map((row) =>
      args.columns.map((col) => {
        const value = row[col.key];
        if (col.format === "currency" || col.format === "number" || col.format === "percent") {
          return Number(value ?? 0);
        }
        if (col.format === "date" || col.format === "datetime") {
          return value ? new Date(value as string | Date) : null;
        }
        return value ?? "";
      }),
    ),
  ];

  if (args.totals) {
    aoa.push(args.columns.map((col) => (args.totals![col.key] !== undefined ? args.totals![col.key] : "")));
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!cols"] = args.columns.map((c) => ({ wch: Math.max(12, c.label.length + 4) }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  const arr = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  return Buffer.from(new Uint8Array(arr));
}
