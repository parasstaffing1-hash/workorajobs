import { NextResponse } from "next/server";

import { companiesData } from "@/data/companies";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const industry = searchParams.get("industry") || "";
  const size = searchParams.get("size") || "";
  const headquarters = searchParams.get("headquarters") || "";

  let filtered = [...companiesData];

  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.industry.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search) ||
        c.techStack.some((t) => t.toLowerCase().includes(search)),
    );
  }

  if (industry && industry !== "All") {
    filtered = filtered.filter((c) =>
      c.industry.toLowerCase().includes(industry.toLowerCase()),
    );
  }

  if (size && size !== "All") {
    filtered = filtered.filter((c) => c.size.includes(size));
  }

  if (headquarters && headquarters !== "All") {
    filtered = filtered.filter((c) =>
      c.headquarters.toLowerCase().includes(headquarters.toLowerCase()),
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    companies: filtered,
  });
}
