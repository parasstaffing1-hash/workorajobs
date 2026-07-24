import { NextRequest, NextResponse } from "next/server";
import { CandidateSearchService } from "@/lib/candidates/candidate-search-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;
    const location = searchParams.get("location") || undefined;
    const noticePeriod = searchParams.get("noticePeriod") || undefined;
    const maxSalary = searchParams.get("maxSalary") ? parseInt(searchParams.get("maxSalary")!, 10) : undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const data = await CandidateSearchService.searchCandidates(userId, {
      query,
      location,
      noticePeriod,
      maxSalary,
      page,
      limit,
    });

    const savedSearches = await CandidateSearchService.getSavedCandidateSearches(userId);

    return NextResponse.json({ success: true, ...data, savedSearches });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to search candidates" },
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
    const { action, title, filters, candidateUserId, jobId, message } = body;

    if (action === "save_search") {
      const saved = await CandidateSearchService.saveCandidateSearch(userId, title, filters);
      return NextResponse.json({ success: true, message: "Search alert saved!", saved });
    }

    if (action === "invite_candidate") {
      await CandidateSearchService.inviteCandidateToApply(userId, candidateUserId, jobId, message);
      return NextResponse.json({ success: true, message: "Job invitation sent to candidate!" });
    }

    return NextResponse.json({ success: false, error: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Candidate operation failed" },
      { status: 400 }
    );
  }
}
