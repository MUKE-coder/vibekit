import type { PrismaClient } from "./generated/prisma";

/**
 * Soft-delete helpers for Prisma. Convention: every model that supports
 * soft-delete has a nullable `deletedAt: DateTime?` column. Reads filter
 * to `deletedAt: null` by default; "deleted" rows are recoverable via
 * `restore()` until they're permanently purged.
 *
 * SCHEMA RECIPE — add to every model that needs soft-delete:
 *
 *   model Invoice {
 *     id        String    @id @default(cuid())
 *     ...
 *     deletedAt DateTime? // ← the marker
 *
 *     @@index([deletedAt])
 *   }
 *
 * USAGE — wrap your Prisma client with the extension:
 *
 *   // lib/db.ts
 *   import { PrismaClient } from "@/lib/generated/prisma/client";
 *   import { withSoftDelete } from "@/lib/soft-delete";
 *
 *   const _db = new PrismaClient({ adapter });
 *   export const db = withSoftDelete(_db, ["Invoice", "Customer", "Project"]);
 *
 *   // Now reads auto-filter out deleted rows:
 *   await db.invoice.findMany();           // only non-deleted
 *
 *   // Explicitly include / only deleted:
 *   await db.invoice.findMany({ where: { OR: [{ deletedAt: null }, { deletedAt: { not: null } }] } });
 *   await db.invoice.findMany({ where: { deletedAt: { not: null } } });
 *
 *   // Soft delete instead of hard:
 *   await db.invoice.update({ where: { id }, data: { deletedAt: new Date() } });
 *
 *   // Restore:
 *   await db.invoice.update({ where: { id }, data: { deletedAt: null } });
 *
 *   // Hard purge (e.g. cron job):
 *   await db.invoice.deleteMany({ where: { deletedAt: { lt: thirtyDaysAgo } } });
 */

type Model = string;

/**
 * Wrap a Prisma client so reads on listed models auto-filter `deletedAt: null`.
 * Pass the **model names exactly as Prisma capitalises them** (Pascal: `Invoice`,
 * not `invoice`).
 */
export function withSoftDelete<T extends PrismaClient>(client: T, models: Model[]): T {
  const enabled = new Set(models);

  // @ts-expect-error — Prisma's extension types are model-specific; we extend generically here
  return client.$extends({
    name: "soft-delete",
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (!enabled.has(model)) return query(args);
          args.where = { ...(args.where ?? {}), deletedAt: null };
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (!enabled.has(model)) return query(args);
          args.where = { ...(args.where ?? {}), deletedAt: null };
          return query(args);
        },
        async findUnique({ model, args, query }) {
          // findUnique's where takes only unique constraints — can't add deletedAt cleanly.
          // Use findFirst above when you also want the soft-delete filter.
          return query(args);
        },
        async count({ model, args, query }) {
          if (!enabled.has(model)) return query(args);
          args.where = { ...(args.where ?? {}), deletedAt: null };
          return query(args);
        },
      },
    },
  }) as T;
}

/**
 * Tiny helpers to make the "delete vs restore" calls intention-revealing
 * in your service code:
 *
 *   await softDelete(db.invoice, { id });
 *   await restore(db.invoice, { id });
 */
export async function softDelete<T extends { update: (...args: never[]) => Promise<unknown> }>(
  model: T,
  where: Record<string, unknown>,
) {
  // @ts-expect-error — generic delegate type
  return model.update({ where, data: { deletedAt: new Date() } });
}

export async function restore<T extends { update: (...args: never[]) => Promise<unknown> }>(
  model: T,
  where: Record<string, unknown>,
) {
  // @ts-expect-error — generic delegate type
  return model.update({ where, data: { deletedAt: null } });
}
