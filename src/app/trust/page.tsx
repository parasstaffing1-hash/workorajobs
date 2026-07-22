import { ShieldCheck, Lock, FileText, AlertTriangle, Building2, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { PageHero } from "@/components/marketing/page-hero";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Trust, Verification & Safety | WorkoraJobs",
  description:
    "Learn about WorkoraJobs job verification standards, employer vetting processes, scam protection, and data security practices.",
  path: "/trust",
});

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-background text-foreground pb-20">
      <PageHero
        eyebrow="Platform Trust & Safety"
        title="Verification, Trust Signals & Security Practices"
        description="Our commitment to cross-border job security, pre-vetted employers, candidate data protection, and scam reporting."
      />

      <Container className="py-12 space-y-12">
        {/* Verification Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Job Verification Process</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every job listed on WorkoraJobs undergoes automated domain verification and manual compliance auditing. We verify corporate registration, domain ownership, compensation ranges, and direct application paths before indexing listings publicly.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Employer Vetting Standards</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Employers must verify their corporate email domain, tax identification number, and legitimate hiring authority. Third-party recruiters are required to disclose client representation agreements.
            </p>
          </div>
        </section>

        {/* Scam Reporting & Data Security */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Scam Protection & Reporting</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              WorkoraJobs strictly prohibits application fees, check-cashing requests, or unverified wire transfers. Every job page includes a direct <strong>Report Job</strong> button that alerts our trust and safety team for immediate review.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-border/80 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Data Security Practices</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Candidate resume data and application credentials are encrypted in transit (TLS 1.3) and at rest (AES-256). We strictly adhere to SOC2 guidelines, GDPR data protection principles, and cross-border data privacy standards.
            </p>
          </div>
        </section>

        {/* Company & Legal Contact Links */}
        <section className="p-8 rounded-2xl bg-card border border-border/80 text-center space-y-6">
          <h2 className="text-2xl font-bold">Company Information & Legal Resources</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            WorkoraJobs is operated by Workora Technology Group. For official support, verification requests, or privacy inquiries, contact our team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-blue-500">
            <Link href="/privacy" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Contact Support
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
