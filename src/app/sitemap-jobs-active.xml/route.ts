import { NextResponse } from "next/server";

import { jobs, getJobSlug } from "@/data/jobs";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const now = new Date().toISOString();

  // Include ONLY active, non-closed jobs
  const activeJobs = jobs.filter((j) => !j.isClosed);

  const urls = activeJobs
    .map((job) => {
      const slug = getJobSlug(job);
      const datePosted = job.datePostedIso || now;
      return `  <url>
    <loc>${siteConfig.url}/jobs/${slug}</loc>
    <lastmod>${datePosted}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    })
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
