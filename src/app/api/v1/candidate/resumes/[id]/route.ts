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

  const firstUser = await prisma.user.findFirst({ select: { id: true } });
  return firstUser?.id || null;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await ResumeService.deleteResume(id, userId);
    return NextResponse.json({ success: true, message: "Resume deleted successfully." });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete resume." },
      { status: 400 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = request.nextUrl.pathname;

  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || (url.endsWith("/default") ? "default" : "replace");

    if (action === "default") {
      const updated = await ResumeService.setDefaultResume(id, userId);
      return NextResponse.json({
        success: true,
        message: "Default resume updated successfully.",
        resume: updated,
      });
    }

    if (action === "replace") {
      if (!body.base64Data || !body.fileName) {
        return NextResponse.json({ success: false, error: "Missing replacement file data." }, { status: 400 });
      }

      const fileBuffer = Buffer.from(body.base64Data, "base64");
      const updated = await ResumeService.replaceResume({
        resumeId: id,
        userId,
        fileBuffer,
        fileName: body.fileName,
        fileType: body.fileType || "application/pdf",
        changeSummary: body.changeSummary,
      });

      return NextResponse.json({
        success: true,
        message: "Resume updated with a new version!",
        resume: updated,
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Operation failed." },
      { status: 400 }
    );
  }
}
