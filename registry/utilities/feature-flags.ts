/**
 * Lightweight feature flags. Two layers:
 *
 * 1. **Static env flags** — `FEATURE_<NAME>=true` in `.env.local`. Cheapest,
 *    no DB round-trip. Use these for project-wide toggles.
 *
 * 2. **Per-user / per-org runtime flags** — pass an `evaluate` callback to
 *    `defineFlags` that reads from your DB or Upstash. Returns a boolean
 *    given a (flag, context) pair.
 *
 * USAGE
 *
 *   // lib/flags.ts
 *   import { defineFlags } from "@/lib/feature-flags";
 *
 *   export const flags = defineFlags({
 *     keys: ["newPricing", "bulkExport", "experimentalSearch"] as const,
 *     evaluate: async (key, ctx) => {
 *       // optional: read from DB / Redis / LaunchDarkly / GrowthBook
 *       return false;
 *     },
 *   });
 *
 *   // Server route or server component:
 *   if (await flags.isEnabled("newPricing", { userId, orgId })) { ... }
 *
 *   // Client component:
 *   const enabled = useFlag("newPricing"); // reads from <FlagsProvider>
 */

export type FlagContext = Record<string, string | number | boolean | null | undefined>;

interface DefineFlagsInput<Keys extends readonly string[]> {
  keys: Keys;
  /** Optional dynamic evaluator. If omitted, only env flags are consulted. */
  evaluate?: (key: Keys[number], ctx: FlagContext) => boolean | Promise<boolean>;
  /** Env prefix. Default: "FEATURE_". `FEATURE_NEW_PRICING=true` → newPricing on. */
  envPrefix?: string;
}

function envKey(prefix: string, flag: string): string {
  // newPricing → FEATURE_NEW_PRICING
  const snake = flag.replace(/[A-Z]/g, (m) => `_${m}`).toUpperCase();
  return `${prefix}${snake.startsWith("_") ? snake.slice(1) : snake}`;
}

export function defineFlags<Keys extends readonly string[]>(input: DefineFlagsInput<Keys>) {
  const { keys, evaluate, envPrefix = "FEATURE_" } = input;
  const keySet = new Set<string>(keys);

  function fromEnv(flag: Keys[number]): boolean | null {
    if (typeof process === "undefined") return null;
    const value = process.env[envKey(envPrefix, flag)];
    if (value === undefined) return null;
    return value === "true" || value === "1";
  }

  async function isEnabled(flag: Keys[number], ctx: FlagContext = {}): Promise<boolean> {
    if (!keySet.has(flag)) {
      throw new Error(`Unknown feature flag: ${String(flag)}`);
    }
    const envValue = fromEnv(flag);
    if (envValue !== null) return envValue;
    if (evaluate) return Promise.resolve(evaluate(flag, ctx));
    return false;
  }

  /** Sync env-only check — useful in middleware / edge runtime where async is awkward. */
  function isEnabledSync(flag: Keys[number]): boolean {
    if (!keySet.has(flag)) {
      throw new Error(`Unknown feature flag: ${String(flag)}`);
    }
    return fromEnv(flag) === true;
  }

  return { keys, isEnabled, isEnabledSync };
}

export type FlagsSnapshot = Record<string, boolean>;

/**
 * For the client-side <FlagsProvider> + useFlag(), see
 * `flags-provider.tsx` — they live in a separate file with "use client"
 * so React Server Components can safely import `defineFlags` /
 * `isEnabled` from this file without dragging React.createContext into
 * the RSC tree.
 */
