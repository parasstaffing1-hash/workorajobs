import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { EmployerAtsService } from "@/lib/employer/ats-service";

export const dynamic = "force-dynamic";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyJwt(token);
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

  try {
    // 1. GET /api/v1/employer/company
    if (subPath === "company") {
      const profile = await EmployerAtsService.getCompanyProfile(authUser.userId);
      return NextResponse.json({ success: true, company: profile });
    }

    // 2. GET /api/v1/employer/dashboard
    if (subPath === "dashboard") {
      const metrics = await EmployerAtsService.getDashboardMetrics(authUser.userId);
      return NextResponse.json({ success: true, metrics });
    }

    return NextResponse.json({ success: false, error: `Route GET /api/v1/employer/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Employer ATS Error" }, { status: 400 });
  }
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

  try {
    const body = await request.json();

    // 1. POST /api/v1/employer/jobs
    if (subPath === "jobs") {
      const job = await EmployerAtsService.createJob(authUser.userId, body);
      return NextResponse.json({ success: true, job }, { status: 201 });
    }

    // 2. POST /api/v1/employer/interviews
    if (subPath === "interviews") {
      const interview = await EmployerAtsService.scheduleInterview(authUser.userId, body);
      return NextResponse.json({ success: true, interview }, { status: 201 });
    }

    // 3. POST /api/v1/employer/applications/:id/notes
    if (subPath.startsWith("applications/") && subPath.endsWith("/notes")) {
      const applicationId = subPath.split("/")[1];
      const note = await EmployerAtsService.addCandidateNote(authUser.userId, applicationId, body.content);
      return NextResponse.json({ success: true, note }, { status: 201 });
    }

    // 4. POST /api/v1/employer/applications/:id/rating
    if (subPath.startsWith("applications/") && subPath.endsWith("/rating")) {
      const applicationId = subPath.split("/")[1];
      const rating = await EmployerAtsService.addCandidateRating(authUser.userId, applicationId, body.rating, body.feedback);
      return NextResponse.json({ success: true, rating }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: `Route POST /api/v1/employer/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Employer ATS Action Failed" }, { status: 400 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 1. PUT /api/v1/employer/company
    if (subPath === "company") {
      const updated = await EmployerAtsService.updateCompanyProfile(authUser.userId, body);
      return NextResponse.json({ success: true, company: updated });
    }

    // 2. PUT /api/v1/employer/jobs/:id
    if (subPath.startsWith("jobs/")) {
      const jobId = subPath.split("/")[1];
      const updatedJob = await EmployerAtsService.updateJob(authUser.userId, jobId, body);
      return NextResponse.json({ success: true, job: updatedJob });
    }

    return NextResponse.json({ success: false, error: `Route PUT /api/v1/employer/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Update Failed" }, { status: 400 });
  }
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

  try {
    const body = await request.json();

    // 1. PATCH /api/v1/employer/applications/:id/stage
    if (subPath.startsWith("applications/") && subPath.endsWith("/stage")) {
      const applicationId = subPath.split("/")[1];
      const updated = await EmployerAtsService.updateApplicationStage(authUser.userId, applicationId, body.stage, body.note);
      return NextResponse.json({ success: true, application: updated });
    }

    return NextResponse.json({ success: false, error: `Route PATCH /api/v1/employer/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Stage Update Failed" }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. DELETE /api/v1/employer/jobs/:id
    if (subPath.startsWith("jobs/")) {
      const jobId = subPath.split("/")[1];
      await EmployerAtsService.deleteJob(authUser.userId, jobId);
      return NextResponse.json({ success: true, message: "Job archived/deleted successfully" });
    }

    return NextResponse.json({ success: false, error: `Route DELETE /api/v1/employer/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Delete Failed" }, { status: 400 });
  }
}
