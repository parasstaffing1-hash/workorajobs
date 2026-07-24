import { NextRequest, NextResponse } from "next/server";
import { AtsService } from "@/lib/ats/ats-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId") || undefined;
    const stage = searchParams.get("stage") || undefined;
    const query = searchParams.get("query") || undefined;

    const data = await AtsService.getPipelineApplicants(userId, { jobId, stage, query });
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch ATS applicants" },
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
    const { action, applicationId, stage, note, rating, recommendation, feedback, tag, color } = body;

    if (action === "update_stage") {
      const updated = await AtsService.moveApplicantStage(userId, applicationId, stage);
      return NextResponse.json({ success: true, message: "Applicant stage updated!", application: updated });
    }

    if (action === "add_note") {
      const newNote = await AtsService.addCandidateNote(userId, applicationId, note);
      return NextResponse.json({ success: true, message: "Note added to candidate!", note: newNote });
    }

    if (action === "add_rating") {
      const newRating = await AtsService.addInterviewRating(userId, applicationId, rating, recommendation, feedback, stage);
      return NextResponse.json({ success: true, message: "Scorecard feedback saved!", rating: newRating });
    }

    if (action === "add_tag") {
      const newTag = await AtsService.addCandidateTag(applicationId, tag, color);
      return NextResponse.json({ success: true, message: "Tag added!", tag: newTag });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update ATS applicant" },
      { status: 400 }
    );
  }
}
