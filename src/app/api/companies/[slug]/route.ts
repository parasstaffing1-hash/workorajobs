import { NextResponse } from "next/server";
import { companiesData } from "@/data/companies";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase().trim().replace("-jobs", "");

  const company = companiesData.find(
    (c) =>
      c.slug === cleanSlug ||
      c.id === cleanSlug ||
      c.ticker.toLowerCase() === cleanSlug
  );

  if (!company) {
    return NextResponse.json(
      { success: false, error: "Company not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    company,
  });
}
