import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry-data";

/** Static for the same reason as `/r/[slug]` — the index never varies per request. */
export const dynamic = "force-static";

// The index is fetched by the same cross-origin tooling as the item routes, so
// it needs the same CORS headers; previously only /r/[slug] set them.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
} as const;

// NOTE: exporting only GET is deliberate. Next prerenders a route handler only
// when GET is its sole method — adding OPTIONS would silently push this back to
// per-request rendering. A cross-origin `GET` with no custom headers is a
// "simple request" and triggers no preflight, so OPTIONS is not needed here.
export async function GET() {
  return NextResponse.json(getRegistryIndex(), { headers: CORS_HEADERS });
}
