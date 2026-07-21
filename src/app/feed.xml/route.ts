import { NextResponse } from "next/server";

import { blogPosts } from "@/data/blog";
import { jobs } from "@/data/jobs";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const feedItems = [
    ...blogPosts.map((post) => ({
      title: post.title,
      link: `${siteConfig.url}/blog/${post.slug}`,
      description: post.excerpt,
      pubDate: new Date(post.date).toUTCString(),
    })),
    ...jobs.map((job) => ({
      title: `${job.title} at ${job.company}`,
      link: `${siteConfig.url}/jobs`,
      description: `${job.title} role in ${job.location} with ${job.company}. Salary: ${job.salary}.`,
      pubDate: new Date("2026-07-01").toUTCString(),
    })),
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>WorkoraJobs RSS Feed</title>
  <link>${siteConfig.url}</link>
  <description>The latest job postings and career advisory insights from WorkoraJobs</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteConfig.url}/feed.xml" rel="self" type="application/rss+xml" />
  ${feedItems
    .map(
      (item) => `
  <item>
    <title><![CDATA[${item.title}]]></title>
    <link>${item.link}</link>
    <guid>${item.link}</guid>
    <description><![CDATA[${item.description}]]></description>
    <pubDate>${item.pubDate}</pubDate>
  </item>`
    )
    .join("")}
</channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}
