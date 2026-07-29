import { siteConfig } from "@/lib/site";

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  type: string;
}

export interface GuideTocItem {
  id: string;
  title: string;
}

export interface RelatedJobWidget {
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  url: string;
}

export interface RelatedCompanyWidget {
  name: string;
  logo: string;
  industry: string;
  url: string;
}

export interface SeoGuidePayload {
  category: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  canonicalUrl: string;
  tableOfContents: GuideTocItem[];
  sections: GuideSection[];
  faq: { question: string; answer: string }[];
  relatedJobs: RelatedJobWidget[];
  relatedCompanies: RelatedCompanyWidget[];
  internalLinks: { title: string; url: string }[];
  jsonLd: string;
}

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Next.js SSR SEO Guide Payload Generator
 */
export function getSeoGuidePayload(category: string, slug: string): SeoGuidePayload {
  const titleName = titleize(slug);
  const siteName = siteConfig.name;
  const canonicalUrl = `${siteConfig.url}/${category}/${slug}`;

  return {
    category,
    slug,
    title: `${titleName} Complete Guide & Career Insights 2026 | ${siteName}`,
    subtitle: `In-depth resource covering skills, salaries, hiring companies, and interview preparation for ${titleName}.`,
    description: `Comprehensive 2026 ${titleName} guide. Key trends, salary benchmarks, interview preparation, and top hiring companies.`,
    canonicalUrl,
    tableOfContents: [
      { id: "overview", title: "1. Overview & Market Demand" },
      { id: "salary", title: "2. Salary Benchmarks & Percentiles" },
      { id: "skills", title: "3. Essential Skills & Milestones" },
      { id: "interview-prep", title: "4. Technical Interview Prep" },
      { id: "faq", title: "5. Frequently Asked Questions" },
    ],
    sections: [
      {
        id: "overview",
        title: "1. Overview & Market Demand",
        content: `${titleName} expertise continues to expand rapidly in the tech industry. Employers prioritize verified practical experience and strong system design capabilities.`,
        type: "text",
      },
      {
        id: "salary",
        title: "2. Salary Benchmarks & Percentiles",
        content: `Average compensation for ${titleName} roles ranges from $100,000 to $180,000+ depending on geography and experience level.`,
        type: "table",
      },
    ],
    faq: [
      {
        question: `Why is ${titleName} important for career growth in 2026?`,
        answer: `${titleName} provides high leverage across cloud engineering, software architecture, and product development.`,
      },
    ],
    relatedJobs: [
      { title: `Senior ${titleName} Engineer`, company: "TechCorp", location: "Remote", salaryRange: "$150k - $200k", url: `${siteConfig.url}/jobs` },
    ],
    relatedCompanies: [
      { name: "Acme Systems", logo: "/workora-jobs-logo-scraped.png", industry: "Software", url: `${siteConfig.url}/companies` },
    ],
    internalLinks: [
      { title: `${titleName} Salary Breakdown`, url: `${siteConfig.url}/salary/${slug}` },
    ],
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: `${titleName} Complete Guide`,
      url: canonicalUrl,
    }),
  };
}
