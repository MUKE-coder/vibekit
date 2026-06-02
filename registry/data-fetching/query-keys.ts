/**
 * Factory pattern for consistent React Query keys across entities.
 *
 * Every entity follows the same shape:
 *   keys.invoices.all                  -> ["invoices"]
 *   keys.invoices.lists()              -> ["invoices", "list"]
 *   keys.invoices.list(filters)        -> ["invoices", "list", filters]
 *   keys.invoices.details()            -> ["invoices", "detail"]
 *   keys.invoices.detail(id)           -> ["invoices", "detail", id]
 *
 * This shape lets you invalidate by scope with `queryClient.invalidateQueries`:
 *   await qc.invalidateQueries({ queryKey: keys.invoices.lists() })  // all list views
 *   await qc.invalidateQueries({ queryKey: keys.invoices.detail(id) }) // just this one
 *   await qc.invalidateQueries({ queryKey: keys.invoices.all })       // everything for entity
 *
 * Define your app's entities once:
 *
 *   import { entityKeys } from "@/lib/query-keys";
 *
 *   export const keys = {
 *     invoices: entityKeys("invoices"),
 *     contacts: entityKeys("contacts"),
 *     orders:   entityKeys("orders"),
 *   };
 */

export type ListFilters = Record<string, unknown>;

export interface EntityKeys<Entity extends string> {
  readonly all: readonly [Entity];
  lists(): readonly [Entity, "list"];
  list(filters?: ListFilters): readonly [Entity, "list", ListFilters | undefined];
  details(): readonly [Entity, "detail"];
  detail(id: string | number): readonly [Entity, "detail", string | number];
}

/**
 * Returns a typed factory for one entity. Pass the entity name as a const
 * string literal for maximal type narrowing.
 */
export function entityKeys<Entity extends string>(entity: Entity): EntityKeys<Entity> {
  const all = [entity] as const;
  return {
    all,
    lists: () => [entity, "list"] as const,
    list: (filters?: ListFilters) => [entity, "list", filters] as const,
    details: () => [entity, "detail"] as const,
    detail: (id: string | number) => [entity, "detail", id] as const,
  };
}

/**
 * Helper to build a `keys` object from a list of entity names — saves
 * the repetitive entityKeys(...) calls.
 *
 *   export const keys = createQueryKeys(["invoices", "contacts", "orders"] as const);
 *   keys.invoices.detail("inv_123");
 */
export function createQueryKeys<const Entities extends readonly string[]>(
  entities: Entities,
): { [K in Entities[number]]: EntityKeys<K> } {
  const map = {} as { [K in Entities[number]]: EntityKeys<K> };
  for (const entity of entities) {
    (map as Record<string, unknown>)[entity] = entityKeys(entity);
  }
  return map;
}
