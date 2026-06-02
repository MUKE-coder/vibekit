/**
 * Convert a typed `useTableState`-shaped query object into a Prisma `where`
 * clause without scattering ad-hoc `where: { ... }` blocks across routes.
 *
 *   const where = buildPrismaWhere({
 *     q: state.q,
 *     filters: state.filters,
 *     schema: {
 *       q: { fields: ["name", "email"], mode: "insensitive" },     // search
 *       filters: {
 *         status:     { kind: "in",       field: "status" },
 *         categoryId: { kind: "in",       field: "categoryId" },
 *         createdAt:  { kind: "dateRange", field: "createdAt" },   // values: ["2026-01-01", "2026-02-01"]
 *         amount:     { kind: "numRange",  field: "amount" },      // values: ["100", "5000"]
 *         archived:   { kind: "bool",      field: "isArchived" },  // values: ["true"]
 *       },
 *     },
 *   });
 *
 *   const rows = await db.invoice.findMany({ where, orderBy, skip, take });
 *
 * Stays untyped on the Prisma side (returns `Record<string, unknown>`) so
 * the same helper works across every model. Cast at the call site if you
 * want stricter typing per entity.
 */

type SearchSpec = {
  /** Fields to OR-search across. */
  fields: string[];
  /** Prisma `mode: "insensitive"` for case-insensitive contains. Default: insensitive. */
  mode?: "default" | "insensitive";
};

type InFilter = { kind: "in"; field: string };
type EqFilter = { kind: "eq"; field: string };
type BoolFilter = { kind: "bool"; field: string };
type DateRangeFilter = { kind: "dateRange"; field: string };
type NumRangeFilter = { kind: "numRange"; field: string };

type FilterSpec = InFilter | EqFilter | BoolFilter | DateRangeFilter | NumRangeFilter;

interface BuildPrismaWhereInput {
  q?: string;
  filters?: Record<string, string[] | undefined>;
  schema: {
    q?: SearchSpec;
    filters?: Record<string, FilterSpec>;
  };
}

export function buildPrismaWhere(input: BuildPrismaWhereInput): Record<string, unknown> {
  const clauses: Record<string, unknown>[] = [];

  // Search across multiple fields with OR
  if (input.q && input.q.trim() && input.schema.q) {
    const { fields, mode = "insensitive" } = input.schema.q;
    clauses.push({
      OR: fields.map((f) => ({ [f]: { contains: input.q, mode } })),
    });
  }

  // Filters
  if (input.filters && input.schema.filters) {
    for (const [key, values] of Object.entries(input.filters)) {
      const spec = input.schema.filters[key];
      if (!spec || !values || values.length === 0) continue;

      switch (spec.kind) {
        case "in":
          clauses.push({ [spec.field]: { in: values } });
          break;
        case "eq":
          if (values[0] !== undefined) clauses.push({ [spec.field]: values[0] });
          break;
        case "bool":
          if (values[0] !== undefined) {
            clauses.push({ [spec.field]: values[0] === "true" });
          }
          break;
        case "dateRange": {
          const [from, to] = values;
          const range: Record<string, Date> = {};
          if (from) range.gte = new Date(from);
          if (to) range.lte = new Date(to);
          if (Object.keys(range).length > 0) clauses.push({ [spec.field]: range });
          break;
        }
        case "numRange": {
          const [min, max] = values;
          const range: Record<string, number> = {};
          if (min !== undefined && min !== "") range.gte = Number(min);
          if (max !== undefined && max !== "") range.lte = Number(max);
          if (Object.keys(range).length > 0) clauses.push({ [spec.field]: range });
          break;
        }
      }
    }
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
}

/**
 * Build a Prisma `orderBy` clause from a sort field + direction. Returns
 * `undefined` if no sort is set (Prisma uses the default order).
 *
 *   const orderBy = buildPrismaOrderBy(state.sort, state.dir);
 */
export function buildPrismaOrderBy(
  sort: string | null | undefined,
  direction: "asc" | "desc" = "desc",
): Record<string, "asc" | "desc"> | undefined {
  if (!sort) return undefined;
  return { [sort]: direction };
}
