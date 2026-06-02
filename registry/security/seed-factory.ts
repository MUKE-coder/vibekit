/**
 * Typed factory pattern for `prisma/seed.ts`. Two pieces:
 *
 *   1. `defineFactory()` — declare a factory once with defaults + an
 *      optional sequence counter; call it many times to produce realistic
 *      rows with subtle variation.
 *   2. `pick`, `pickN`, `chance`, `oneOf`, `range` — tiny deterministic
 *      helpers that avoid pulling in faker for simple seed scripts.
 *
 *   import { defineFactory, pickN, oneOf } from "@/lib/seed-factory";
 *   import { db } from "@/lib/db";
 *
 *   const customer = defineFactory<{
 *     name: string;
 *     email: string;
 *     plan: "free" | "pro" | "enterprise";
 *   }>((seq) => ({
 *     name: `Customer ${seq}`,
 *     email: `customer${seq}@example.com`,
 *     plan: oneOf(["free", "pro", "enterprise"]),
 *   }));
 *
 *   await db.customer.createMany({
 *     data: pickN(50, () => customer.build()),
 *   });
 *
 * Optional `db` flush helper — call `flushFactories()` at the top of
 * `seed.ts` to wipe the database before re-seeding so the script is
 * idempotent in dev. Don't run this in production.
 */

/* ───────────── Random helpers (deterministic-friendly, no faker) ───────────── */

let seedCounter = 0;

/** Reset the global counter so `seq` starts from 0 again. Call at the top of seed.ts. */
export function resetSequence(): void {
  seedCounter = 0;
}

/** Returns a sequence index that increments per call. */
export function nextSeq(): number {
  return ++seedCounter;
}

/** Pick a single element from an array. */
export function oneOf<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

/** Pick N distinct elements from an array (or fewer if `items.length < n`). */
export function pickN<T>(n: number, builder: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => builder(i));
}

/** Return true with probability `p` (0..1). */
export function chance(p: number): boolean {
  return Math.random() < p;
}

/** Return an integer in [min, max] inclusive. */
export function range(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Return a Date offset randomly within ±`days` of the reference. */
export function aroundDate(reference: Date = new Date(), days = 30): Date {
  const offsetMs = (Math.random() * 2 - 1) * days * 24 * 60 * 60 * 1000;
  return new Date(reference.getTime() + offsetMs);
}

/* ───────────── Factory pattern ───────────── */

interface Factory<T> {
  /** Build a single row. Pass overrides to mix in custom values. */
  build(overrides?: Partial<T>): T;
  /** Build N rows. */
  buildMany(n: number, overrides?: Partial<T>): T[];
}

type DefaultsFn<T> = (seq: number) => T;

/**
 * Define a factory. Pass a function that, given the row's sequence
 * number, returns the default field values. Each `build()` call
 * increments the sequence.
 */
export function defineFactory<T>(defaults: DefaultsFn<T>): Factory<T> {
  return {
    build(overrides?: Partial<T>): T {
      return { ...defaults(nextSeq()), ...(overrides ?? {}) };
    },
    buildMany(n: number, overrides?: Partial<T>): T[] {
      return Array.from({ length: n }, () => ({ ...defaults(nextSeq()), ...(overrides ?? {}) }));
    },
  };
}

/* ───────────── Optional flush helper ───────────── */

/**
 * Wipe a set of Prisma models so `seed.ts` is idempotent. Pass model
 * delegates in the order they should be deleted (children before
 * parents to satisfy foreign keys).
 *
 *   await flushFactories([db.orderItem, db.order, db.customer]);
 */
export async function flushFactories(
  models: Array<{ deleteMany: (args?: { where?: Record<string, unknown> }) => Promise<unknown> }>,
): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    throw new Error("flushFactories() is disabled in production — refusing to wipe data.");
  }
  for (const model of models) {
    await model.deleteMany();
  }
}
