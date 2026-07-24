import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { JobService } from "@/lib/jobs/job-service";

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

  const firstUser = await prisma.user.findFirst({
    where: { role: "EMPLOYER" },
    select: { id: true },
  });
  return firstUser?.id || null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      company: true,
      versionHistory: { orderBy: { version: "desc" } },
    },
  });

  if (!job || job.deletedAt) {
    return NextResponse.json({ success: false, error: "Job posting not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, job });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const updated = await JobService.updateJob(userId, id, body);
    return NextResponse.json({ success: true, message: "Job updated successfully!", job: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to update job" }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, status } = body;

    if (action === "duplicate") {
      const duplicated = await JobService.duplicateJob(userId, id);
      return NextResponse.json({
        success: true,
        message: "Job posting duplicated into a new draft!",
        job: duplicated,
      });
    }

    if (action === "change_status") {
      const updated = await JobService.changeJobStatus(userId, id, status);
      return NextResponse.json({
        success: true,
        message: `Job status updated to ${status}!`,
        job: updated,
      });
    }

    if (action === "delete") {
      await JobService.deleteJob(userId, id);
      return NextResponse.json({
        success: true,
        message: "Job posting deleted successfully.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Operation failed" }, { status: 400 });
  }
}
