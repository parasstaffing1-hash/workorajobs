import { siteConfig } from "@/lib/site";

export type PseoDimension =
  | "jobs"
  | "companies"
  | "cities"
  | "states"
  | "countries"
  | "skills"
  | "industries"
  | "salaries"
  | "interview-questions"
  | "career-paths"
  | "certifications"
  | "remote-jobs"
  | "govt-jobs"
  | "startup-jobs"
  | "walkin-jobs"
  | "visa-sponsorship-jobs";

export interface RelatedLink {
  title: string;
  url: string;
  type: string;
}

export interface PseoBreadcrumb {
  name: string;
  url: string;
}

export interface PseoPageData {
  dimension: PseoDimension;
  slug: string;
  title: string;
  description: string;
  canonicalUrl: string;
  jsonLd: string;
  openGraph: Record<string, string>;
  twitterCard: Record<string, string>;
  breadcrumbs: PseoBreadcrumb[];
  relatedPages: RelatedLink[];
  internalLinks: RelatedLink[];
}

function titleize(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Universal TypeScript Programmatic SEO Page Resolver
 */
export function getPseoPageData(dimension: PseoDimension, rawSlug: string): PseoPageData {
  const slug = rawSlug.toLowerCase().trim() || "all";
  const titleName = titleize(slug);
  const siteName = siteConfig.name;

  let title = "";
  let description = "";
  let relativePath = "";
  let primaryType = "WebPage";

  switch (dimension) {
    case "jobs":
      relativePath = `/jobs/${slug}`;
      title = `${titleName} Jobs & Careers`;
      description = `Apply to active ${titleName} roles. Verified compensation, remote flexibility, and career insights on ${siteName}.`;
      primaryType = "JobPosting";
      break;

    case "companies":
      relativePath = `/companies/${slug}`;
      title = `${titleName} Careers, Jobs & Company Profile`;
      description = `Explore open positions, company culture, salary insights, and tech stack at ${titleName}.`;
      primaryType = "Organization";
      break;

    case "cities":
      relativePath = `/jobs/location/${slug}`;
      title = `Tech & Remote Jobs in ${titleName}`;
      description = `Find top software engineering, product, and data jobs hiring in ${titleName}. Compare salaries and apply directly.`;
      primaryType = "CollectionPage";
      break;

    case "states":
      relativePath = `/jobs/location/state/${slug}`;
      title = `Jobs in ${titleName} State | Hiring Openings`;
      description = `Browse verified technology, engineering, and remote career opportunities across ${titleName}.`;
      primaryType = "CollectionPage";
      break;

    case "countries":
      relativePath = `/companies/country/${slug}`;
      title = `Global Tech Employers & Companies in ${titleName}`;
      description = `Discover leading technology companies hiring verified talent in ${titleName} with remote and international sponsorship.`;
      primaryType = "CollectionPage";
      break;

    case "skills":
      relativePath = `/skills/${slug}`;
      title = `${titleName} Developer Jobs & Hiring Companies`;
      description = `Find high-paying ${titleName} developer roles. Compare salaries, required skills, and top tech companies hiring ${titleName} experts.`;
      primaryType = "ItemPage";
      break;

    case "industries":
      relativePath = `/industries/${slug}`;
      title = `${titleName} Industry Careers & Tech Roles`;
      description = `Explore career growth, hiring companies, and open engineering positions in the ${titleName} industry.`;
      primaryType = "ItemPage";
      break;

    case "salaries":
      relativePath = `/salary/${slug}`;
      title = `${titleName} Salary Benchmark & Compensation Guide`;
      description = `Check current ${titleName} salary averages, experience level breakdowns, and top paying locations on ${siteName}.`;
      primaryType = "FAQPage";
      break;

    case "interview-questions":
      relativePath = `/prep/interview-questions/${slug}`;
      title = `Top ${titleName} Interview Questions & Answers`;
      description = `Master your ${titleName} technical interview with real questions, system design walkthroughs, and expert answers.`;
      primaryType = "FAQPage";
      break;

    case "career-paths":
      relativePath = `/prep/career-paths/${slug}`;
      title = `${titleName} Career Path, Roadmap & Salary Growth`;
      description = `Complete ${titleName} career roadmap. Learn required skills, progression levels, certifications, and target salaries.`;
      primaryType = "ItemPage";
      break;

    case "certifications":
      relativePath = `/prep/certifications/${slug}`;
      title = `${titleName} Certification Prep & Exam Guide`;
      description = `Prepare for ${titleName} certification exam. Practice questions, syllabus highlights, and career impact insights.`;
      primaryType = "ItemPage";
      break;

    case "remote-jobs":
      relativePath = `/remote-jobs/${slug}`;
      title = `Remote ${titleName} Jobs | Work From Anywhere`;
      description = `Find 100% remote ${titleName} jobs from global startups and Fortune 500 technology companies.`;
      primaryType = "CollectionPage";
      break;

    case "govt-jobs":
      relativePath = `/govt-jobs/${slug}`;
      title = `Government & Public Sector Jobs in ${titleName}`;
      description = `Official public sector notifications, engineering exams, and government job updates in ${titleName}.`;
      primaryType = "CollectionPage";
      break;

    case "startup-jobs":
      relativePath = `/companies/startups/${slug}`;
      title = `High-Growth ${titleName} Startup Jobs & Equity Roles`;
      description = `Join funded ${titleName} startups. Explore competitive compensation, equity options, and high-impact engineering roles.`;
      primaryType = "CollectionPage";
      break;

    case "walkin-jobs":
      relativePath = `/walkin-jobs/${slug}`;
      title = `Walk-in Interviews & Direct Hiring Drives in ${titleName}`;
      description = `Upcoming walk-in interview drives in ${titleName} for freshers and experienced tech candidates.`;
      primaryType = "CollectionPage";
      break;

    case "visa-sponsorship-jobs":
      relativePath = `/visa-sponsorship-jobs/${slug}`;
      title = `Visa Sponsorship ${titleName} Jobs | Relocation Options`;
      description = `Discover international ${titleName} roles offering full visa sponsorship, work permits, and relocation packages.`;
      primaryType = "JobPosting";
      break;
  }

  const fullTitle = `${title} | ${siteName}`;
  const canonicalUrl = `${siteConfig.url}${relativePath}`;

  const breadcrumbs: PseoBreadcrumb[] = [
    { name: "Home", url: siteConfig.url },
    { name: titleize(dimension), url: `${siteConfig.url}/${dimension}` },
    { name: titleName, url: canonicalUrl },
  ];

  const jsonLd = JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": primaryType,
      name: fullTitle,
      url: canonicalUrl,
      description,
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: b.url,
        })),
      },
    },
    null,
    2,
  );

  const relatedPages: RelatedLink[] = [
    { title: `Remote ${titleName} Jobs`, url: `${siteConfig.url}/remote-jobs/${slug}`, type: "remote" },
    { title: `${titleName} Salary Guide`, url: `${siteConfig.url}/salary/${slug}`, type: "salary" },
    { title: `${titleName} Interview Questions`, url: `${siteConfig.url}/prep/interview-questions/${slug}`, type: "prep" },
    { title: `Visa Sponsorship ${titleName} Roles`, url: `${siteConfig.url}/visa-sponsorship-jobs/${slug}`, type: "visa" },
  ];

  const internalLinks: RelatedLink[] = [
    { title: "Browse All Jobs", url: `${siteConfig.url}/jobs`, type: "jobs" },
    { title: "Top Verified Companies", url: `${siteConfig.url}/companies`, type: "companies" },
    { title: "Tech Salaries & Benchmarks", url: `${siteConfig.url}/salary/compare`, type: "salary" },
    { title: "Career Prep & Practice", url: `${siteConfig.url}/prep`, type: "prep" },
  ];

  return {
    dimension,
    slug,
    title: fullTitle,
    description,
    canonicalUrl,
    jsonLd,
    openGraph: {
      "og:title": fullTitle,
      "og:description": description,
      "og:url": canonicalUrl,
      "og:type": "website",
      "og:image": `${siteConfig.url}/opengraph-image`,
    },
    twitterCard: {
      "twitter:card": "summary_large_image",
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": `${siteConfig.url}/opengraph-image`,
      "twitter:creator": "@workorajobs",
    },
    breadcrumbs,
    relatedPages,
    internalLinks,
  };
}
