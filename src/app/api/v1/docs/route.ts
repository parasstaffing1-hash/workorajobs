import { NextResponse } from "next/server";
import { getOpenApiSpec } from "@/lib/api/openapi-spec";

export const dynamic = "force-dynamic";

export async function GET() {
  const spec = getOpenApiSpec();
  return NextResponse.json(spec);
}
