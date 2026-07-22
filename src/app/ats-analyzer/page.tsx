import { ATSAnalyzerWorkspace } from "@/components/ats-analyzer/ats-analyzer-workspace";
import { PageHero } from "@/components/marketing/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "ATS Resume Checker & Score Analyzer | WorkoraJobs",
  description:
    "Upload your resume and job description to get instant ATS match scores, missing keyword analysis, and formatting audits.",
  path: "/ats-analyzer",
});

export default function ATSAnalyzerPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <PageHero
        eyebrow="ATS Resume Checker"
        title="Analyze Your Resume ATS Match Score"
        description="Compare your resume against any job description. Get real-time keyword coverage, formatting quality audits, and impact scores."
      />
      <ATSAnalyzerWorkspace />
    </main>
  );
}
