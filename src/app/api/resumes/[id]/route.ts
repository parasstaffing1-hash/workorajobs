import { NextResponse } from "next/server";
import { ResumeBuilderService } from "@/lib/resume-builder/service";

export const runtime = "nodejs";
const service = new ResumeBuilderService();

// GET /api/resumes/[id] - Get resume details & content
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";

    const resume = await service.getResumeWithContent(id, userId);
    if (!resume) {
      return NextResponse.json({ success: false, error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

// PUT /api/resumes/[id] - Update or autosave draft
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";
    
    const body = await request.json();
    const { templateId, data } = body;

    const draft = await service.autosave(id, userId, templateId || null, data || {});

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to autosave resume" },
      { status: 400 }
    );
  }
}

// DELETE /api/resumes/[id] - Soft delete a resume
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get("x-user-id") || "user_placeholder";

    const deleted = await service.deleteResume(id, userId);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Resume not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Resume soft-deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete resume" },
      { status: 500 }
    );
  }
}
