import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
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
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
