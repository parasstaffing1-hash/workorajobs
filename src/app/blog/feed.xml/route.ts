import { NextResponse } from "next/server";

import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

export async function GET() {
  const feedItems = blogPosts.map((post) => ({
    title: post.title,
    link: `${siteConfig.url}/blog/${post.slug}`,
    description: post.excerpt,
    pubDate: new Date(post.date).toUTCString(),
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>WorkoraJobs - Career Blog</title>
  <link>${siteConfig.url}/blog</link>
  <description>Career tips, AI recruiting research, and hiring insights from WorkoraJobs</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${siteConfig.url}/blog/feed.xml" rel="self" type="application/rss+xml" />
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
