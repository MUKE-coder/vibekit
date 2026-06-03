import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { db } from "@/lib/db";

/**
 * Readiness endpoint. Drop this at `app/api/readyz/route.ts`:
 *
 *   import { readyzHandler } from "@/lib/readyz";
 *   export const GET = readyzHandler;
 *
 * Verifies the app can reach its backing services (DB + Redis). Returns
 * 200 with the per-check status when all pass, 503 when any fail. Use
 * this for orchestrator readiness probes (Kubernetes, Vercel cron
 * guards) — separate from `healthz` (liveness only).
 *
 * If your project doesn't use Redis, delete the redis block. If it adds
 * another dependency (Resend, S3, etc.), append another check below.
 */

let redisClient: Redis | null = null;
function getRedis(): Redis {
  return (redisClient ??= Redis.fromEnv());
}

type CheckStatus = "ok" | "degraded" | "down";

interface CheckResult {
  status: CheckStatus;
  latencyMs?: number;
  error?: string;
}

async function checkDb(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await db.$queryRaw`SELECT 1`;
    return { status: "ok", latencyMs: Date.now() - start };
  } catch (err) {
    return { status: "down", latencyMs: Date.now() - start, error: (err as Error).message };
  }
}

async function checkRedis(): Promise<CheckResult> {
  const start = Date.now();
  try {
    await getRedis().ping();
    return { status: "ok", latencyMs: Date.now() - start };
  } catch (err) {
    return { status: "down", latencyMs: Date.now() - start, error: (err as Error).message };
  }
}

export async function readyzHandler(): Promise<NextResponse> {
  const [dbResult, redisResult] = await Promise.all([checkDb(), checkRedis()]);
  const allOk = dbResult.status === "ok" && redisResult.status === "ok";
  return NextResponse.json(
    {
      status: allOk ? "ok" : "degraded",
      checks: { db: dbResult, redis: redisResult },
      ts: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  );
}

export const GET = readyzHandler;
