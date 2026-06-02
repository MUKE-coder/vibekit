import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type * as React from "react";

/**
 * Shared base layout for every transactional email. Wrap your specific
 * templates (welcome, reset password, invoice, etc.) with this so they
 * share the same width, typography, header, and footer.
 *
 *   export function WelcomeEmail({ name }: { name: string }) {
 *     return (
 *       <BaseLayout preview="Welcome to Acme">
 *         <Heading>Welcome, {name}</Heading>
 *         <Text>...</Text>
 *       </BaseLayout>
 *     );
 *   }
 *
 * The layout uses Tailwind via `@react-email/components/tailwind` so
 * you can apply the same `bg-foreground`, `text-muted-foreground` etc.
 * tokens as the rest of the app.
 */

interface BaseLayoutProps {
  /** Preview text shown in inbox previews (Gmail/Outlook clip after ~90 chars). */
  preview?: string;
  /** Optional logo URL. */
  logoUrl?: string;
  /** Brand name shown in the footer. Default: "Your Company". */
  brandName?: string;
  /** Optional footer support email or address line. */
  supportText?: string;
  children: React.ReactNode;
}

export function BaseLayout({
  preview,
  logoUrl,
  brandName = "Your Company",
  supportText,
  children,
}: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      {preview ? <Preview>{preview}</Preview> : null}
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto my-10 max-w-[560px] rounded-lg border border-gray-200 bg-white p-8">
            {logoUrl ? (
              <Section className="mb-6 text-center">
                <Img src={logoUrl} alt={brandName} width="120" height="40" className="mx-auto" />
              </Section>
            ) : null}

            <Section>{children}</Section>

            <Hr className="my-8 border-gray-200" />

            <Section>
              <Text className="m-0 text-xs text-gray-500">
                © {new Date().getFullYear()} {brandName}. All rights reserved.
              </Text>
              {supportText ? (
                <Text className="m-0 mt-1 text-xs text-gray-500">{supportText}</Text>
              ) : null}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
