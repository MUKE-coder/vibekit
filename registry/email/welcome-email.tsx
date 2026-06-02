import { Button, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

/**
 * Welcome email template. Sent on first sign-up. Customise the headline
 * and CTA copy to match the product voice.
 *
 *   import { sendEmail } from "@/lib/send-email";
 *   import { WelcomeEmail } from "@/emails/welcome-email";
 *
 *   await sendEmail({
 *     to: user.email,
 *     subject: "Welcome to Acme",
 *     react: <WelcomeEmail name={user.name} ctaUrl={`${appUrl}/dashboard`} />,
 *   });
 */

interface WelcomeEmailProps {
  /** Recipient's first name (or full name). Falls back to "there". */
  name?: string;
  /** Where the primary CTA points (typically the dashboard). */
  ctaUrl: string;
  /** Override the CTA label. Default: "Open your dashboard". */
  ctaLabel?: string;
  /** Optional logo URL passed through to BaseLayout. */
  logoUrl?: string;
  /** Brand name shown in greetings + footer. Default: "Your Company". */
  brandName?: string;
  /** Optional one-line product pitch shown under the headline. */
  tagline?: string;
}

export function WelcomeEmail({
  name = "there",
  ctaUrl,
  ctaLabel = "Open your dashboard",
  logoUrl,
  brandName = "Your Company",
  tagline,
}: WelcomeEmailProps) {
  return (
    <BaseLayout
      preview={`Welcome to ${brandName} — let's get you started`}
      logoUrl={logoUrl}
      brandName={brandName}
    >
      <Heading className="m-0 mb-4 text-2xl font-semibold text-gray-900">
        Welcome to {brandName}, {name} 👋
      </Heading>

      {tagline ? (
        <Text className="m-0 mb-4 text-base leading-6 text-gray-700">{tagline}</Text>
      ) : null}

      <Text className="m-0 mb-6 text-base leading-6 text-gray-700">
        Thanks for joining. Your account is ready — you can head to the dashboard whenever you're
        set to start exploring. If you need a hand, just reply to this email.
      </Text>

      <Button
        href={ctaUrl}
        className="inline-block rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white no-underline"
      >
        {ctaLabel}
      </Button>

      <Text className="m-0 mt-6 text-sm text-gray-500">
        Or copy and paste this link into your browser:{" "}
        <span className="text-gray-700">{ctaUrl}</span>
      </Text>
    </BaseLayout>
  );
}
