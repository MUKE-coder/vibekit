import type * as React from "react";

/**
 * `notify(userId, type, data)` — one server-side call that produces BOTH
 * an in-app notification row AND a transactional email, respecting each
 * recipient's preferences.
 *
 * The helper is generic over your project's notification "types" —
 * declare them once and the helper knows which email template to render
 * for each and which in-app payload to write.
 *
 *   // lib/notify.ts (project-side wiring)
 *   import { defineNotify } from "@/lib/notify";
 *   import { db } from "@/lib/db";
 *   import { sendEmail } from "@/lib/send-email";
 *   import { WelcomeEmail } from "@/emails/welcome-email";
 *   import { InvoicePaidEmail } from "@/emails/invoice-paid-email";
 *
 *   export const notify = defineNotify({
 *     types: {
 *       "user.welcome": {
 *         email: (ctx, data: { name: string; appUrl: string }) =>
 *           ({ subject: `Welcome to Acme, ${data.name}`, react: <WelcomeEmail name={data.name} ctaUrl={data.appUrl} /> }),
 *         inApp: (ctx, data) => ({ title: "Welcome 👋", body: "Get started with your first project." }),
 *       },
 *       "invoice.paid": {
 *         email: (ctx, data: { invoiceId: string; amount: string }) =>
 *           ({ subject: `Payment received for ${data.invoiceId}`, react: <InvoicePaidEmail {...data} /> }),
 *         inApp: (_, data) => ({ title: "Payment received", body: `Invoice ${data.invoiceId} paid (${data.amount}).`, href: `/invoices/${data.invoiceId}` }),
 *       },
 *     },
 *     sendEmail,
 *     // Implement this to persist the in-app row in your `Notification` table
 *     persistInApp: (row) => db.notification.create({ data: row }),
 *     // Implement this to resolve the user's email + per-channel preferences
 *     loadUser: async (userId) => {
 *       const u = await db.user.findUniqueOrThrow({ where: { id: userId }, include: { notificationPrefs: true } });
 *       return { email: u.email, name: u.name, prefs: u.notificationPrefs ?? {} };
 *     },
 *   });
 *
 *   // Now anywhere on the server:
 *   await notify(user.id, "invoice.paid", { invoiceId: "INV-1024", amount: "$1,240" });
 *
 * REQUIRED SCHEMA (Prisma):
 *
 *   model Notification {
 *     id        String   @id @default(cuid())
 *     userId    String
 *     type      String
 *     title     String
 *     body      String?
 *     href      String?
 *     metadata  Json?
 *     readAt    DateTime?
 *     createdAt DateTime @default(now())
 *     user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
 *
 *     @@index([userId, createdAt])
 *     @@index([userId, readAt])
 *   }
 *
 *   // Optional per-user preferences:
 *   model NotificationPrefs {
 *     userId          String  @id
 *     emailEnabled    Boolean @default(true)
 *     emailMutedTypes String[]
 *     user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
 *   }
 */

type EmailPayload = {
  subject: string;
  /** React Email template — pass JSX. */
  react: React.ReactElement;
};

interface InAppPayload {
  title: string;
  body?: string;
  href?: string;
  metadata?: Record<string, unknown>;
}

interface UserResolution {
  email: string;
  name?: string | null;
  /** Per-channel preferences. */
  prefs?: {
    emailEnabled?: boolean;
    /** Type ids the user has muted email for. */
    emailMutedTypes?: string[];
    inAppEnabled?: boolean;
    inAppMutedTypes?: string[];
  };
}

interface NotifyContext {
  userId: string;
  type: string;
  user: UserResolution;
}

type TypeDefinition<Data> = {
  email?: (ctx: NotifyContext, data: Data) => EmailPayload | null;
  inApp?: (ctx: NotifyContext, data: Data) => InAppPayload | null;
};

type TypeMap = Record<string, TypeDefinition<unknown>>;

interface DefineNotifyOptions<T extends TypeMap> {
  types: T;
  sendEmail: (input: {
    to: string;
    subject: string;
    react: React.ReactElement;
  }) => Promise<unknown>;
  persistInApp: (row: {
    userId: string;
    type: string;
    title: string;
    body?: string;
    href?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<unknown>;
  loadUser: (userId: string) => Promise<UserResolution>;
}

type DataFor<T extends TypeMap, K extends keyof T> = T[K] extends TypeDefinition<infer D> ? D : never;

/**
 * Build the typed `notify(userId, type, data)` function from your project's
 * type map + email/in-app adapters.
 */
export function defineNotify<T extends TypeMap>(options: DefineNotifyOptions<T>) {
  return async function notify<K extends keyof T & string>(
    userId: string,
    type: K,
    data: DataFor<T, K>,
  ): Promise<void> {
    const def = options.types[type];
    if (!def) throw new Error(`Unknown notification type: ${type}`);

    const user = await options.loadUser(userId);
    const ctx: NotifyContext = { userId, type, user };

    // In-app
    const inApp = def.inApp?.(ctx, data);
    const inAppEnabled = user.prefs?.inAppEnabled !== false;
    const inAppMuted = user.prefs?.inAppMutedTypes?.includes(type) ?? false;
    if (inApp && inAppEnabled && !inAppMuted) {
      await options.persistInApp({
        userId,
        type,
        title: inApp.title,
        body: inApp.body,
        href: inApp.href,
        metadata: inApp.metadata,
      });
    }

    // Email
    const email = def.email?.(ctx, data);
    const emailEnabled = user.prefs?.emailEnabled !== false;
    const emailMuted = user.prefs?.emailMutedTypes?.includes(type) ?? false;
    if (email && emailEnabled && !emailMuted) {
      await options.sendEmail({ to: user.email, subject: email.subject, react: email.react });
    }
  };
}
