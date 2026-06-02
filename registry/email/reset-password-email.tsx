import { Button, Heading, Text } from "@react-email/components";
import { BaseLayout } from "./base-layout";

/**
 * Password reset email template. Sent when a user requests a reset.
 * Pair with Better Auth's reset flow:
 *
 *   import { sendEmail } from "@/lib/send-email";
 *   import { ResetPasswordEmail } from "@/emails/reset-password-email";
 *
 *   await sendEmail({
 *     to: user.email,
 *     subject: "Reset your password",
 *     react: (
 *       <ResetPasswordEmail
 *         name={user.name}
 *         resetUrl={`${appUrl}/auth/reset-password?token=${token}`}
 *         expiresInMinutes={30}
 *       />
 *     ),
 *   });
 */

interface ResetPasswordEmailProps {
  /** Recipient's name. Falls back to "there". */
  name?: string;
  /** Single-use reset URL. */
  resetUrl: string;
  /** How long the link stays valid. Default: 60 (minutes). */
  expiresInMinutes?: number;
  /** Optional logo URL. */
  logoUrl?: string;
  /** Brand name. Default: "Your Company". */
  brandName?: string;
}

export function ResetPasswordEmail({
  name = "there",
  resetUrl,
  expiresInMinutes = 60,
  logoUrl,
  brandName = "Your Company",
}: ResetPasswordEmailProps) {
  return (
    <BaseLayout
      preview={`Reset your ${brandName} password`}
      logoUrl={logoUrl}
      brandName={brandName}
      supportText="If you didn't request this, you can safely ignore this email."
    >
      <Heading className="m-0 mb-4 text-2xl font-semibold text-gray-900">
        Reset your password
      </Heading>

      <Text className="m-0 mb-4 text-base leading-6 text-gray-700">
        Hi {name}, click the button below to choose a new password. The link expires in{" "}
        <strong>{expiresInMinutes} minute{expiresInMinutes === 1 ? "" : "s"}</strong>.
      </Text>

      <Button
        href={resetUrl}
        className="inline-block rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white no-underline"
      >
        Reset password
      </Button>

      <Text className="m-0 mt-6 text-sm text-gray-500">
        Or copy and paste this link into your browser:
        <br />
        <span className="text-gray-700">{resetUrl}</span>
      </Text>

      <Text className="m-0 mt-6 text-sm text-gray-500">
        For your security, this link can only be used once.
      </Text>
    </BaseLayout>
  );
}
