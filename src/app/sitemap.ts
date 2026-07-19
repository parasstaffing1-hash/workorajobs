import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { siteConfig } from "@/lib/site";

import { jobs } from "@/data/jobs";
import { slugify } from "@/lib/slugs";

const staticRoutes = [
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
  "/resources",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/employer",
  "/employer/company",
  "/employer/jobs",
  "/employer/jobs/new",
  "/employer/applicants",
  "/employer/calendar",
  "/employer/settings",
  "/candidate",
  "/candidate/profile",
  "/candidate/jobs",
  "/candidate/applications",
  "/candidate/saved-jobs",
  "/candidate/notifications",
  "/recruiter",
  "/recruiter/candidates",
  "/recruiter/pipeline",
  "/recruiter/search",
  "/recruiter/calendar",
  "/recruiter/tasks",
  "/recruiter/automation",
  "/admin",
  "/admin/users",
  "/admin/jobs",
  "/admin/applications",
  "/admin/roles",
  "/admin/audit",
  "/admin/search",
  "/admin/content",
  "/admin/media",
  "/admin/settings",
  "/admin/feature-flags",
  "/admin/analytics",
  "/admin/billing",
  "/admin/crm",
  "/admin/communications",
  "/crm",
  "/crm/leads",
  "/crm/clients",
  "/crm/pipeline",
  "/crm/tasks",
  "/analytics",
  "/analytics/reports",
  "/billing",
  "/communications",
  "/remote-jobs",
  "/freshers-jobs",
  "/internship-jobs",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Dynamic programmatic SEO page lists
  const pSeoUrls: Array<{ url: string; lastModified: Date; changeFrequency: "weekly" | "monthly"; priority: number }> = [];

  jobs.forEach((job) => {
    const jobTitleSlug = slugify(job.title);
    const companySlug = slugify(job.company);
    const locationSlug = slugify(job.location);

    // Job title + location
    pSeoUrls.push({
      url: `${siteConfig.url}/jobs/${jobTitleSlug}-in-${locationSlug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Job title jobs
    pSeoUrls.push({
      url: `${siteConfig.url}/jobs/${jobTitleSlug}-jobs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Company jobs
    pSeoUrls.push({
      url: `${siteConfig.url}/company/${companySlug}-jobs`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    // Skills pages
    job.requiredSkills.forEach((skill) => {
      pSeoUrls.push({
        url: `${siteConfig.url}/skills/${slugify(skill)}-jobs`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.75,
      });
    });
  });

  // Deduplicate dynamic programmatic SEO URLs
  const uniqueUrlsMap = new Map<string, typeof pSeoUrls[number]>();
  pSeoUrls.forEach((item) => {
    uniqueUrlsMap.set(item.url, item);
  });
  const uniquePSeoUrls = Array.from(uniqueUrlsMap.values());

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
      changeFrequency:
        route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.75,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
    ...uniquePSeoUrls,
  ];
}
