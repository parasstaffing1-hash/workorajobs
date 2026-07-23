import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const privateDisallows = [
    "/admin",
    "/admin/",
    "/admin/:path*",
    "/employer",
    "/employer/",
    "/employer/:path*",
    "/candidate",
    "/candidate/",
    "/candidate/:path*",
    "/recruiter",
    "/recruiter/",
    "/recruiter/:path*",
    "/dashboard",
    "/dashboard/",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/private",
    "/profile",
    "/settings",
    "/billing",
    "/communications",
    "/analytics",
    "/crm",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Amazonbot",
          "Applebot-Extended",
        ],
        allow: [
          "/",
          "/jobs",
          "/companies",
          "/companies/*",
          "/industries",
          "/industries/*",
          "/freshers-jobs",
          "/internship-jobs",
          "/remote-jobs",
          "/skills",
          "/blog",
        ],
        disallow: privateDisallows,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
