import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Server-side auth guard for route handlers and server components.
 *
 * Throws `UnauthorizedError` if no session is present. Returns the typed
 * user otherwise. Designed so the caller never has to handle the null case:
 *
 *   // In an API route:
 *   export async function GET() {
 *     const user = await requireAuth();
 *     const data = await db.invoice.findMany({ where: { userId: user.id } });
 *     return NextResponse.json(data);
 *   }
 *
 *   // In a server component:
 *   export default async function Page() {
 *     const user = await requireAuth();
 *     return <Dashboard userId={user.id} />;
 *   }
 *
 * The thrown error is caught by Next.js — pair with a global `error.tsx` or
 * convert to a 401 response in your route handler.
 *
 * Assumes `@/lib/auth` exports a Better Auth instance (the canonical
 * VibeKit setup — see master_prompt.md). Adapt the `auth.api.getSession`
 * call if your auth client differs.
 */

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  [key: string]: unknown;
}

export class UnauthorizedError extends Error {
  status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  return session.user as SessionUser;
}

/** Returns the user OR null without throwing. Use when a route is partially gated. */
export async function getOptionalUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return (session?.user as SessionUser) ?? null;
}
