import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";
import { getActiveJobSitemapCount, renderSitemapIndex, SITEMAP_URL_LIMIT } from "@/lib/seo/sitemap-utils";

export async function GET() {
  const now = new Date().toISOString();
  const activeJobCount = await getActiveJobSitemapCount();
  const activeJobSitemapPages = Math.max(1, Math.ceil(activeJobCount / SITEMAP_URL_LIMIT));
  const jobSitemaps = Array.from({ length: activeJobSitemapPages }, (_, page) => ({
    loc: page === 0
      ? `${siteConfig.url}/sitemap-jobs-active.xml`
      : `${siteConfig.url}/sitemap-jobs-active.xml?page=${page}`,
    lastmod: now,
  }));

  const xml = renderSitemapIndex([
    { loc: `${siteConfig.url}/sitemap-pages.xml`, lastmod: now },
    ...jobSitemaps,
    { loc: `${siteConfig.url}/sitemap-companies.xml`, lastmod: now },
    { loc: `${siteConfig.url}/sitemap-industries.xml`, lastmod: now },
    { loc: `${siteConfig.url}/sitemap-skills.xml`, lastmod: now },
    { loc: `${siteConfig.url}/sitemap-blog.xml`, lastmod: now },
  ]);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
