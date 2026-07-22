import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";

export async function GET() {
  const now = new Date().toISOString();
  const blogPosts = [
    "building-a-global-hiring-operating-model",
    "candidate-experience-as-a-growth-advantage",
    "what-ai-should-and-should-not-do-in-recruiting",
  ];

  const urls = blogPosts
    .map(
      (slug) => `  <url>
    <loc>${siteConfig.url}/blog/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
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
