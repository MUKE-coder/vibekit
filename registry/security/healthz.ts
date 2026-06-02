import { NextResponse } from "next/server";

/**
 * Liveness endpoint. Drop this at `app/api/healthz/route.ts`:
 *
 *   import { healthzHandler } from "@/lib/healthz";
 *   export const GET = healthzHandler;
 *
 * Returns 200 immediately. Use this for load balancer / Vercel liveness
 * checks — it just confirms the Node process is up. For dependency
 * checks (DB + Redis reachable) use `readyz` from the companion file.
 */

export async function healthzHandler(): Promise<NextResponse> {
  return NextResponse.json({ status: "ok", ts: new Date().toISOString() }, { status: 200 });
}

export const GET = healthzHandler;
