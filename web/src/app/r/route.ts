import { NextResponse } from "next/server";
import { getRegistryIndex } from "@/lib/registry-data";

export async function GET() {
  return NextResponse.json(getRegistryIndex());
}
