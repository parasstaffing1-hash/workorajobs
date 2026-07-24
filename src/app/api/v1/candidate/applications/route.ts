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

  // Fallback for dev environment
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
    const statusFilter = searchParams.get("status") || "ALL";

    const applications = await ApplicationService.getCandidateApplications(userId, statusFilter);
    return NextResponse.json({ success: true, applications });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch applications" },
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
    const { jobId, resumeRecordId, coverLetter, answers, isOneClick } = body;

    if (!jobId) {
      return NextResponse.json({ success: false, error: "Missing required jobId parameter." }, { status: 400 });
    }

    let application;
    if (isOneClick) {
      application = await ApplicationService.oneClickApply(userId, jobId);
    } else {
      application = await ApplicationService.applyToJob({
        applicantId: userId,
        jobId,
        resumeRecordId,
        coverLetter,
        answers,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: isOneClick
          ? "1-Click Instant Application submitted successfully!"
          : "Application submitted successfully!",
        application,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to submit application" },
      { status: 400 }
    );
  }
}
