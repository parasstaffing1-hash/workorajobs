import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { JobService } from "@/lib/jobs/job-service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request, "EMPLOYER");
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const job = await JobService.getEmployerJob(userId, id);
    return NextResponse.json({ success: true, job });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Job posting not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getAuthUserId(request, "EMPLOYER");
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
  const userId = await getAuthUserId(request, "EMPLOYER");
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
