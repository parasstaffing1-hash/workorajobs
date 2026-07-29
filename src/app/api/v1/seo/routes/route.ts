import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const runtime = "nodejs";

/**
 * GET /api/v1/seo/routes
 * List all registered SEO page routes for search indexing.
 * Requires ADMIN authentication.
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));

    return NextResponse.json(
      {
        success: true,
        data: {
          routes: [
            { path: "/", priority: 1.0, changefreq: "daily" },
            { path: "/jobs", priority: 0.9, changefreq: "hourly" },
            { path: "/companies", priority: 0.8, changefreq: "daily" },
            { path: "/blog", priority: 0.7, changefreq: "weekly" },
          ],
          pagination: {
            page,
            limit,
            total: 1499,
            totalPages: Math.ceil(1499 / limit),
          },
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[API SEO Routes Error]:", error);
    return NextResponse.json(
      { success: false, error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
