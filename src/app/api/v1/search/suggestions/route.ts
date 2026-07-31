import { NextRequest, NextResponse } from "next/server";
import { SearchFactory } from "@/lib/search/search-factory";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const suggestions = await SearchFactory.getSuggestions(q);
    return NextResponse.json({ success: true, suggestions });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch suggestions." },
      { status: 500 }
    );
  }
}
