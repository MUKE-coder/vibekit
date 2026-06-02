import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

/**
 * Invoice notification email. Two variants in one template:
 *
 *   - status="paid"     — "Payment received" success email
 *   - status="due"      — "Invoice ready" / payment-request email
 *   - status="overdue"  — gentle reminder
 *
 *   await sendEmail({
 *     to: customer.email,
 *     subject: "Invoice INV-2026-001 — $1,240 due",
 *     react: (
 *       <InvoiceEmail
 *         status="due"
 *         invoiceNumber="INV-2026-001"
 *         customerName="Alice"
 *         issuerName="Acme Inc."
 *         amount="$1,240.00"
 *         dueDate="May 31, 2026"
 *         viewUrl={`${appUrl}/i/${token}`}
 *         lineItems={[
 *           { description: "Consulting", quantity: 8, unitPrice: "$150", total: "$1,200" },
 *           { description: "Late fee",   quantity: 1, unitPrice: "$40",  total: "$40"    },
 *         ]}
 *       />
 *     ),
 *   });
 */

interface InvoiceLineItem {
  description: string;
  quantity?: number;
  unitPrice?: string;
  total: string;
}

interface InvoiceEmailProps {
  status: "paid" | "due" | "overdue";
  invoiceNumber: string;
  /** Recipient (the customer being billed). Falls back to "there". */
  customerName?: string;
  /** Sender (the business issuing the invoice). */
  issuerName?: string;
  amount: string;
  /** ISO-ish display string — already formatted. */
  dueDate?: string;
  /** Link to view / pay the invoice. */
  viewUrl: string;
  /** Optional line items to render in a table. */
  lineItems?: InvoiceLineItem[];
  logoUrl?: string;
}

export function InvoiceEmail({
  status,
  invoiceNumber,
  customerName = "there",
  issuerName = "Your Company",
  amount,
  dueDate,
  viewUrl,
  lineItems,
  logoUrl,
}: InvoiceEmailProps) {
  const headline = HEADLINES[status](invoiceNumber, amount);
  const intro = INTROS[status](customerName, issuerName, dueDate);
  const ctaLabel = CTA_LABELS[status];

  return (
    <BaseLayout
      preview={`${headline} — ${amount}`}
      logoUrl={logoUrl}
      brandName={issuerName}
      supportText={`Questions? Reply to this email and ${issuerName} will get back to you.`}
    >
      <Heading className="m-0 mb-4 text-2xl font-semibold text-gray-900">{headline}</Heading>

      <Text className="m-0 mb-4 text-base leading-6 text-gray-700">{intro}</Text>

      <Section className="my-4 rounded-md border border-gray-200 bg-gray-50 p-4">
        <Text className="m-0 text-xs uppercase tracking-wider text-gray-500">Invoice</Text>
        <Text className="m-0 mt-1 text-lg font-semibold text-gray-900">{invoiceNumber}</Text>
        <Text className="m-0 mt-3 text-xs uppercase tracking-wider text-gray-500">Amount</Text>
        <Text className="m-0 mt-1 text-2xl font-bold text-gray-900">{amount}</Text>
        {dueDate && status !== "paid" ? (
          <>
            <Text className="m-0 mt-3 text-xs uppercase tracking-wider text-gray-500">Due</Text>
            <Text className="m-0 mt-1 text-base font-medium text-gray-900">{dueDate}</Text>
          </>
        ) : null}
      </Section>

      <Button
        href={viewUrl}
        className="inline-block rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white no-underline"
      >
        {ctaLabel}
      </Button>

      {lineItems && lineItems.length > 0 ? (
        <>
          <Hr className="my-6 border-gray-200" />
          <table className="w-full" cellPadding={0} cellSpacing={0}>
            <thead>
              <tr>
                <th align="left" className="border-b border-gray-200 pb-2 text-xs uppercase tracking-wider text-gray-500">
                  Description
                </th>
                <th align="right" className="border-b border-gray-200 pb-2 text-xs uppercase tracking-wider text-gray-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i}>
                  <td className="border-b border-gray-100 py-2 text-sm text-gray-800">
                    {item.description}
                    {item.quantity !== undefined && item.unitPrice ? (
                      <span className="text-gray-500"> · {item.quantity} × {item.unitPrice}</span>
                    ) : null}
                  </td>
                  <td align="right" className="border-b border-gray-100 py-2 text-sm font-medium text-gray-900">
                    {item.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}

      <Text className="m-0 mt-6 text-sm text-gray-500">
        Or copy this link into your browser:
        <br />
        <span className="text-gray-700">{viewUrl}</span>
      </Text>
    </BaseLayout>
  );
}

const HEADLINES = {
  paid: (n: string, a: string) => `Payment received for ${n}`,
  due: (n: string, _a: string) => `Invoice ${n}`,
  overdue: (n: string, _a: string) => `${n} is overdue`,
};

const INTROS = {
  paid: (name: string, issuer: string, _date?: string) =>
    `Thanks, ${name} — ${issuer} has received your payment. The receipt is below for your records.`,
  due: (name: string, issuer: string, date?: string) =>
    `Hi ${name}, here's a new invoice from ${issuer}${date ? `, due ${date}` : ""}. Click below to view the full breakdown and pay online.`,
  overdue: (name: string, issuer: string, date?: string) =>
    `Hi ${name}, this invoice from ${issuer}${date ? ` was due ${date}` : ""} and is now overdue. Click below to settle it.`,
} satisfies Record<"paid" | "due" | "overdue", (name: string, issuer: string, date?: string) => string>;

const CTA_LABELS = {
  paid: "View receipt",
  due: "View invoice",
  overdue: "Pay now",
};
