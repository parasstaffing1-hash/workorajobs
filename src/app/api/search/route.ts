import { NextResponse } from "next/server";
import { jobs } from "@/data/jobs";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || searchParams.get("search") || searchParams.get("query") || "").toLowerCase().trim();
  const company = (searchParams.get("company") || "").toLowerCase().trim();
  const location = (searchParams.get("location") || "").toLowerCase().trim();
  const department = searchParams.get("department") || "";

  let filtered = [...jobs];

  if (company) {
    filtered = filtered.filter((j) =>
      j.company.toLowerCase().includes(company)
    );
  }

  if (location) {
    filtered = filtered.filter((j) =>
      j.location.toLowerCase().includes(location)
    );
  }

  if (q) {
    filtered = filtered.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (department && department !== "All") {
    filtered = filtered.filter(
      (j) => j.department.toLowerCase() === department.toLowerCase()
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    jobs: filtered,
  });
}
