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

  // 1. POST /api/v1/applications
  if (subPath === "") {
    try {
      const body = await request.json();
      const application = await ApplicationService.submitApplication({
        applicantId: authUser.userId,
        jobId: body.jobId,
        resumeId: body.resumeId,
        coverLetter: body.coverLetter,
      });
      return NextResponse.json({ success: true, application }, { status: 201 });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to submit application" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/applications/${subPath} not found` }, { status: 404 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. GET /api/v1/applications/job/:id (Employer view applicants for job)
  if (subPath.startsWith("job/")) {
    const jobId = subPath.split("/")[1];
    try {
      const applicants = await ApplicationService.getJobApplicants(authUser.userId, jobId);
      return NextResponse.json({ success: true, count: applicants.length, applicants });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to load applicants" }, { status: 403 });
    }
  }

  // 2. GET /api/v1/applications (Candidate applications)
  if (subPath === "") {
    const applications = await ApplicationService.getCandidateApplications(authUser.userId);
    return NextResponse.json({ success: true, count: applications.length, applications });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/applications/${subPath} not found` }, { status: 404 });
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

  // 1. PATCH /api/v1/applications/:id/status (Employer update status)
  if (subPath.endsWith("/status")) {
    const applicationId = subPath.split("/")[0];
    try {
      const body = await request.json();
      const updated = await ApplicationService.updateApplicationStatus({
        applicationId,
        changedById: authUser.userId,
        newStatus: body.status,
        note: body.note,
      });
      return NextResponse.json({ success: true, application: updated });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Failed to update status" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route PATCH /api/v1/applications/${subPath} not found` }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const applicationId = route ? route[0] : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const withdrawn = await ApplicationService.withdrawApplication(authUser.userId, applicationId);
    return NextResponse.json({ success: true, message: "Application withdrawn successfully", application: withdrawn });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Failed to withdraw application" }, { status: 400 });
  }
}
