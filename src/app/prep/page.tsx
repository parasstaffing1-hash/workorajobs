import { BrainCircuit } from "lucide-react";

import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { createMetadata, siteConfig } from "@/lib/site";

export const metadata = createMetadata({
  title: "AI Interview Prep & Career Guidance Tools",
  description:
    "Practice technical interview questions, system design mocks, and behavioral prep.",
  path: "/prep",
});;

export default function HackerPrepPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          applicationCategory: "EducationalApplication",
          description:
            "Gamified AI Practice & Sourcing workspace to simulate tech screening tests, system design architecture, and behavioral STAR interviews.",
          name: "Workora Jobs HackerPrep AI Assessment Practice Platform",
          operatingSystem: "Web",
          url: `${siteConfig.url}/prep`,
        }}
      />
      <PageHero
        description="A premium split-screen practice terminal for technical assessments, system design scalability tracks, and case study evaluations."
        eyebrow="HackerPrep Workspace"
        title="Elevate Sourcing Readiness with Real-Time Assessments."
      >
        <div className="flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs text-violet-500 font-semibold font-mono">
          <BrainCircuit className="h-4 w-4" /> Gamified Grading & Sourcing Terminal Active
        </div>
      </PageHero>

      <Section
        id="hackerprep"
        eyebrow="Interactive Workspace"
        title="Practice Challenges & Grading"
        description="Select a track, load custom criteria focus, complete challenges, and compile output logs instantly."
      >
        <div className="rounded-2xl border border-dashed border-border/70 bg-secondary/30 p-12 text-center">
          <BrainCircuit className="mx-auto h-10 w-10 text-violet-500/60" />
          <h3 className="mt-4 text-lg font-semibold">HackerPrep — Coming Soon</h3>
          <p className="mt-2 text-sm text-muted-foreground">The practice workspace is being rebuilt with an upgraded engine. Check back shortly.</p>
        </div>
      </Section>
    </>
  );
}
