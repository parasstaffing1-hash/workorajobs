import { NextResponse } from "next/server";

import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

const publicStaticRoutes = [
  "",
  "/about",
  "/services",
  "/prep",
  "/resume-builder",
  "/companies",
  "/industries",
  "/jobs",
  "/employers",
  "/candidates",
  "/tools",
  "/tools/boolean-search",
  "/resources",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/remote-jobs",
  "/freshers-jobs",
  "/internship-jobs",
];

export async function GET() {
  const now = new Date().toISOString();
  const urls = [
    ...publicStaticRoutes.map(
      (route) => `  <url>
    <loc>${siteConfig.url}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === "" ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "" ? "1.0" : "0.75"}</priority>
  </url>`
    ),
    ...blogPosts.map(
      (post) => `  <url>
    <loc>${siteConfig.url}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.65</priority>
  </url>`
    ),
  ].join("\n");

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
