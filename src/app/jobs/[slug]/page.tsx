import { Metadata } from "next";
import { notFound } from "next/navigation";

import { JobDetail } from "@/components/jobs/job-detail";
import { ProgrammaticSeo } from "@/components/seo/programmatic-seo";
import { findJobBySlug, getJobSlug } from "@/data/jobs";
import { parseProgrammaticSeo } from "@/lib/programmatic-seo-data";

export const revalidate = 3600; // ISR revalidate every hour

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Check if slug matches an individual job
  const job = findJobBySlug(slug);
  if (job) {
    const jobSlug = getJobSlug(job);
    const title = `${job.title} at ${job.company} – ${job.location} | WorkoraJobs`;
    const description = `Apply for the ${job.title} position at ${job.company} in ${job.location}. Check salary range (${job.salary}), required skills, work mode, and application pipeline.`;
    const canonicalUrl = `https://workorajobs.com/jobs/${jobSlug}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: job.isClosed ? "noindex, follow" : "index, follow",
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  // 2. Programmatic category/location SEO page
  const data = parseProgrammaticSeo("jobs", slug);

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: data.canonicalUrl,
    },
    robots: data.noindex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default async function JobSeoPage({ params }: Props) {
  const { slug } = await params;
  
  // 1. Check if slug matches an individual job
  const job = findJobBySlug(slug);
  if (job) {
    return <JobDetail job={job} />;
  }

  // 2. Fall back to Programmatic SEO view
  const data = parseProgrammaticSeo("jobs", slug);

  return (
    <main className="min-h-screen py-6 bg-background">
      <ProgrammaticSeo {...data} />
    </main>
  );
}
