import { NextRequest } from "next/server";
import { GET as handler } from "@/app/api/v1/auth/oauth/[provider]/route";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  return handler(request, context);
}
