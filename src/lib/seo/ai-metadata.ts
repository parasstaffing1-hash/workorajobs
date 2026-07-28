import { siteConfig } from "@/lib/site";

export interface AiFaqItem {
  question: string;
  answer: string;
}

export interface AiMetadataPackage {
  entityId: string;
  version: number;
  seoTitle: string;
  metaDescription: string;
  openGraphTitle: string;
  twitterTitle: string;
  twitterDescription: string;
  richSnippets: string;
  faq: AiFaqItem[];
  pageIntroduction: string;
  pageSummary: string[];
  contentHash: string;
}

function enforceCharLimit(text: string, maxChars: number): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;
  const trimmed = clean.slice(0, maxChars - 3);
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace > 20) {
    return `${trimmed.slice(0, lastSpace)}...`;
  }
  return `${trimmed}...`;
}

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Universal TypeScript AI Metadata Package Generator
 */
export function generateAiMetadataPackage(entityId: string, rawTitle: string, location?: string): AiMetadataPackage {
  const cleanTitle = titleize(rawTitle);
  const siteName = siteConfig.name;

  const locStr = location ? `in ${titleize(location)}` : "globally";
  const seoTitle = enforceCharLimit(
    location ? `${cleanTitle} Jobs in ${titleize(location)} | ${siteName}` : `${cleanTitle} Jobs & Careers | ${siteName}`,
    60,
  );

  const metaDescription = enforceCharLimit(
    `Apply to verified ${cleanTitle} roles ${locStr}. Explore clear salary insights, remote flexibility, tech stacks, and direct company applications on ${siteName}.`,
    160,
  );

  const openGraphTitle = enforceCharLimit(
    location ? `${cleanTitle} Openings in ${titleize(location)} - Workora` : `${cleanTitle} Roles & Hiring Companies`,
    60,
  );

  const twitterTitle = enforceCharLimit(`Hiring: ${cleanTitle} | ${siteName}`, 60);
  const twitterDescription = metaDescription;

  const richSnippets = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: cleanTitle,
    description: `Verified ${cleanTitle} career opportunity.`,
    hiringOrganization: {
      "@type": "Organization",
      name: "WorkoraJobs Verified Partner",
      sameAs: siteConfig.url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: location ? titleize(location) : "Remote",
      },
    },
  });

  const faq: AiFaqItem[] = [
    {
      question: `What is the average salary for ${cleanTitle} roles ${locStr}?`,
      answer: `Salaries for ${cleanTitle} professionals ${locStr} typically range from competitive entry-level rates to top tier senior compensation packages based on experience.`,
    },
    {
      question: `Are there remote ${cleanTitle} jobs available?`,
      answer: `Yes, ${siteName} lists active remote and hybrid ${cleanTitle} opportunities from verified employers worldwide.`,
    },
  ];

  const pageIntroduction = `Welcome to the official ${siteName} career portal for ${cleanTitle} positions ${locStr}. As technology teams expand globally, demand for skilled ${cleanTitle} professionals continues to reach record levels.\n\nExplore curated openings with verified compensation data, clear role expectations, and direct application links designed to streamline your recruitment process.`;

  const pageSummary = [
    `Verified ${cleanTitle} job listings ${locStr}`,
    "Transparent salary ranges & experience benchmarks",
    "Direct employer applications with 100% verified status",
    "Remote, hybrid, and relocation sponsorship options available",
  ];

  return {
    entityId,
    version: 1,
    seoTitle,
    metaDescription,
    openGraphTitle,
    twitterTitle,
    twitterDescription,
    richSnippets,
    faq,
    pageIntroduction,
    pageSummary,
    contentHash: `${cleanTitle}-${location || "global"}`,
  };
}
