import { NextResponse } from "next/server";

import { industriesData } from "@/data/industries";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const now = new Date().toISOString();

  const urls = industriesData
    .map(
      (ind) => `  <url>
    <loc>${siteConfig.url}/industries/${ind.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
