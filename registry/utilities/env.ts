import { z } from "zod";

/**
 * Zod-validated environment variables. Fails fast at boot if anything
 * required is missing or malformed — better than a `process.env.X is
 * undefined` runtime crash three pages into your app.
 *
 * USAGE
 *
 *   1. Import `env` instead of touching `process.env` anywhere in the app:
 *
 *        import { env } from "@/lib/env";
 *        const db = new Database(env.DATABASE_URL);
 *
 *   2. Add new vars by extending the `serverSchema` / `clientSchema` below.
 *      Client-exposed vars MUST be prefixed `NEXT_PUBLIC_` so Next.js
 *      inlines them at build time.
 *
 *   3. Validation runs once at module load. If any required var is missing,
 *      `z.parse` throws and the process exits — better an immediate failure
 *      than silent `undefined` propagation.
 */

// ── Server-only vars (NEVER referenced in client code) ────────────────
const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().url().describe("Neon Postgres connection string"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET must be at least 32 chars"),
  BETTER_AUTH_URL: z.string().url(),
  // Optional integrations — add as your project uses them:
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

// ── Client-exposed vars (must be prefixed NEXT_PUBLIC_) ───────────────
const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

// ── Wiring ────────────────────────────────────────────────────────────

// We can't read `process.env.NEXT_PUBLIC_*` dynamically at runtime in the
// browser — Next inlines them at build time. So we must build the object
// explicitly so each key is statically traceable.
const clientEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
};

const isServer = typeof window === "undefined";

const parsedServer = isServer ? serverSchema.safeParse(process.env) : null;
const parsedClient = clientSchema.safeParse(clientEnv);

if (parsedServer && !parsedServer.success) {
  console.error("\n❌ Invalid server env vars:");
  for (const issue of parsedServer.error.issues) {
    console.error(`  • ${issue.path.join(".")}: ${issue.message}`);
  }
  // Hard fail in production; throw in dev so you see the trace
  if (process.env.NODE_ENV === "production") process.exit(1);
  throw new Error("Invalid server env vars (see logs)");
}

if (!parsedClient.success) {
  const message = parsedClient.error.issues
    .map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  // Don't crash the app for missing public vars — surface a console error
  // so the build logs are loud, but let the page render.
  console.error(`❌ Invalid client env vars:\n${message}`);
}

export const env = {
  ...(parsedServer?.success ? parsedServer.data : ({} as z.infer<typeof serverSchema>)),
  ...(parsedClient.success ? parsedClient.data : ({} as z.infer<typeof clientSchema>)),
} as z.infer<typeof serverSchema> & z.infer<typeof clientSchema>;
