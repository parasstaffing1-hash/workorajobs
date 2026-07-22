import { getJobSlug, slugify } from "@/data/jobs";
import { prisma } from "@/lib/prisma";

export interface SeoMetadataResult {
  title: string;
  description: string;
  canonicalUrl: string;
  h1: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: string;
  };
}

export class ProgrammaticSeoEngine {
  private static baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://workorajobs.com";

  /**
   * Generates dynamic SEO metadata for combination programmatic routes (e.g., "python-jobs-in-bangalore")
   */
  static generateCombinationMetadata(skill?: string, location?: string, workMode?: string): SeoMetadataResult {
    let title = "Jobs & Career Opportunities | WorkoraJobs";
    let description = "Discover curated job openings with top tech companies on WorkoraJobs.";
    let h1 = "Find Your Next Career Opportunity";
    let path = "/jobs";

    if (skill && location) {
      const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
      const locName = location.charAt(0).toUpperCase() + location.slice(1);
      title = `${skillName} Jobs in ${locName} | Apply Today - WorkoraJobs`;
      description = `Explore top ${skillName} job vacancies in ${locName}. Apply now to verified remote, hybrid, and full-time tech roles on WorkoraJobs.`;
      h1 = `${skillName} Jobs in ${locName}`;
      path = `/jobs/${slugify(skill)}-in-${slugify(location)}`;
    } else if (workMode === "remote") {
      title = "Remote Tech & Software Engineering Jobs | WorkoraJobs";
      description = "Browse high-paying remote software engineering, product design, and AI jobs from global hiring companies.";
      h1 = "Remote Tech Jobs & Career Opportunities";
      path = "/remote-jobs";
    } else if (skill) {
      const skillName = skill.charAt(0).toUpperCase() + skill.slice(1);
      title = `${skillName} Jobs & Hiring Companies | WorkoraJobs`;
      description = `Find high-paying ${skillName} developer roles. Browse software engineer jobs requiring ${skillName} expertise.`;
      h1 = `${skillName} Jobs`;
      path = `/skills/${slugify(skill)}`;
    }

    const canonicalUrl = `${this.baseUrl}${path}`;

    return {
      title,
      description,
      canonicalUrl,
      h1,
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "WorkoraJobs",
        type: "website",
      },
    };
  }

  /**
   * Generates Google valid JobPosting JSON-LD Schema
   */
  static generateJobPostingSchema(job: {
    id: string;
    title: string;
    description: string;
    location?: string | null;
    salary?: number | null;
    workMode?: string | null;
    type?: string | null;
    postedAt: Date;
    company: { name: string; websiteUrl?: string | null; logoUrl?: string | null };
  }) {
    const jobUrl = `${this.baseUrl}/jobs/${getJobSlug({ id: job.id, title: job.title, company: job.company.name })}`;

    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: job.title,
      description: job.description,
      datePosted: job.postedAt.toISOString(),
      validThrough: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      employmentType: job.type || "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: job.company.name,
        sameAs: job.company.websiteUrl || undefined,
        logo: job.company.logoUrl || undefined,
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: job.location || "Remote",
          addressCountry: "US",
        },
      },
      ...(job.workMode === "Remote"
        ? {
            jobLocationType: "TELECOMMUTE",
            applicantLocationRequirements: { "@type": "Country", name: "Worldwide" },
          }
        : {}),
      baseSalary: job.salary
        ? {
            "@type": "MonetaryAmount",
            currency: "USD",
            value: {
              "@type": "QuantitativeValue",
              value: job.salary,
              unitText: "YEAR",
            },
          }
        : undefined,
      directApply: true,
      url: jobUrl,
    };
  }

  /**
   * Generates BreadcrumbList Schema
   */
  static generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${this.baseUrl}${item.url}`,
      })),
    };
  }

  /**
   * Submits URLs to IndexNow API for immediate Google & Bing search indexing
   */
  static async submitToIndexNow(urls: string[]): Promise<{ success: boolean; message: string }> {
    const host = "workorajobs.com";
    const key = process.env.INDEXNOW_KEY || "workorajobs-indexnow-key";

    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key,
          keyLocation: `https://${host}/${key}.txt`,
          urlList: urls,
        }),
      });

      if (res.ok || res.status === 202) {
        return { success: true, message: `Successfully submitted ${urls.length} URLs to IndexNow.` };
      }
      return { success: false, message: `IndexNow returned status ${res.status}` };
    } catch (e: any) {
      return { success: false, message: e?.message || "IndexNow submission network error" };
    }
  }
}
