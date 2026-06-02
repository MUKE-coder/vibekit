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

const redis = Redis.fromEnv();

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

  // Have we seen this key before?
  const cached = await redis.get<CachedResponse>(cacheKey);
  if (cached) {
    return new Response(cached.body, {
      status: cached.status,
      headers: { ...cached.headers, "Idempotent-Replay": "true" },
    });
  }

  // First time — run the handler and capture the response
  const res = await handler();
  const body = await res.clone().text();
  const headersOut: Record<string, string> = {};
  res.headers.forEach((value, k) => {
    headersOut[k] = value;
  });

  // Only cache successful, deterministic responses (2xx)
  if (res.status >= 200 && res.status < 300) {
    await redis.set(cacheKey, { status: res.status, headers: headersOut, body }, { ex: ttlSeconds });
  }

  return res;
}
