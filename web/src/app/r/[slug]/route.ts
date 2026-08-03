import { NextResponse } from "next/server";
import { getAllRegistrySlugs, getRegistryComponent } from "@/lib/registry-data";

/**
 * `/r/<slug>.json` is the documented shadcn install endpoint - it is referenced
 * from the docs and from `registry/forms/registry.json` as a real
 * registryDependency. It used to render per-request, so every `shadcn add` paid
 * a lambda cold start for data that is fully static at build time. Prerendering
 * serves it from the CDN instead.
 */
export const dynamic = "force-static";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
} as const;

export function generateStaticParams() {
  return getAllRegistrySlugs().map((slug) => ({ slug }));
}

// Only GET is exported on purpose - see the note in ../route.ts. Adding OPTIONS
// would make this render per-request again, which is what we're fixing.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const component = getRegistryComponent(slug);
  if (!component) {
    return NextResponse.json(
      { error: "Component not found" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    { ...component, $schema: "https://ui.shadcn.com/schema/registry.json" },
    { headers: CORS_HEADERS }
  );
}
