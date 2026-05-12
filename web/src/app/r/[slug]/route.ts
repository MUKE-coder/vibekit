import { NextResponse } from "next/server";
import { getRegistryComponent } from "@/lib/registry-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const component = getRegistryComponent(slug);
  if (!component) {
    return NextResponse.json(
      { error: "Component not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { ...component, $schema: "https://ui.shadcn.com/schema/registry.json" },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    }
  );
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    }
  );
}
