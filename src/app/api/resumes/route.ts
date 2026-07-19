import { NextResponse } from "next/server";
import { ResumeBuilderService } from "@/lib/resume-builder/service";

export const runtime = "nodejs";
const service = new ResumeBuilderService();

// GET /api/resumes - List all active resumes for the user
export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id") || "user_placeholder";
    const list = await service.listResumes(userId);
    
    return NextResponse.json({
      success: true,
      total: list.length,
      resumes: list,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to list resumes" },
      { status: 500 }
    );
  }
}

// POST /api/resumes - Create a new resume
export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id") || "user_placeholder";
    const body = await request.json();

    const { title, templateId, data } = body;
    if (!title) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const result = await service.createResume(userId, title, templateId || null, data || {});

    return NextResponse.json({
      success: true,
      resume: result.resume,
      version: result.version,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create resume" },
      { status: 400 }
    );
  }
}
