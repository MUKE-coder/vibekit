/**
 * Admin "Log in as user" — impersonation primitive. Lets a privileged
 * operator (support, owner) act as another user with a strict audit
 * trail and a clearly visible exit path.
 *
 * Wire the API routes:
 *
 *   // app/api/admin/impersonate/[userId]/route.ts
 *   import { startImpersonation, stopImpersonation } from "@/lib/impersonation";
 *
 *   export async function POST(req: Request, { params }: { params: { userId: string } }) {
 *     const session = await requireAuth();
 *     await requireRole(session, ["OWNER", "SUPPORT"]);
 *     await startImpersonation({
 *       actorId: session.user.id,
 *       targetId: params.userId,
 *       reason: new URL(req.url).searchParams.get("reason") ?? "support",
 *     });
 *     return NextResponse.redirect("/");
 *   }
 *
 *   export async function DELETE() {
 *     await stopImpersonation();
 *     return NextResponse.redirect("/admin");
 *   }
 *
 * Pair with an "actor cookie" set alongside the session cookie. The
 * helper writes/clears it; `getImpersonation()` reads it and is what
 * the auth layer checks first when resolving `currentUser`.
 *
 * Always record both the start and stop events in your audit log.
 */

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { captureMessage } from "@/lib/monitoring";

const COOKIE_NAME = "impersonation";
const MAX_AGE_SECONDS = 60 * 60 * 2; // 2-hour ceiling on any session

export interface ImpersonationState {
  actorId: string;
  targetId: string;
  reason: string;
  startedAt: string;
}

interface StartArgs {
  actorId: string;
  targetId: string;
  reason: string;
}

export async function startImpersonation({ actorId, targetId, reason }: StartArgs): Promise<void> {
  if (actorId === targetId) {
    throw new Error("Cannot impersonate yourself");
  }
  const target = await db.user.findUnique({ where: { id: targetId }, select: { id: true, role: true } });
  if (!target) throw new Error("Target user not found");
  if (target.role === "OWNER") {
    throw new Error("Cannot impersonate an owner");
  }

  const state: ImpersonationState = {
    actorId,
    targetId,
    reason,
    startedAt: new Date().toISOString(),
  };

  const jar = await cookies();
  jar.set(COOKIE_NAME, Buffer.from(JSON.stringify(state)).toString("base64url"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  captureMessage("impersonation.start", "warn", { actorId, targetId, reason });

  await db.auditLog
    ?.create?.({
      data: { action: "impersonation.start", actorId, targetId, meta: { reason } },
    })
    .catch(() => {
      /* audit log table optional — log via monitoring instead */
    });
}

export async function stopImpersonation(): Promise<ImpersonationState | null> {
  const state = await getImpersonation();
  const jar = await cookies();
  jar.delete(COOKIE_NAME);

  if (state) {
    captureMessage("impersonation.stop", "info", {
      actorId: state.actorId,
      targetId: state.targetId,
      durationSec: Math.round((Date.now() - new Date(state.startedAt).getTime()) / 1000),
    });
    await db.auditLog
      ?.create?.({
        data: { action: "impersonation.stop", actorId: state.actorId, targetId: state.targetId, meta: {} },
      })
      .catch(() => {});
  }

  return state;
}

/** Read the current impersonation state, or null. Server-only. */
export async function getImpersonation(): Promise<ImpersonationState | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as ImpersonationState;
  } catch {
    return null;
  }
}

/**
 * Wrap `currentUser` in your auth resolver. Returns the impersonated
 * user when an impersonation cookie is present (the actor's session
 * stays intact, but `currentUser` reflects the target).
 *
 *   const session = await auth.api.getSession(...);
 *   const user = await resolveImpersonatedUser(session?.user);
 */
export async function resolveImpersonatedUser<T extends { id: string }>(
  actor: T | null | undefined,
): Promise<{ user: T | null; impersonating: boolean }> {
  if (!actor) return { user: null, impersonating: false };
  const state = await getImpersonation();
  if (!state || state.actorId !== actor.id) return { user: actor, impersonating: false };

  const target = (await db.user.findUnique({ where: { id: state.targetId } })) as T | null;
  return { user: target ?? actor, impersonating: target !== null };
}
