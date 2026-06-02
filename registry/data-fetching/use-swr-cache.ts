/**
 * Stale-while-revalidate cache layer on top of Upstash Redis. Reads
 * return immediately even when the cached value is stale, and a
 * background refresh fills it in. Combines the "fast first-byte" of
 * `cacheGet` with self-healing freshness — perfect for dashboard
 * aggregates, expensive Prisma queries, and slow third-party APIs.
 *
 *   import { withSwrCache } from "@/lib/use-swr-cache";
 *
 *   const stats = await withSwrCache(
 *     `dashboard:revenue:${orgId}`,
 *     () => computeRevenue(orgId),
 *     { fresh: 60, stale: 600 },   // 1 min fresh, 10 min stale
 *   );
 *
 * Cache entry shape `{ value, storedAt }`. While `now - storedAt < fresh`
 * we serve it as-is. Between `fresh` and `stale` we serve the old value
 * AND fire a background refresh. After `stale` we wait on a fresh fetch.
 *
 * In-flight de-dup: parallel callers with the same key share one
 * outstanding fetch via an in-process Map, so a cold cache doesn't
 * stampede the origin.
 */

import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

interface Entry<T> {
  value: T;
  storedAt: number;
}

interface SwrOptions {
  /** Seconds the value is considered fresh — served without refresh. */
  fresh: number;
  /** Seconds before the entry is fully expired — drops out of Redis. */
  stale: number;
}

const inflight = new Map<string, Promise<unknown>>();

export async function withSwrCache<T>(
  key: string,
  loader: () => Promise<T>,
  { fresh, stale }: SwrOptions,
): Promise<T> {
  const cached = await redis.get<Entry<T>>(key);
  const now = Date.now();

  if (cached && now - cached.storedAt < fresh * 1000) {
    return cached.value;
  }

  if (cached) {
    void revalidate(key, loader, stale);
    return cached.value;
  }

  return fetchAndStore(key, loader, stale);
}

function revalidate<T>(key: string, loader: () => Promise<T>, stale: number): Promise<T> {
  const existing = inflight.get(key) as Promise<T> | undefined;
  if (existing) return existing;

  const promise = fetchAndStore(key, loader, stale)
    .catch((err) => {
      console.error(`[swr-cache] revalidate failed for ${key}`, err);
      throw err;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, promise);
  return promise;
}

async function fetchAndStore<T>(key: string, loader: () => Promise<T>, stale: number): Promise<T> {
  const value = await loader();
  const entry: Entry<T> = { value, storedAt: Date.now() };
  await redis.set(key, entry, { ex: stale });
  return value;
}

/** Imperatively bust a key (e.g. after a mutation). */
export async function invalidateSwr(key: string | string[]): Promise<void> {
  const keys = Array.isArray(key) ? key : [key];
  if (keys.length === 0) return;
  await redis.del(...keys);
}
