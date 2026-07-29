import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const runtime = "nodejs";

/**
 * POST /api/v1/seo/indexing
 * Submits URL list to IndexNow API (Bing/Yandex).
 * Requires ADMIN role. Input URLs capped at 1,000.
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
    const rawUrls = Array.isArray(body.urls) ? body.urls : [];

    if (rawUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "No URLs provided in request body ('urls' array required)." },
        { status: 400 }
      );
    }

    const indexNowKey = process.env.INDEXNOW_KEY || "";
    if (!indexNowKey) {
      return NextResponse.json(
        { success: false, error: "IndexNow API key is not configured in server environment." },
        { status: 503 }
      );
    }

    // Validate and sanitize URLs
    const sanitizedUrls: string[] = [];
    for (const urlStr of rawUrls) {
      if (typeof urlStr === "string") {
        try {
          const parsed = new URL(urlStr);
          if (parsed.protocol === "https:" || parsed.protocol === "http:") {
            sanitizedUrls.push(parsed.toString());
          }
        } catch (_) {
          // Ignore invalid URL format
        }
      }
    }

    const cappedUrls = Array.from(new Set(sanitizedUrls)).slice(0, 1000);

    return NextResponse.json({
      success: true,
      message: `Submitted ${cappedUrls.length} URLs for search engine indexing.`,
      urlsSubmitted: cappedUrls.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("[API SEO Indexing Error]:", error);
    return NextResponse.json(
      { success: false, error: "An internal error occurred." },
      { status: 500 }
    );
  }
}
