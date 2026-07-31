import { NextRequest, NextResponse } from "next/server";
import { SearchFactory } from "@/lib/search/search-factory";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params = {
      q: searchParams.get("q") || undefined,
      company: searchParams.get("company") || undefined,
      location: searchParams.get("location") || undefined,
      workMode: searchParams.get("workMode") || undefined,
      type: searchParams.get("type") || undefined,
      experience: searchParams.get("experience") || undefined,
      industry: searchParams.get("industry") || undefined,
      skills: searchParams.get("skills") ? searchParams.get("skills")!.split(",") : undefined,
      minSalary: searchParams.get("minSalary") ? Number(searchParams.get("minSalary")) : undefined,
      maxSalary: searchParams.get("maxSalary") ? Number(searchParams.get("maxSalary")) : undefined,
      datePosted: searchParams.get("datePosted") || undefined,
      sort: (searchParams.get("sort") as any) || "RELEVANCE",
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 20,
    };

    const result = await SearchFactory.searchJobs(params);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to execute job search." },
      { status: 500 }
    );
  }
}
