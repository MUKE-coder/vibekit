import { requireAuth, type SessionUser } from "@/lib/require-auth";

/**
 * Role-based server guard. Throws `ForbiddenError` (HTTP 403) if the
 * current user's role isn't in the allowed list. Composes with `requireAuth`.
 *
 *   const user = await requireRole(["ADMIN", "OWNER"]);
 *
 * Pairs with `multi-tenant.md` for org-scoped permissions. For a permission
 * matrix (action × resource) instead of flat role membership, layer
 * `usePermissions` / `requirePermission` on top.
 *
 * Assumes `requireAuth` has been installed (`MUKE-coder/vibekit/require-auth`).
 */

export class ForbiddenError extends Error {
  status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function requireRole(allowedRoles: readonly string[]): Promise<SessionUser> {
  const user = await requireAuth();
  const role = user.role ?? null;

  if (allowedRoles.length === 0) return user; // empty list means any signed-in user
  if (role !== null && allowedRoles.includes(role)) return user;

  throw new ForbiddenError(
    `Role '${role ?? "none"}' is not in allowed list: ${allowedRoles.join(", ")}`,
  );
}
