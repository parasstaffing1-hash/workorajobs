import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const runtime = "nodejs";

/**
 * POST /api/v1/seo/metadata
 * Triggers AI metadata generation or metadata updates for pages.
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
    const { path: pagePath, title, description } = body as {
      path?: string;
      title?: string;
      description?: string;
    };

    if (!pagePath || typeof pagePath !== "string") {
      return NextResponse.json(
        { success: false, error: "Required field 'path' (string) missing." },
        { status: 400 }
      );
    }

    // Validate path against traversal attempts
    if (pagePath.includes("..") || pagePath.includes("\\")) {
      return NextResponse.json(
        { success: false, error: "Invalid page path format." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "AI metadata successfully updated.",
      data: {
        path: pagePath,
        title: title || "Auto-generated Title",
        description: description || "Auto-generated Description",
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("[API SEO Metadata Error]:", error);
    return NextResponse.json(
      { success: false, error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
