/**
 * Server-side invoice PDF generator using @react-pdf/renderer. Renders
 * a React tree directly to a PDF buffer — no headless browser needed.
 *
 *   import { generateInvoicePdf } from "@/lib/invoice-pdf";
 *
 *   // app/api/invoices/[id]/pdf/route.ts
 *   // Next 15+: route `params` is a Promise and must be awaited.
 *   export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
 *     const { id } = await params;
 *     const invoice = await db.invoice.findUniqueOrThrow({
 *       where: { id },
 *       include: { items: true, customer: true, org: true },
 *     });
 *     const pdf = await generateInvoicePdf({
 *       number: invoice.number,
 *       status: invoice.status,
 *       issuedAt: invoice.issuedAt,
 *       dueAt:    invoice.dueAt,
 *       seller:   { name: invoice.org.name, address: invoice.org.address ?? "" },
 *       buyer:    { name: invoice.customer.name, email: invoice.customer.email, address: "" },
 *       items:    invoice.items.map((i) => ({ description: i.description, qty: i.qty, unitPrice: i.unitPrice, total: i.total })),
 *       currency: invoice.currency,
 *       subtotal: invoice.subtotal,
 *       tax:      invoice.tax,
 *       total:    invoice.total,
 *     });
 *     return new Response(pdf, {
 *       headers: { "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="invoice-${invoice.number}.pdf"` },
 *     });
 *   }
 */

import { Buffer } from "buffer";
import * as React from "react";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";

export interface InvoiceParty {
  name: string;
  email?: string;
  address?: string;
}

export interface InvoiceLineItem {
  description: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface InvoicePdfData {
  number: string;
  status: "paid" | "due" | "overdue";
  issuedAt: Date | string;
  dueAt: Date | string;
  seller: InvoiceParty;
  buyer: InvoiceParty;
  items: InvoiceLineItem[];
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
}

const styles = StyleSheet.create({
  page: { padding: 48, fontSize: 11, fontFamily: "Helvetica", color: "#111" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  brand: { fontSize: 18, fontWeight: 700 },
  status: { fontSize: 11, padding: 4, borderRadius: 4, textTransform: "uppercase", fontWeight: 700 },
  meta: { color: "#555", fontSize: 10 },
  partiesRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  partyBlock: { width: "48%" },
  partyLabel: { fontSize: 9, color: "#888", textTransform: "uppercase", marginBottom: 4 },
  partyName: { fontWeight: 700, marginBottom: 2 },
  table: { marginTop: 12 },
  thead: { flexDirection: "row", borderBottom: 1, borderColor: "#000", paddingBottom: 4, marginBottom: 4 },
  tr: { flexDirection: "row", borderBottom: 0.5, borderColor: "#ddd", paddingVertical: 4 },
  th: { fontWeight: 700, fontSize: 10 },
  td: { fontSize: 10 },
  cellDesc: { flex: 1 },
  cellQty: { width: 50, textAlign: "right" },
  cellUnit: { width: 80, textAlign: "right" },
  cellTotal: { width: 90, textAlign: "right" },
  totalsBlock: { marginTop: 16, alignSelf: "flex-end", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2 },
  totalsGrand: { borderTop: 1, borderColor: "#000", paddingTop: 6, marginTop: 6, fontWeight: 700 },
  notes: { marginTop: 32, fontSize: 9, color: "#555" },
});

const STATUS_BG: Record<InvoicePdfData["status"], string> = {
  paid: "#dcfce7",
  due: "#fef3c7",
  overdue: "#fee2e2",
};

const STATUS_FG: Record<InvoicePdfData["status"], string> = {
  paid: "#15803d",
  due: "#92400e",
  overdue: "#991b1b",
};

function fmtMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function fmtDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  return React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(
        View,
        { style: styles.header },
        React.createElement(
          View,
          null,
          React.createElement(Text, { style: styles.brand }, "Invoice"),
          React.createElement(Text, { style: styles.meta }, `# ${data.number}`),
        ),
        React.createElement(
          Text,
          { style: { ...styles.status, backgroundColor: STATUS_BG[data.status], color: STATUS_FG[data.status] } },
          data.status,
        ),
      ),
      React.createElement(
        View,
        { style: styles.partiesRow },
        React.createElement(
          View,
          { style: styles.partyBlock },
          React.createElement(Text, { style: styles.partyLabel }, "From"),
          React.createElement(Text, { style: styles.partyName }, data.seller.name),
          data.seller.address ? React.createElement(Text, null, data.seller.address) : null,
        ),
        React.createElement(
          View,
          { style: styles.partyBlock },
          React.createElement(Text, { style: styles.partyLabel }, "Billed to"),
          React.createElement(Text, { style: styles.partyName }, data.buyer.name),
          data.buyer.email ? React.createElement(Text, null, data.buyer.email) : null,
          data.buyer.address ? React.createElement(Text, null, data.buyer.address) : null,
        ),
      ),
      React.createElement(
        View,
        { style: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 } },
        React.createElement(Text, { style: styles.meta }, `Issued: ${fmtDate(data.issuedAt)}`),
        React.createElement(Text, { style: styles.meta }, `Due: ${fmtDate(data.dueAt)}`),
      ),
      React.createElement(
        View,
        { style: styles.table },
        React.createElement(
          View,
          { style: styles.thead },
          React.createElement(Text, { style: [styles.th, styles.cellDesc] }, "Description"),
          React.createElement(Text, { style: [styles.th, styles.cellQty] }, "Qty"),
          React.createElement(Text, { style: [styles.th, styles.cellUnit] }, "Unit"),
          React.createElement(Text, { style: [styles.th, styles.cellTotal] }, "Total"),
        ),
        ...data.items.map((item, i) =>
          React.createElement(
            View,
            { key: i, style: styles.tr },
            React.createElement(Text, { style: [styles.td, styles.cellDesc] }, item.description),
            React.createElement(Text, { style: [styles.td, styles.cellQty] }, String(item.qty)),
            React.createElement(Text, { style: [styles.td, styles.cellUnit] }, fmtMoney(item.unitPrice, data.currency)),
            React.createElement(Text, { style: [styles.td, styles.cellTotal] }, fmtMoney(item.total, data.currency)),
          ),
        ),
      ),
      React.createElement(
        View,
        { style: styles.totalsBlock },
        React.createElement(
          View,
          { style: styles.totalsRow },
          React.createElement(Text, null, "Subtotal"),
          React.createElement(Text, null, fmtMoney(data.subtotal, data.currency)),
        ),
        React.createElement(
          View,
          { style: styles.totalsRow },
          React.createElement(Text, null, "Tax"),
          React.createElement(Text, null, fmtMoney(data.tax, data.currency)),
        ),
        React.createElement(
          View,
          { style: [styles.totalsRow, styles.totalsGrand] },
          React.createElement(Text, null, "Total"),
          React.createElement(Text, null, fmtMoney(data.total, data.currency)),
        ),
      ),
      data.notes ? React.createElement(Text, { style: styles.notes }, data.notes) : null,
    ),
  );
}

export async function generateInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  // Called directly rather than via createElement: renderToBuffer requires a
  // ReactElement<DocumentProps> — i.e. a <Document> element. Wrapping it in a
  // component element would type the props as { data }, not DocumentProps.
  return renderToBuffer(InvoiceDocument({ data }));
}
