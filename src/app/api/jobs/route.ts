import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const company = searchParams.get("company")?.toLowerCase() || "";
  const search = searchParams.get("search")?.toLowerCase() || "";
  const department = searchParams.get("department") || "";

  let filtered = [...jobs];

  if (company) {
    filtered = filtered.filter((j) =>
      j.company.toLowerCase().includes(company),
    );
  }

  if (search) {
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company.toLowerCase().includes(search) ||
        j.description.toLowerCase().includes(search) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(search)),
    );
  }

  if (department && department !== "All") {
    filtered = filtered.filter(
      (j) => j.department.toLowerCase() === department.toLowerCase(),
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    jobs: filtered,
  });
}
