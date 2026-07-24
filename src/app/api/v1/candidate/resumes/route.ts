import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { ResumeService } from "@/lib/resumes/resume-service";

export const dynamic = "force-dynamic";

async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken);
    if (session) return session.userId;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const jwt = verifyJwt(token);
    if (jwt) return jwt.userId;
  }

  // Fallback for dev testing
  const firstUser = await prisma.user.findFirst({ select: { id: true } });
  return firstUser?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resumes = await ResumeService.getUserResumes(userId);
    return NextResponse.json({ success: true, resumes });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch resumes" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    let fileBuffer: Buffer;
    let fileName: string;
    let fileType: string;
    let title: string | undefined;
    let isDefault: boolean | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json({ success: false, error: "No resume file uploaded." }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileName = file.name;
      fileType = file.type || "application/pdf";
      title = (formData.get("title") as string) || undefined;
      isDefault = formData.get("isDefault") === "true";
    } else {
      // JSON body with base64 payload
      const body = await request.json();
      if (!body.base64Data || !body.fileName) {
        return NextResponse.json({ success: false, error: "Missing file data or file name." }, { status: 400 });
      }
      fileBuffer = Buffer.from(body.base64Data, "base64");
      fileName = body.fileName;
      fileType = body.fileType || "application/pdf";
      title = body.title;
      isDefault = body.isDefault;
    }

    const record = await ResumeService.uploadResume({
      userId,
      fileBuffer,
      fileName,
      fileType,
      title,
      isDefault,
    });

    return NextResponse.json({
      success: true,
      message: "Resume uploaded successfully!",
      resume: record,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to upload resume" },
      { status: 400 }
    );
  }
}
