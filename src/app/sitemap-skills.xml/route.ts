import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/slugs";

export async function GET() {
  const now = new Date().toISOString();
  const skillUrls: string[] = [];

  jobs.forEach((job) => {
    job.requiredSkills.forEach((skill) => {
      skillUrls.push(`${siteConfig.url}/skills/${slugify(skill)}-jobs`);
    });
  });

  const uniqueUrls = Array.from(new Set(skillUrls));
  const urlsXml = uniqueUrls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
