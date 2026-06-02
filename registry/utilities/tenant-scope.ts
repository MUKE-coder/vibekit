/**
 * Multi-tenant scoped Prisma client. Wrap the global `db` once per
 * request with the current org / workspace id and every subsequent
 * `findMany` / `findFirst` / `count` automatically filters by that
 * scope. Single source of truth, no manual `where: { orgId }` on
 * every call site.
 *
 *   // app/api/projects/route.ts
 *   import { scopedDb } from "@/lib/tenant-scope";
 *   import { requireOrg } from "@/lib/require-org";
 *
 *   export async function GET() {
 *     const { orgId } = await requireOrg();
 *     const tdb = scopedDb(orgId);
 *     return NextResponse.json(await tdb.project.findMany());
 *   }
 *
 * Write operations also receive `orgId` injected into `data` so the
 * caller can't forget — `tdb.project.create({ data: { name: "X" } })`
 * works without the `orgId` field.
 *
 * Models that have NO `orgId` column are bypassed (e.g. `user`,
 * `auditLog` if you keep that global). Configure the `scoped` set to
 * limit which models the wrapper rewrites.
 */

import { Prisma } from "./generated/prisma";
import { db } from "@/lib/db";

const READ_ACTIONS = new Set(["findMany", "findFirst", "findFirstOrThrow", "count", "aggregate", "groupBy"]);
const WRITE_ACTIONS_INJECT_DATA = new Set(["create", "createMany"]);
const UPDATE_DELETE = new Set(["update", "updateMany", "delete", "deleteMany", "upsert"]);

interface ScopeOptions {
  /** Models that have `orgId`. Default: every model except the ones in `excluded`. */
  included?: string[];
  /** Models to skip even if `included` matches. Default: ["User", "Session", "AuditLog"]. */
  excluded?: string[];
  /** FK column name on each scoped model. Default: "orgId". */
  column?: string;
}

const DEFAULT_EXCLUDED = ["User", "Session", "Account", "VerificationToken", "AuditLog"];

export function scopedDb(orgId: string, options: ScopeOptions = {}): typeof db {
  const column = options.column ?? "orgId";
  const excluded = new Set(options.excluded ?? DEFAULT_EXCLUDED);
  const included = options.included ? new Set(options.included) : null;

  function isScoped(model?: string): boolean {
    if (!model) return false;
    if (excluded.has(model)) return false;
    if (included && !included.has(model)) return false;
    return true;
  }

  return db.$extends({
    name: "tenant-scope",
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          if (!isScoped(model)) return query(args);

          const a = (args as Record<string, unknown>) ?? {};

          if (READ_ACTIONS.has(operation) || UPDATE_DELETE.has(operation)) {
            const where = (a.where as Record<string, unknown> | undefined) ?? {};
            a.where = { ...where, [column]: orgId };
          }

          if (operation === "create") {
            const data = (a.data as Record<string, unknown> | undefined) ?? {};
            a.data = { ...data, [column]: orgId };
          }

          if (operation === "createMany") {
            const data = a.data as Record<string, unknown> | Record<string, unknown>[] | undefined;
            if (Array.isArray(data)) {
              a.data = data.map((row) => ({ ...row, [column]: orgId }));
            } else if (data) {
              a.data = { ...data, [column]: orgId };
            }
          }

          if (operation === "upsert") {
            const create = (a.create as Record<string, unknown> | undefined) ?? {};
            a.create = { ...create, [column]: orgId };
          }

          return query(args);
        },
      },
    },
  }) as unknown as typeof db;
}

/** Type-only helper for routes that need the unscoped client explicitly. */
export const rawDb = db;
export type Db = typeof db;
export type { Prisma };
