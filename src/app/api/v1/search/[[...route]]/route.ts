import { NextRequest, NextResponse } from "next/server";
import { JobSearchEngine } from "@/lib/search/search-engine";
import { JobSearchQueryParams } from "@/lib/search/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const { searchParams } = new URL(request.url);

  // 1. GET /api/v1/search/suggestions
  if (subPath === "suggestions") {
    const q = searchParams.get("q") || "";
    const suggestions = await JobSearchEngine.getSuggestions(q);
    return NextResponse.json({ success: true, suggestions });
  }

  // 2. GET /api/v1/search/filters
  if (subPath === "filters") {
    const facets = await JobSearchEngine.getFilterFacets();
    return NextResponse.json({ success: true, filters: facets });
  }

  // 3. GET /api/v1/search/jobs/:id/similar
  if (subPath.startsWith("jobs/") && subPath.endsWith("/similar")) {
    const parts = subPath.split("/");
    const jobId = parts[1]; // Extract job ID
    const similarJobs = await JobSearchEngine.getSimilarJobs(jobId);
    return NextResponse.json({ success: true, count: similarJobs.length, jobs: similarJobs });
  }

  // 4. Primary GET /api/v1/search
  if (subPath === "" || subPath === "query") {
    const queryParams: JobSearchQueryParams = {
      q: searchParams.get("q") || undefined,
      company: searchParams.get("company") || undefined,
      location: searchParams.get("location") || undefined,
      workMode: (searchParams.get("workMode") as any) || undefined,
      type: searchParams.get("type") || undefined,
      experience: searchParams.get("experience") || undefined,
      minSalary: searchParams.get("minSalary") ? parseInt(searchParams.get("minSalary")!) : undefined,
      maxSalary: searchParams.get("maxSalary") ? parseInt(searchParams.get("maxSalary")!) : undefined,
      datePosted: (searchParams.get("datePosted") as any) || undefined,
      sort: (searchParams.get("sort") as any) || undefined,
      page: searchParams.get("page") ? parseInt(searchParams.get("page")!) : 1,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 20,
    };

    const result = await JobSearchEngine.search(queryParams);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: `Route /api/v1/search/${subPath} not found` },
    { status: 404 }
  );
}
