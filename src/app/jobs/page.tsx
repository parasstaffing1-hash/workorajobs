import dynamic from "next/dynamic";

import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { Skeleton } from "@/components/ui/skeleton";
import { createMetadata } from "@/lib/site";

const JobBoard = dynamic(
  () => import("@/components/jobs/job-board").then((mod) => mod.JobBoard),
  {
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    ),
  },
);

export const metadata = createMetadata({
  title: "Global Tech Jobs & Remote Opportunities | WorkoraJobs",
  description:
    "Explore active global tech jobs, remote engineering roles, check salary insights, and apply to top technology employers on WorkoraJobs.",
  path: "/jobs",
});

export default function JobsPage() {
  return (
    <>
      <PageHero
        description="Search curated global opportunities with clear role context, location signal and compensation expectations."
        eyebrow="Jobs"
        title="Global Tech Jobs & Remote Opportunities"
      />
      <Container className="py-16">
        <JobBoard />
      </Container>
    </>
  );
}
