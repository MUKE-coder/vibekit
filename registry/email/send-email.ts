import { Resend } from "resend";

/**
 * Typed Resend wrapper. One place to send any transactional email so you
 * don't sprinkle `new Resend(...)` calls across server routes.
 *
 *   import { sendEmail } from "@/lib/send-email";
 *
 *   await sendEmail({
 *     to: user.email,
 *     subject: "Welcome to Acme",
 *     react: <WelcomeEmail name={user.name} />,
 *     // text/html alternatives also supported
 *   });
 *
 * Dev-mode preview: if RESEND_DEV_PREVIEW=true (or NODE_ENV=development
 * with no RESEND_API_KEY), payloads are logged instead of sent. Useful
 * for local development without burning a free-tier send.
 */

const apiKey = process.env.RESEND_API_KEY;
const fromAddress = process.env.RESEND_FROM_EMAIL;

const isDevPreview =
  process.env.RESEND_DEV_PREVIEW === "true" ||
  (process.env.NODE_ENV !== "production" && !apiKey);

const client = apiKey ? new Resend(apiKey) : null;

interface BaseEmailInput {
  to: string | string[];
  subject: string;
  /** Override the from address per-send. Defaults to RESEND_FROM_EMAIL. */
  from?: string;
  /** Optional reply-to header. */
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
}

type EmailInputWithReact = BaseEmailInput & {
  react: React.ReactElement;
  html?: never;
  text?: never;
};
type EmailInputWithHtml = BaseEmailInput & {
  react?: never;
  html: string;
  text?: string;
};
type EmailInputWithText = BaseEmailInput & {
  react?: never;
  html?: never;
  text: string;
};

export type SendEmailInput = EmailInputWithReact | EmailInputWithHtml | EmailInputWithText;

export interface SendEmailResult {
  id: string | null;
  /** True only when actually delivered (not in dev preview). */
  sent: boolean;
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const from = input.from ?? fromAddress;
  if (!from) {
    throw new Error("sendEmail: RESEND_FROM_EMAIL is not set and no `from` override passed");
  }

  if (isDevPreview) {
    console.log("[sendEmail · dev preview]", {
      from,
      to: input.to,
      subject: input.subject,
      hasReact: !!("react" in input && input.react),
      hasHtml: !!("html" in input && input.html),
      hasText: !!("text" in input && input.text),
    });
    return { id: null, sent: false };
  }

  if (!client) {
    throw new Error("sendEmail: RESEND_API_KEY is not set");
  }

  const { data, error } = await client.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    replyTo: input.replyTo,
    cc: input.cc,
    bcc: input.bcc,
    ...("react" in input && input.react ? { react: input.react } : {}),
    ...("html" in input && input.html ? { html: input.html } : {}),
    ...("text" in input && input.text ? { text: input.text } : {}),
  } as never);

  if (error) {
    throw new Error(`sendEmail failed: ${error.name} — ${error.message}`);
  }

  return { id: data?.id ?? null, sent: true };
}
