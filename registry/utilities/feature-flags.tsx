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

import * as React from "react";

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

/* ─────────────── Client-side hook + provider ─────────────── */

type FlagsSnapshot = Record<string, boolean>;
const FlagsContext = React.createContext<FlagsSnapshot>({});

/**
 * Wrap the app (or a sub-tree) with a flags snapshot. The provider value
 * is the resolved-server-side flags object — typically computed in a
 * server component and passed down.
 *
 *   // app/layout.tsx (server)
 *   const snapshot = await flags.snapshotFor(user);   // user implements this
 *   <FlagsProvider value={snapshot}>{children}</FlagsProvider>
 */
export function FlagsProvider({ value, children }: { value: FlagsSnapshot; children: React.ReactNode }) {
  return <FlagsContext.Provider value={value}>{children}</FlagsContext.Provider>;
}

/** Read a flag in a client component. Returns false if the flag isn't in the snapshot. */
export function useFlag(key: string): boolean {
  const snap = React.useContext(FlagsContext);
  return Boolean(snap[key]);
}
