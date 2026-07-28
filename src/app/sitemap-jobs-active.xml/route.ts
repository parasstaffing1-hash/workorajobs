import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { siteConfig } from "@/lib/site";
import { getActiveJobSitemapUrls, renderUrlSet } from "@/lib/seo/sitemap-utils";

export async function GET(request: NextRequest) {
  const page = Number.parseInt(request.nextUrl.searchParams.get("page") || "0", 10);
  const urls = await getActiveJobSitemapUrls(siteConfig.url, Number.isFinite(page) ? page : 0);
  const xml = renderUrlSet(urls);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
