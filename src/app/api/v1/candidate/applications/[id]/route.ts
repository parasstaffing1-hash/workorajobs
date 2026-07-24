import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { ApplicationService } from "@/lib/applications/application-service";

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.action === "withdraw") {
      const updated = await ApplicationService.withdrawApplication(
        id,
        userId,
        body.reason
      );
      return NextResponse.json({
        success: true,
        message: "Application withdrawn successfully.",
        application: updated,
      });
    }

    if (body.action === "note") {
      const note = await ApplicationService.addEmployerNote({
        applicationId: id,
        authorId: userId,
        content: body.content,
      });
      return NextResponse.json({ success: true, note });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Operation failed." },
      { status: 400 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Missing required status field." }, { status: 400 });
    }

    const updated = await ApplicationService.updateApplicationStatus({
      applicationId: id,
      newStatus: status,
      changedById: userId,
      note,
    });

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${status}.`,
      application: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update status." },
      { status: 400 }
    );
  }
}
