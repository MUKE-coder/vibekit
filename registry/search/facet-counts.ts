/**
 * Server-side faceted-filter counts. For each filter field, returns the
 * number of records that *would* match if that filter value were
 * selected — given everything else the user has applied. Powers the
 * little numeric badges next to `FilterBar.Multi` options.
 *
 *   const counts = await computeFacetCounts({
 *     model: db.invoice,
 *     baseWhere: { orgId },
 *     query,             // parsed useFilters state
 *     facets: {
 *       status:   { kind: "multi" },
 *       currency: { kind: "multi" },
 *     },
 *   });
 *   // counts.status === { paid: 84, due: 12, overdue: 3 }
 *
 * The trick — for each facet, the where clause includes every filter
 * EXCEPT that facet's own value. That way the counts reflect "what's
 * left to choose", not "what's already chosen". Single round trip via
 * Promise.all.
 */

type Where = Record<string, unknown>;

interface MultiFacet {
  kind: "multi";
  /** Override the column name if it doesn't match the facet key. */
  column?: string;
}
interface BoolFacet {
  kind: "bool";
  column?: string;
}

export type Facet = MultiFacet | BoolFacet;

export interface FacetCountsArgs<Q> {
  /** Prisma delegate, e.g. `db.invoice`. */
  model: { groupBy: (a: object) => Promise<unknown[]>; count: (a: object) => Promise<number> };
  /** Hard scope filters (orgId, archived: false, etc.) — never excluded. */
  baseWhere?: Where;
  /** The full user-supplied filter state. */
  query: Q;
  facets: Record<string, Facet>;
}

export type FacetCounts = Record<string, Record<string, number>>;

export async function computeFacetCounts<Q extends Record<string, unknown>>(
  args: FacetCountsArgs<Q>,
): Promise<FacetCounts> {
  const baseWhere = args.baseWhere ?? {};
  const result: FacetCounts = {};

  await Promise.all(
    Object.entries(args.facets).map(async ([key, facet]) => {
      const otherWhere = buildWhereExcluding(args.query, args.facets, key, baseWhere);

      if (facet.kind === "multi") {
        const column = facet.column ?? key;
        const groups = (await args.model.groupBy({
          by: [column],
          where: otherWhere,
          _count: { _all: true },
        })) as Array<Record<string, unknown> & { _count: { _all: number } }>;

        const map: Record<string, number> = {};
        for (const row of groups) {
          const value = row[column];
          if (value === null || value === undefined) continue;
          map[String(value)] = row._count._all;
        }
        result[key] = map;
      }

      if (facet.kind === "bool") {
        const column = facet.column ?? key;
        const [t, f] = await Promise.all([
          args.model.count({ where: { ...otherWhere, [column]: true } }),
          args.model.count({ where: { ...otherWhere, [column]: false } }),
        ]);
        result[key] = { true: t, false: f };
      }
    }),
  );

  return result;
}

function buildWhereExcluding<Q extends Record<string, unknown>>(
  query: Q,
  facets: Record<string, Facet>,
  exclude: string,
  baseWhere: Where,
): Where {
  const where: Where = { ...baseWhere };
  for (const [key, facet] of Object.entries(facets)) {
    if (key === exclude) continue;
    const value = query[key];
    if (value === undefined || value === null) continue;

    const column = (facet as { column?: string }).column ?? key;
    if (facet.kind === "multi") {
      const arr = value as string[];
      if (arr.length > 0) where[column] = { in: arr };
    } else if (facet.kind === "bool") {
      if (value === true || value === false) where[column] = value;
    }
  }
  return where;
}

/**
 * Map raw counts to the shape `FilterBar.Multi`'s `counts` prop expects
 * — keyed by full query string per option. Pair with `quick-filters`
 * for segment badges.
 */
export function toSegmentCounts(
  field: string,
  counts: Record<string, number>,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [value, count] of Object.entries(counts)) {
    out[`?${field}=${value}`] = count;
  }
  return out;
}
