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
 *   // Opt out: name `deletedAt` yourself anywhere in `where` and the extension
 *   // leaves your filter alone (it never overwrites an explicit one).
 *   await db.invoice.findMany({ where: { deletedAt: { not: null } } });          // Trash
 *   await db.invoice.findMany({ where: { deletedAt: undefined } });              // include both
 *
 *   // Reads, counts AND aggregations are filtered:
 *   await db.invoice.aggregate({ _sum: { total: true } });  // excludes deleted
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

  /**
   * Inject `deletedAt: null` — but ONLY when the caller hasn't said anything
   * about `deletedAt` themselves.
   *
   * Spreading the injected filter after the caller's `where` clobbers it, which
   * silently breaks every "Trash" screen: `findMany({ where: { deletedAt: { not: null } } })`
   * would be rewritten to `deletedAt: null` and always return `[]`. An explicit
   * `deletedAt` in the query is a deliberate opt-out, so we leave it untouched.
   */
  function withDeletedFilter(args: { where?: Record<string, unknown> }) {
    const where = args.where ?? {};
    if ("deletedAt" in where) return args;
    args.where = { ...where, deletedAt: null };
    return args;
  }

  // Prisma's extension types are model-specific and we extend generically, so
  // the argument is widened rather than suppressed with @ts-expect-error — a
  // suppression here would also hide real errors inside the extension body.
  return client.$extends({
    name: "soft-delete",
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        async findFirst({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        // Same filter as findFirst — without these, an OrThrow read happily
        // returns a soft-deleted row.
        async findFirstOrThrow({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        // Prisma 5+ (`extendedWhereUnique`, GA since 4.16) allows non-unique
        // fields alongside the unique selector in findUnique's `where`, so the
        // filter applies here too — otherwise `findUnique({ where: { id } })`
        // happily returns a row the rest of the app treats as deleted.
        // On Prisma < 4.16 remove these two blocks and use findFirst instead.
        async findUnique({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        async findUniqueOrThrow({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        async count({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        // Aggregations were previously unhandled, so dashboard `_sum` / `_count`
        // totals silently included soft-deleted rows and disagreed with the lists
        // rendered right next to them.
        async aggregate({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
        },
        async groupBy({ model, args, query }) {
          if (!model || !enabled.has(model)) return query(args);
          return query(withDeletedFilter(args));
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
