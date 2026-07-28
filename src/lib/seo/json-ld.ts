import { siteConfig } from "@/lib/site";
import type { Job } from "@/data/jobs";

export interface BreadcrumbItemInput {
  name: string;
  url: string;
}

export interface FaqItemInput {
  question: string;
  answer: string;
}

/**
 * Generate Schema.org JobPosting JSON-LD object for Next.js SSR / Metadata injection
 */
export function generateJobPostingJsonLd(job: Partial<Job> & { id?: string; title: string; description: string }) {
  const companyName = job.company || "WorkoraJobs Verified Partner";
  const locationName = job.location || "Remote / Global";
  const empType = job.type ? job.type.toUpperCase().replace(/-/g, "_") : "FULL_TIME";
  const datePosted = job.datePostedIso || new Date().toISOString();

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted,
    employmentType: empType,
    directApply: true,
    identifier: {
      "@type": "PropertyValue",
      name: "WorkoraJobs",
      value: job.id || job.title,
    },
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
      sameAs: siteConfig.url,
      logo: `${siteConfig.url}/workora-jobs-logo-scraped.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: locationName,
      },
    },
  };
}

/**
 * Generate Schema.org Organization JSON-LD object
 */
export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/workora-jobs-logo-scraped.png`,
    description: siteConfig.description,
    sameAs: [
      siteConfig.links.linkedin,
      siteConfig.links.x,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@workorajobs.com",
      contactType: "customer service",
    },
  };
}

/**
 * Generate Schema.org FAQPage JSON-LD object
 */
export function generateFaqJsonLd(faqs: FaqItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD object
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItemInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith("http")
        ? item.url
        : `${siteConfig.url}/${item.url.replace(/^\//, "")}`;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

/**
 * Generate Schema.org WebSite + SearchAction JSON-LD object
 */
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/jobs?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
