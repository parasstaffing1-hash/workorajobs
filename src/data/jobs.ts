export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Remote" | "Internship";
  workMode: "Remote" | "Hybrid" | "On-site";
  department: string;
  salary: string;
  posted: string;
  datePostedIso?: string;
  validThroughIso?: string;
  isClosed?: boolean;
  tags: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  education: string;
  description: string;
  responsibilities: string[];
  keywords: string[];
  isFeaturedInternship?: boolean;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getJobSlug(job: { id: string; title: string; company: string }): string {
  const titleSlug = slugify(job.title);
  const companySlug = slugify(job.company);
  const idClean = slugify(job.id);
  return `${titleSlug}-${companySlug}-${idClean}`;
}

export function findJobBySlug(slug: string): Job | undefined {
  const clean = slug.toLowerCase().trim();
  const directMatch = jobs.find((j) => getJobSlug(j) === clean);
  if (directMatch) return directMatch;

  const parts = clean.split("-");
  const lastPart = parts[parts.length - 1];

  return jobs.find((j) => {
    const jId = j.id.toLowerCase();
    return jId === lastPart || jId.endsWith(lastPart);
  });
}

export const jobs: Job[] = [];

export const featuredInternships: Job[] = [];

export const jobDepartments = [
  "All",
  "Engineering",
  "Design",
  "Data",
  "Operations",
  "Customer",
  "People",
];
