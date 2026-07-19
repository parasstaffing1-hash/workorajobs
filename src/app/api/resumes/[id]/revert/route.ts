import { NextResponse } from "next/server";
import { ResumeBuilderService } from "@/lib/resume-builder/service";

export const runtime = "nodejs";
const service = new ResumeBuilderService();

// POST /api/resumes/[id]/revert - Revert resume contents to a previous version number
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";
    
    const body = await request.json();
    const { versionNumber } = body;

    if (typeof versionNumber !== "number") {
      return NextResponse.json({ success: false, error: "Valid versionNumber is required" }, { status: 400 });
    }

    const version = await service.revertVersion(id, userId, versionNumber);

    return NextResponse.json({
      success: true,
      version,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to revert to version" },
      { status: 400 }
    );
  }
}
