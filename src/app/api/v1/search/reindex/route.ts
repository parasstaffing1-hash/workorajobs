import { NextRequest, NextResponse } from "next/server";
import { OpenSearchSyncService } from "@/lib/opensearch/sync-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const secretKey = process.env.REINDEX_SECRET_KEY || "workora-admin-secret-2026";
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const result = await OpenSearchSyncService.reindexAllJobs();
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to trigger reindex." },
      { status: 500 }
    );
  }
}
