import type { z, ZodSchema } from "zod";
import { buildPrismaWhere, buildPrismaOrderBy } from "@/lib/build-prisma-where";

/**
 * Helper for the server side of the framework's table contract:
 *
 *   client (useTableState) → URL params → API route → THIS helper → Prisma
 *
 * Bundles the standard moves every list route needs: parse + validate the
 * incoming search params, build a Prisma `where` from the typed filter
 * schema, build an `orderBy`, run findMany + count in parallel, return
 * `{ data, total, page, pageSize, totalPages }` — the shape
 * `usePaginatedQuery` expects.
 *
 *   // app/api/invoices/route.ts
 *   import { fetchTable } from "@/lib/server-table-fetcher";
 *   import { db } from "@/lib/db";
 *
 *   const QuerySchema = z.object({
 *     page: z.coerce.number().int().min(1).default(1),
 *     pageSize: z.coerce.number().int().min(1).max(200).default(20),
 *     sort: z.string().optional(),
 *     dir: z.enum(["asc", "desc"]).default("desc"),
 *     q: z.string().optional(),
 *     status: z.string().optional(),    // comma-separated
 *   });
 *
 *   export async function GET(req: Request) {
 *     const user = await requireAuth();
 *     return fetchTable(req, {
 *       schema: QuerySchema,
 *       findMany: (args) => db.invoice.findMany({ ...args, where: { ...args.where, userId: user.id } }),
 *       count:    (args) => db.invoice.count({ where: { ...args.where, userId: user.id } }),
 *       prismaSchema: {
 *         q: { fields: ["customerName", "reference"] },
 *         filters: { status: { kind: "in", field: "status" } },
 *       },
 *     });
 *   }
 */

import { NextResponse } from "next/server";

interface PrismaFindManyArgs {
  where: Record<string, unknown>;
  orderBy?: Record<string, "asc" | "desc">;
  skip: number;
  take: number;
}

interface FetchTableOptions<S extends ZodSchema> {
  /** Zod schema for the query string. Must include `page`, `pageSize`, `sort`, `dir`, `q`. */
  schema: S;
  /** Prisma `findMany` adapter — call your delegate here. */
  findMany: (args: PrismaFindManyArgs) => Promise<unknown[]>;
  /** Prisma `count` adapter. */
  count: (args: Pick<PrismaFindManyArgs, "where">) => Promise<number>;
  /** buildPrismaWhere schema — keep this in sync with what the client sends. */
  prismaSchema: Parameters<typeof buildPrismaWhere>[0]["schema"];
  /** Optional extra `where` clauses ANDed in (e.g. tenant scope). */
  baseWhere?: Record<string, unknown>;
}

export async function fetchTable<S extends ZodSchema>(
  req: Request,
  options: FetchTableOptions<S>,
): Promise<NextResponse> {
  const url = new URL(req.url);
  const obj: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    obj[key] = value;
  });

  const parsed = options.schema.safeParse(obj);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query",
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      },
      { status: 422 },
    );
  }

  const data = parsed.data as z.infer<S> & {
    page: number;
    pageSize: number;
    sort?: string;
    dir: "asc" | "desc";
    q?: string;
  };

  // Pull comma-separated filter values out of the parsed object
  const filters: Record<string, string[]> = {};
  for (const key of Object.keys(options.prismaSchema.filters ?? {})) {
    const raw = (data as Record<string, unknown>)[key];
    if (typeof raw === "string" && raw.length > 0) {
      filters[key] = raw.split(",").filter(Boolean);
    }
  }

  const builtWhere = buildPrismaWhere({
    q: data.q,
    filters,
    schema: options.prismaSchema,
  });
  const where = options.baseWhere
    ? { AND: [options.baseWhere, builtWhere] }
    : builtWhere;
  const orderBy = buildPrismaOrderBy(data.sort, data.dir);

  const skip = (data.page - 1) * data.pageSize;
  const take = data.pageSize;

  const [rows, total] = await Promise.all([
    options.findMany({ where, orderBy, skip, take }),
    options.count({ where }),
  ]);

  return NextResponse.json({
    data: rows,
    total,
    page: data.page,
    pageSize: data.pageSize,
    totalPages: Math.max(1, Math.ceil(total / data.pageSize)),
  });
}
