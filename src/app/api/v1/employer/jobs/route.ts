import { NextRequest, NextResponse } from "next/server";
import { JobService } from "@/lib/jobs/job-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { JobPostSchema } from "@/lib/jobs/job-validation-schemas";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || undefined;
    const query = searchParams.get("query") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const data = await JobService.getEmployerJobs(userId, { status, query, page, limit });
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch jobs" },
      { status: 400 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const isDraft = body.action === "save_draft" || body.status === "DRAFT";
    const validation = JobPostSchema.safeParse({
      ...body,
      status: isDraft ? "DRAFT" : "PUBLISHED",
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid job posting details.",
          details: validation.error.issues.map((issue) => issue.message),
        },
        { status: 400 }
      );
    }

    const job = await JobService.createJob(userId, validation.data);

    return NextResponse.json({
      success: true,
      message: isDraft ? "Job draft saved!" : "Job posting published!",
      job,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create job" },
      { status: 400 }
    );
  }
}
