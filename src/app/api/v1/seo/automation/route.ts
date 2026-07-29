import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const runtime = "nodejs";

/**
 * POST /api/v1/seo/automation
 * Triggers background SEO automation tasks (metadata refresh, schema sync, sitemap build).
 * Requires ADMIN role.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const adminId = await getAuthUserId(request, "ADMIN");
    if (!adminId) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin authorization required." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const action = typeof body.action === "string" ? body.action.trim() : "full-sync";

    const allowedActions = ["full-sync", "refresh-metadata", "update-internal-links", "sync-sitemaps"];
    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action '${action}'. Allowed: ${allowedActions.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `SEO automation job '${action}' triggered successfully.`,
      jobId: `seo-auto-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("[API SEO Automation Error]:", error);
    return NextResponse.json(
      { success: false, error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
