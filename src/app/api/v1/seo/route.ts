import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const runtime = "nodejs";

/**
 * GET /api/v1/seo
 * Returns overall SEO Engine status and summary metrics.
 * Requires ADMIN role.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const adminId = await getAuthUserId(request, "ADMIN");
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin authorization required." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          status: "healthy",
          enginesActive: 12,
          modules: [
            "technical-seo",
            "sitemaps",
            "programmatic-seo",
            "internal-linking",
            "ai-metadata",
            "seo-content",
            "search-indexing",
            "crawl-optimization",
            "seo-analytics",
            "seo-automation",
            "seo-validation",
            "optimization-engine",
          ],
          timestamp: new Date().toISOString(),
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[API SEO Error]:", error);
    return NextResponse.json(
      { success: false, error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
