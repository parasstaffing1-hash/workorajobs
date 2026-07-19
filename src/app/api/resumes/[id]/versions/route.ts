import { NextResponse } from "next/server";
import { ResumeBuilderService } from "@/lib/resume-builder/service";

export const runtime = "nodejs";
const service = new ResumeBuilderService();

// GET /api/resumes/[id]/versions - List version history logs
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";

    const versions = await service.getVersionHistory(id, userId);
    return NextResponse.json({
      success: true,
      total: versions.length,
      versions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list versions" },
      { status: 500 }
    );
  }
}

// POST /api/resumes/[id]/versions - Commit draft to formal version snapshot (generates ATS score)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";
    
    const body = await request.json();
    const { templateId, data } = body;

    const version = await service.saveVersion(id, userId, templateId || null, data || {});

    return NextResponse.json({
      success: true,
      version,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to commit version snapshot" },
      { status: 400 }
    );
  }
}
