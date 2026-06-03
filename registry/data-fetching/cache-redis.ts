import { Redis } from "@upstash/redis";

/**
 * Typed Redis cache wrappers — `cacheGet` / `cacheSet` for raw access,
 * `withCache(key, ttl, fn)` for the common "cache-or-fetch" pattern, and
 * `invalidateCache(...keysOrTags)` for tag-based wildcards.
 *
 * Pair with the framework's API route pattern: read through `withCache`
 * on GETs, fire `invalidateCache(...)` on mutations.
 *
 *   // GET /api/invoices
 *   const data = await withCache(`invoices:list:${userId}:${page}`, 60, () =>
 *     db.invoice.findMany({ where: { userId }, skip, take })
 *   );
 *
 *   // POST /api/invoices/:id
 *   await invalidateCache(`invoices:detail:${id}`, "tag:invoices:lists");
 *
 * Uses the standard Upstash env (`UPSTASH_REDIS_REST_URL` +
 * `UPSTASH_REDIS_REST_TOKEN`). Lazy-initialised so the file is safe to
 * import from server components.
 */

let _redis: Redis | null = null;
function getClient(): Redis {
  if (_redis) return _redis;
  _redis = Redis.fromEnv();
  return _redis;
}

const DEFAULT_TTL_SECONDS = 60;

/** Read a JSON-serialised value from cache. Returns null on miss. */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const value = await getClient().get<T>(key);
    return value ?? null;
  } catch {
    return null; // never let cache errors break the request
  }
}

/** Write a value to cache with TTL (seconds). */
export async function cacheSet<T>(key: string, value: T, ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<void> {
  try {
    await getClient().set(key, value, { ex: ttlSeconds });
  } catch {
    /* best-effort */
  }
}

/**
 * Cache-or-fetch: try the cache; on miss, run `fetcher`, cache the result
 * with `ttl`, and return it. Cache errors never break the request — the
 * fetcher always runs as a fallback.
 *
 *   const rows = await withCache("invoices:list", 60, () => db.invoice.findMany());
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  // Don't cache null/undefined to avoid "negative cache" surprises
  if (fresh !== null && fresh !== undefined) {
    void cacheSet(key, fresh, ttlSeconds);
  }
  return fresh;
}

/**
 * Invalidate one or more cache keys. Patterns ending in `:*` are treated
 * as wildcards — every matching key is purged via SCAN. Use tags like
 * `tag:invoices:lists` and store entry keys keyed by tag for cheap
 * mass-invalidation.
 *
 *   await invalidateCache(
 *     `invoices:detail:${id}`,
 *     "invoices:list:*",            // wildcard
 *     "tag:invoices:lists",
 *   );
 */
export async function invalidateCache(...keysOrPatterns: string[]): Promise<void> {
  const client = getClient();
  try {
    for (const pattern of keysOrPatterns) {
      if (pattern.includes("*")) {
        let cursor: string | number = 0;
        do {
          const [next, found] = (await client.scan(cursor, { match: pattern, count: 256 })) as [
            string | number,
            string[],
          ];
          if (found.length > 0) {
            await client.del(...found);
          }
          cursor = next;
        } while (String(cursor) !== "0");
      } else {
        await client.del(pattern);
      }
    }
  } catch {
    /* best-effort */
  }
}

/* ─────────── Tag helpers — cheap mass-invalidation ─────────── */

/**
 * Add a cache `key` to a tag set so it can be invalidated en masse later.
 *
 *   await tagKey("tag:invoices:lists", listCacheKey);
 *   // later, when an invoice changes:
 *   await invalidateTag("tag:invoices:lists");
 */
export async function tagKey(tag: string, ...keys: string[]): Promise<void> {
  if (keys.length === 0) return;
  try {
    await getClient().sadd(tag, keys[0], ...keys.slice(1));
  } catch {
    /* ignore */
  }
}

/** Delete every key registered under a tag, then delete the tag itself. */
export async function invalidateTag(tag: string): Promise<void> {
  try {
    const keys = (await getClient().smembers(tag)) as string[];
    if (keys.length > 0) await getClient().del(...keys);
    await getClient().del(tag);
  } catch {
    /* ignore */
  }
}
