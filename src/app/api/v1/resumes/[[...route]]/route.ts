import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { ApplicationService } from "@/lib/applications/application-service";

export const dynamic = "force-dynamic";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyJwt(token);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. POST /api/v1/resumes/upload
  if (subPath === "upload" || subPath === "") {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const title = formData.get("title") as string;

      if (!file) {
        return NextResponse.json({ success: false, error: "No resume file provided" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const resume = await ApplicationService.uploadResume(
        authUser.userId,
        buffer,
        file.name,
        file.type,
        title
      );

      return NextResponse.json({ success: true, resume }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to upload resume" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/resumes/${subPath} not found` }, { status: 404 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const resumes = await ApplicationService.getUserResumes(authUser.userId);
  return NextResponse.json({ success: true, count: resumes.length, resumes });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. PATCH /api/v1/resumes/default
  if (subPath === "default") {
    try {
      const body = await request.json();
      const resume = await ApplicationService.setDefaultResume(authUser.userId, body.resumeId);
      return NextResponse.json({ success: true, resume });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to set default resume" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route PATCH /api/v1/resumes/${subPath} not found` }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const resumeId = route ? route[0] : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await ApplicationService.deleteResume(authUser.userId, resumeId);
  return NextResponse.json({ success: true, message: "Resume deleted successfully" });
}
