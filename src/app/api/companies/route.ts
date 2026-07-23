import { NextResponse } from "next/server";
import { companiesData } from "@/data/companies";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  const targetSlug = searchParams.get("slug")?.toLowerCase().trim();
  if (targetSlug) {
    const single = companiesData.find(
      (c) =>
        c.slug === targetSlug ||
        c.id === targetSlug ||
        c.ticker.toLowerCase() === targetSlug
    );
    if (!single) {
      return NextResponse.json(
        { success: false, error: "Company not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, company: single });
  }

  const search = searchParams.get("search")?.toLowerCase().trim() || "";

  const industry = searchParams.get("industry") || "";
  const exchange = searchParams.get("exchange") || "";
  const country = searchParams.get("country") || "";
  const size = searchParams.get("size") || "";
  const letter = searchParams.get("letter")?.toUpperCase().trim() || "";
  const sort = searchParams.get("sort") || "name_asc"; // name_asc, rating_desc, employees_desc
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "24", 10)));

  let filtered = [...companiesData];

  // 1. Text Search (Name, Ticker, Tech Stack, Industry, Overview)
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.ticker.toLowerCase().includes(search) ||
        c.industry.toLowerCase().includes(search) ||
        c.subIndustry.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search) ||
        c.techStack.some((t) => t.toLowerCase().includes(search))
    );
  }

  // 2. Industry Filter
  if (industry && industry !== "All") {
    filtered = filtered.filter((c) =>
      c.industry.toLowerCase().includes(industry.toLowerCase())
    );
  }

  // 3. Stock Exchange Filter (NSE, BSE, NASDAQ, NYSE)
  if (exchange && exchange !== "All") {
    filtered = filtered.filter(
      (c) => c.stockExchange.toUpperCase() === exchange.toUpperCase()
    );
  }

  // 4. Country Filter
  if (country && country !== "All") {
    filtered = filtered.filter((c) =>
      c.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  // 5. Size Filter
  if (size && size !== "All") {
    filtered = filtered.filter((c) => c.size.includes(size));
  }

  // 6. Alphabet Letter Filter (A-Z)
  if (letter && letter !== "ALL" && /^[A-Z]$/.test(letter)) {
    filtered = filtered.filter((c) =>
      c.name.trim().toUpperCase().startsWith(letter)
    );
  }

  // 7. Sorting
  if (sort === "name_desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "rating_desc") {
    filtered.sort((a, b) => b.glassdoorRating - a.glassdoorRating);
  } else if (sort === "employees_desc") {
    filtered.sort((a, b) => {
      const getNum = (str: string) => parseInt(str.replace(/[^0-9]/g, "") || "0", 10);
      return getNum(b.employeeCount) - getNum(a.employeeCount);
    });
  } else {
    // Default: name_asc
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  // 8. Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedCompanies = filtered.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    success: true,
    total,
    page,
    totalPages,
    limit,
    companies: paginatedCompanies,
  });
}
