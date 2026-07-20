import { Redis } from "@upstash/redis";

/**
 * Idempotency-Key middleware for write routes. Pairs with retry-prone
 * clients (mobile, flaky webhooks, double-clicks). The pattern:
 *
 *   export async function POST(req: Request) {
 *     const result = await withIdempotency(req, async () => {
 *       // ... actually create the resource
 *       const order = await db.order.create({ data: { ... } });
 *       return NextResponse.json(order);
 *     });
 *     return result;
 *   }
 *
 * Client sends an `Idempotency-Key: <uuid>` header on the original
 * request. The first call runs the handler and caches the serialised
 * response by `(method, path, key)` for 24h. Subsequent calls with the
 * same key return the cached response without re-executing.
 *
 * Uses the same Upstash Redis the framework already locks. Skips
 * gracefully if no `Idempotency-Key` header is present.
 */

let redisClient: Redis | null = null;
function getRedis(): Redis {
  return (redisClient ??= Redis.fromEnv());
}

interface IdempotencyOptions {
  /** TTL in seconds. Default: 86400 (24h). */
  ttlSeconds?: number;
  /** Redis key prefix. Default: "idempotency". */
  prefix?: string;
  /** Header name. Default: "Idempotency-Key". */
  header?: string;
}

interface CachedResponse {
  status: number;
  headers: Record<string, string>;
  body: string;
}

/** Marker written by the winning request while its handler is still running. */
const IN_FLIGHT = "__in_flight__";

type Slot = CachedResponse | typeof IN_FLIGHT;

export async function withIdempotency(
  req: Request,
  handler: () => Promise<Response>,
  options: IdempotencyOptions = {},
): Promise<Response> {
  const { ttlSeconds = 24 * 60 * 60, prefix = "idempotency", header = "Idempotency-Key" } = options;

  const key = req.headers.get(header);
  if (!key) return handler(); // No key, no caching

  const url = new URL(req.url);
  const cacheKey = `${prefix}:${req.method}:${url.pathname}:${key}`;

  // Claim the key ATOMICALLY before doing any work. A read-then-write check
  // leaves a window where two concurrent retries both miss the cache and both
  // run the handler — creating the duplicate order this helper exists to stop.
  const claimed = await getRedis().set(cacheKey, IN_FLIGHT, { nx: true, ex: ttlSeconds });

  if (!claimed) {
    // Someone else owns this key: either finished (replay it) or still running (409).
    const existing = await getRedis().get<Slot>(cacheKey);
    if (existing && existing !== IN_FLIGHT) {
      return new Response(existing.body, {
        status: existing.status,
        headers: { ...existing.headers, "Idempotent-Replay": "true" },
      });
    }
    return new Response(
      JSON.stringify({ error: "A request with this Idempotency-Key is already in progress" }),
      { status: 409, headers: { "Content-Type": "application/json", "Retry-After": "1" } },
    );
  }

  // We own the key — run the handler and capture the response.
  let res: Response;
  try {
    res = await handler();
  } catch (err) {
    // Release the claim so a retry can legitimately proceed.
    await getRedis().del(cacheKey);
    throw err;
  }
  const body = await res.clone().text();
  const headersOut: Record<string, string> = {};
  res.headers.forEach((value, k) => {
    headersOut[k] = value;
  });

  // Only cache successful, deterministic responses (2xx). On a non-2xx, drop the
  // claim so the caller can retry the same key rather than being stuck on 409.
  if (res.status >= 200 && res.status < 300) {
    await getRedis().set(cacheKey, { status: res.status, headers: headersOut, body }, { ex: ttlSeconds });
  } else {
    await getRedis().del(cacheKey);
  }

  return res;
}
