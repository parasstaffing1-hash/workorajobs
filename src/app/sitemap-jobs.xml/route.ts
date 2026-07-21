import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/slugs";

export async function GET() {
  const now = new Date().toISOString();
  const jobUrls: string[] = [];

  jobs.forEach((job) => {
    const jobTitleSlug = slugify(job.title);
    const companySlug = slugify(job.company);
    const locationSlug = slugify(job.location);

    jobUrls.push(`${siteConfig.url}/jobs/${jobTitleSlug}-in-${locationSlug}`);
    jobUrls.push(`${siteConfig.url}/jobs/${jobTitleSlug}-jobs`);
    jobUrls.push(`${siteConfig.url}/company/${companySlug}-jobs`);
  });

  const uniqueUrls = Array.from(new Set(jobUrls));
  const urlsXml = uniqueUrls
    .map(
      (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
