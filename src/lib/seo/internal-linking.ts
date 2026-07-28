import { siteConfig } from "@/lib/site";

export interface InternalLinkNode {
  anchorText: string;
  url: string;
  targetType: string;
  category: string;
}

export interface EntityLinkGraph {
  entityType: string;
  entityId: string;
  canonicalUrl: string;
  crawlDepth: number;
  outboundLinks: InternalLinkNode[];
  inboundLinks: InternalLinkNode[];
  similarEntities?: InternalLinkNode[];
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/ /g, "-").replace(/\//g, "-");
}

function titleize(text: string): string {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Next.js SSR Helper resolving entity link graph across 13 connections
 */
export function getEntityLinkGraph(entityType: string, entityId: string): EntityLinkGraph {
  const cleanId = entityId.toLowerCase().trim();
  const titleName = titleize(cleanId);

  const outboundLinks: InternalLinkNode[] = [];
  const inboundLinks: InternalLinkNode[] = [];
  const similarEntities: InternalLinkNode[] = [];

  switch (entityType) {
    case "job":
      // Job -> Company, City, Salary, Skill
      outboundLinks.push(
        { anchorText: `${titleName} Careers`, url: `${siteConfig.url}/companies/${cleanId}`, targetType: "company", category: "Job -> Company" },
        { anchorText: `Tech Jobs in ${titleName}`, url: `${siteConfig.url}/jobs/location/${cleanId}`, targetType: "city", category: "Job -> City" },
        { anchorText: `${titleName} Salary Guide`, url: `${siteConfig.url}/salary/${cleanId}`, targetType: "salary", category: "Job -> Salary" },
        { anchorText: "Golang Developer Jobs", url: `${siteConfig.url}/skills/golang`, targetType: "skill", category: "Job -> Skill" },
      );
      similarEntities.push(
        { anchorText: "Lead Backend Developer", url: `${siteConfig.url}/jobs/lead-backend-developer`, targetType: "job", category: "Job -> Similar Job" },
        { anchorText: "Principal Systems Engineer", url: `${siteConfig.url}/jobs/principal-systems-engineer`, targetType: "job", category: "Job -> Similar Job" },
      );
      break;

    case "company":
      // Company -> Jobs, Industry
      outboundLinks.push(
        { anchorText: `View Open Jobs at ${titleName}`, url: `${siteConfig.url}/jobs?company=${encodeURIComponent(titleName)}`, targetType: "jobs", category: "Company -> Jobs" },
        { anchorText: "Software Engineering Industry Jobs", url: `${siteConfig.url}/industries/software-engineering`, targetType: "industry", category: "Company -> Industry" },
      );
      break;

    case "skill":
      // Skill -> Jobs, Salary
      outboundLinks.push(
        { anchorText: `Explore All ${titleName} Developer Roles`, url: `${siteConfig.url}/jobs?q=${encodeURIComponent(titleName)}`, targetType: "jobs", category: "Skill -> Jobs" },
        { anchorText: `${titleName} Salary & Compensation Report`, url: `${siteConfig.url}/salary/${slugify(cleanId)}`, targetType: "salary", category: "Skill -> Salary" },
      );
      break;

    case "city":
      // City -> Companies, Jobs
      outboundLinks.push(
        { anchorText: `Top Companies Hiring in ${titleName}`, url: `${siteConfig.url}/companies?location=${encodeURIComponent(titleName)}`, targetType: "companies", category: "City -> Companies" },
        { anchorText: `All Jobs in ${titleName}`, url: `${siteConfig.url}/jobs/location/${slugify(cleanId)}`, targetType: "jobs", category: "City -> Jobs" },
      );
      break;

    case "industry":
      // Industry -> Companies, Jobs
      outboundLinks.push(
        { anchorText: `${titleName} Industry Companies`, url: `${siteConfig.url}/companies?industry=${slugify(cleanId)}`, targetType: "companies", category: "Industry -> Companies" },
        { anchorText: `${titleName} Industry Jobs`, url: `${siteConfig.url}/jobs?department=${slugify(cleanId)}`, targetType: "jobs", category: "Industry -> Jobs" },
      );
      break;
  }

  inboundLinks.push(
    { anchorText: "Back to Home", url: siteConfig.url, targetType: "home", category: "Home -> Entity" },
  );

  return {
    entityType,
    entityId: cleanId,
    canonicalUrl: `${siteConfig.url}/${entityType}s/${cleanId}`,
    crawlDepth: 2,
    outboundLinks,
    inboundLinks,
    similarEntities,
  };
}
