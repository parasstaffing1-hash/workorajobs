import Link from "next/link";

import { Container } from "@/components/layout/container";
import { getJobSlug, jobs, slugify } from "@/data/jobs";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "HTML Sitemap",
  description: "Browse WorkoraJobs pages, job search hubs, company pages, and public sitemap files.",
  path: "/sitemap",
});

const corePages = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Employers", href: "/employers" },
  { label: "Candidates", href: "/candidates" },
  { label: "Services", href: "/services" },
  { label: "Resources", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Resume Builder", href: "/resume-builder" },
  { label: "Interview Prep", href: "/prep" },
  { label: "Contact", href: "/contact" },
];

const jobHubs = [
  { label: "Remote Jobs", href: "/remote-jobs" },
  { label: "Freshers Jobs", href: "/freshers-jobs" },
  { label: "Internship Jobs", href: "/internship-jobs" },
  { label: "Industries", href: "/industries" },
  { label: "Boolean Search Tool", href: "/tools/boolean-search" },
];

const activeJobs = jobs.filter((job) => !job.isClosed).slice(0, 50);
const companies = Array.from(new Set(jobs.filter((job) => !job.isClosed).map((job) => job.company)))
  .sort((a, b) => a.localeCompare(b))
  .slice(0, 50);
const skills = Array.from(
  new Set(jobs.flatMap((job) => job.requiredSkills).map((skill) => skill.trim()).filter(Boolean))
)
  .sort((a, b) => a.localeCompare(b))
  .slice(0, 50);

export default function HtmlSitemapPage() {
  return (
    <main className="min-h-screen bg-background pt-28 pb-20">
      <Container className="space-y-10">
        <section className="max-w-3xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">WorkoraJobs sitemap</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Browse public pages</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Use this page to find key WorkoraJobs pages, live job discovery hubs, company pages, and search engine sitemap files.
          </p>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <SitemapSection title="Core pages" links={corePages} />
          <SitemapSection title="Job discovery hubs" links={jobHubs} />
          <SitemapSection
            title="Search engine sitemap files"
            links={[
              { label: "Sitemap index", href: "/sitemap.xml" },
              { label: "Public pages sitemap", href: "/sitemap-pages.xml" },
              { label: "Active jobs sitemap", href: "/sitemap-jobs-active.xml" },
              { label: "Companies sitemap", href: "/sitemap-companies.xml" },
              { label: "Skills sitemap", href: "/sitemap-skills.xml" },
              { label: "Images sitemap", href: "/sitemap-images.xml" },
            ]}
          />
          <SitemapSection
            title="Active jobs"
            emptyMessage="No active static job listings are bundled. Production job URLs are published in the active jobs XML sitemap from the database."
            links={activeJobs.map((job) => ({
              label: `${job.title} at ${job.company}`,
              href: `/jobs/${getJobSlug(job)}`,
            }))}
          />
          <SitemapSection
            title="Companies"
            emptyMessage="No active static company links are bundled. Production company pages are generated from active jobs."
            links={companies.map((company) => ({
              label: company,
              href: `/companies/${slugify(company)}`,
            }))}
          />
          <SitemapSection
            title="Skills"
            emptyMessage="No static skill links are bundled. Production skill hubs are generated from active job skills."
            links={skills.map((skill) => ({
              label: skill,
              href: `/skills/${slugify(skill)}`,
            }))}
          />
        </div>
      </Container>
    </main>
  );
}

function SitemapSection({
  title,
  links,
  emptyMessage = "No links available.",
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
  emptyMessage?: string;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-6">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      {links.length ? (
        <ul className="grid gap-2 text-sm">
          {links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link className="text-primary hover:underline" href={link.href}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}
