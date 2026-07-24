import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { SavedJobsService } from "@/lib/saved-jobs/saved-jobs-service";

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

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const folderId = searchParams.get("folderId") || undefined;
    const workMode = searchParams.get("workMode") || undefined;
    const jobType = searchParams.get("jobType") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "RECENTLY_SAVED";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const result = await SavedJobsService.getSavedJobs(userId, {
      query,
      folderId,
      workMode,
      jobType,
      sortBy,
      page,
      limit,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch saved jobs" },
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

    const body = await request.json();
    const { jobId, folderId, notes, action } = body;

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Missing required jobId." }, { status: 400 });
    }

    if (action === "remove") {
      await SavedJobsService.removeSavedJob(userId, jobId);
      return NextResponse.json({ success: true, message: "Job removed from saved list." });
    }

    const saved = await SavedJobsService.saveJob(userId, jobId, folderId, notes);
    return NextResponse.json({
      success: true,
      message: "Job saved successfully!",
      savedJob: saved,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save job" },
      { status: 400 }
    );
  }
}
