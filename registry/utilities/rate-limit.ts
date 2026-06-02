import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Per-route rate limiting backed by Upstash. Builds a `Ratelimit` from
 * UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — the env vars the
 * framework already locks in master_prompt.md → REDIS CACHING.
 *
 *   import { rateLimit } from "@/lib/rate-limit";
 *
 *   // In an API route or server action:
 *   const { success, remaining, reset } = await rateLimit.limit(
 *     `chat:${session.user.id}`,
 *     { tokens: 20, window: "1 h" },
 *   );
 *   if (!success) {
 *     return NextResponse.json(
 *       { error: "Rate limit exceeded" },
 *       { status: 429, headers: { "Retry-After": String(reset) } },
 *     );
 *   }
 *
 * Limiters are cached per (tokens, window) combination so you can use this
 * helper from many routes without instantiating Redis clients all over.
 */

const redis = Redis.fromEnv();
const cache = new Map<string, Ratelimit>();

export type RateWindow =
  | `${number} ms`
  | `${number} s`
  | `${number} m`
  | `${number} h`
  | `${number} d`;

interface RateLimitOptions {
  tokens: number;
  window: RateWindow;
  /** Optional analytics flag — Upstash dashboard shows the events. Default: true. */
  analytics?: boolean;
  /** Optional prefix to namespace this limiter in Redis. Default: 'ratelimit'. */
  prefix?: string;
}

function getLimiter({ tokens, window, analytics = true, prefix = "ratelimit" }: RateLimitOptions) {
  const key = `${prefix}:${tokens}:${window}`;
  let limiter = cache.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(tokens, window),
      analytics,
      prefix,
    });
    cache.set(key, limiter);
  }
  return limiter;
}

export const rateLimit = {
  /**
   * Check + consume a token. Returns `{ success, limit, remaining, reset }`.
   * `identifier` is anything that uniquely names the actor (userId, IP, etc.).
   */
  async limit(identifier: string, options: RateLimitOptions) {
    return getLimiter(options).limit(identifier);
  },
};
