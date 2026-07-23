import { createMetadata } from "@/lib/site";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { JobDiscoveryHero } from "@/components/hero/job-discovery-hero";
import { HeroBackground } from "@/components/hero/hero-background";

import { HeroBadge } from "@/components/hero/hero-badge";
import { AnimatedHeroHeadline } from "@/components/hero/animated-hero-headline";
import { AnimatedSearchBar } from "@/components/hero/animated-search-bar";
import { HeroCTA } from "@/components/hero/hero-cta";
import { LiveHiringMetrics } from "@/components/hero/live-hiring-metrics";
import { HeroMockupSection } from "@/components/hero/hero-mockup-section";
import { AiToolsSection } from "@/components/home/ai-tools-section";
import { PremiumTrustSection } from "@/components/home/premium-trust-section";
import { ConversionCTA } from "@/components/home/conversion-cta";
import { SuccessStories } from "@/components/home/success-stories";
import { BenefitsComparison } from "@/components/home/benefits-comparison";
import { FaqSection } from "@/components/home/faq-section";
import { StickyCTA } from "@/components/home/sticky-cta";

export const metadata = createMetadata({
  title: "AI Recruitment & Global Tech Staffing Platform | WorkoraJobs",
  description:
    "WorkoraJobs is a global technology staffing and AI recruitment platform that helps employers hire verified tech talent and candidates find remote and international jobs.",
  path: "/",
});

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://workorajobs.com/#organization",
        "name": "WorkoraJobs",
        "url": "https://workorajobs.com",
        "logo": "https://workorajobs.com/workora-jobs-logo-scraped.png",
        "sameAs": [
          "https://www.linkedin.com/company/workorajobs",
          "https://twitter.com/workorajobs"
        ],
        "description": "Global technology staffing and AI recruitment platform connecting verified tech professionals with remote and international career opportunities."
      },
      {
        "@type": "WebSite",
        "@id": "https://workorajobs.com/#website",
        "url": "https://workorajobs.com",
        "name": "WorkoraJobs",
        "publisher": {
          "@id": "https://workorajobs.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://workorajobs.com/jobs?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Sticky Conversion Bar */}
      <StickyCTA />

      {/* Career-Focused Job Discovery Hero */}
      <header className="relative pt-20 overflow-hidden">
        <JobDiscoveryHero
          headline="Find the right job. Build your future."
          description="Search verified opportunities from leading companies and discover roles that match your skills, location, and career goals."
          showJobCards={true}
          showSkillChips={true}
          showCareerPath={true}
          enableMotion={true}
        />
      </header>


      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* AI Tools Section */}
      <AiToolsSection />

      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* Stripe-Grade Premium Trust Section */}
      <PremiumTrustSection />

      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* Verified Success Stories Case Studies */}
      <SuccessStories />

      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* Recruiter & Candidate High-Impact Conversion CTA */}
      <ConversionCTA />

      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* Benefits Comparison Table */}
      <BenefitsComparison />

      {/* Glowing Section Divider */}
      <div className="section-divider-glowing" />

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* Platform Surfaces (Bento Style) */}
      <section className="py-24 bg-secondary/30 border-y border-border/50">
        <Container>
          <Reveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold mb-2">Platform Surfaces</h2>
              <p className="text-muted-foreground">A unified ecosystem for recruiters, admins, and candidates.</p>
            </div>
            <button className="flex items-center gap-2 text-primary font-semibold hover:translate-x-1 transition-transform">
              Explore Ecosystem <ArrowRight className="w-4 h-4" />
            </button>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature Card */}
            <Reveal delay={0.1} className="md:col-span-8 group bg-card border border-border/70 rounded-[20px] overflow-hidden shadow-sm flex flex-col md:flex-row">
              <div className="p-12 flex-1 flex flex-col justify-center">
                <span className="text-primary font-bold uppercase tracking-widest text-[10px] mb-4 block">Internal Systems</span>
                <h3 className="text-2xl font-semibold mb-3">Recruiter Workbench</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-md">
                  A high-density command center for talent acquisition teams. Manage pipelines, parse resumes with AI, and automate outreach.
                </p>
                <ButtonLink href="/recruiter" variant="secondary" className="w-fit">
                  View Portal
                </ButtonLink>
              </div>
              <div className="flex-1 bg-secondary/50 p-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="w-[120%] h-[120%] rounded-xl shadow-2xl bg-background border border-border/70 translate-x-[10%] translate-y-[10%] group-hover:translate-x-[5%] group-hover:translate-y-[5%] transition-transform duration-500 overflow-hidden flex flex-col">
                  {/* Dashboard Mockup Topbar */}
                  <div className="h-10 border-b border-border/70 flex items-center px-4 gap-4 bg-secondary/30">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-border"></div>
                    </div>
                  </div>
                  {/* Dashboard Mockup Body */}
                  <div className="flex-1 p-4 flex gap-4">
                    <div className="w-16 h-full rounded bg-secondary/50"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-8 w-1/3 rounded bg-secondary"></div>
                      <div className="h-32 w-full rounded bg-secondary/30 border border-border/50"></div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Small Feature Card 1 */}
            <Reveal delay={0.2} className="md:col-span-4 bg-card border border-border/70 rounded-[20px] shadow-sm p-8 flex flex-col">
              <span className="text-accent font-bold uppercase tracking-widest text-[10px] mb-4 block">Admin CRM</span>
              <h3 className="text-xl font-semibold mb-3">Client Management</h3>
              <p className="text-muted-foreground text-sm mb-6 flex-1">
                Track employer relationships, contract statuses, and billing in one secure portal.
              </p>
              <div className="h-32 rounded-xl bg-secondary/50 border border-border/50 mt-auto flex items-end justify-center p-4">
                <div className="w-full flex gap-2 items-end h-full">
                  <div className="flex-1 bg-accent/20 rounded-t-sm h-[40%]"></div>
                  <div className="flex-1 bg-accent/40 rounded-t-sm h-[70%]"></div>
                  <div className="flex-1 bg-accent/60 rounded-t-sm h-[50%]"></div>
                  <div className="flex-1 bg-accent rounded-t-sm h-[90%]"></div>
                </div>
              </div>
            </Reveal>

            {/* Small Feature Card 2 */}
            <Reveal delay={0.3} className="md:col-span-6 bg-card border border-border/70 rounded-[20px] shadow-sm p-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <span className="text-foreground font-bold uppercase tracking-widest text-[10px] mb-4 block">Candidate Experience</span>
                <h3 className="text-xl font-semibold mb-3">CV Builder</h3>
                <p className="text-muted-foreground text-sm">
                  Deterministic resume generation ensuring ATS compliance and premium formatting.
                </p>
              </div>
              <div className="flex-1 bg-secondary/50 rounded-xl border border-border/50 p-4">
                <div className="space-y-2">
                  <div className="h-2 w-1/2 bg-border/70 rounded"></div>
                  <div className="h-2 w-3/4 bg-border/40 rounded"></div>
                  <div className="h-2 w-2/3 bg-border/40 rounded"></div>
                  <div className="h-2 w-full bg-border/40 rounded mt-4"></div>
                </div>
              </div>
            </Reveal>

            {/* Small Feature Card 3 */}
            <Reveal delay={0.4} className="md:col-span-6 bg-primary text-primary-foreground rounded-[20px] shadow-sm p-8 flex flex-col relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <span className="text-primary-foreground/70 font-bold uppercase tracking-widest text-[10px] mb-4 block">Employer Branding</span>
                <h3 className="text-xl font-semibold mb-3">Company Profiles</h3>
                <p className="text-primary-foreground/80 text-sm mb-6">
                  Showcase culture, tech stacks, and open roles on beautifully rendered deterministic pages.
                </p>
                <button className="bg-white text-primary px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
                  Create Profile
                </button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Technological Precision */}
      <section className="py-24">
        <Container>
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <Reveal>
              <h2 className="text-3xl font-semibold mb-4">Technological Precision</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Every component is generated using deterministic logic, rule engines, and strict data validation. Zero hallucinations. Pure structured output.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-bold text-sm">01</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Rule-Based Generation</h4>
                    <p className="text-sm text-muted-foreground">Dictionaries and user selections drive the output. No unpredictable AI generation.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <span className="font-bold text-sm">02</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Enterprise Validation</h4>
                    <p className="text-sm text-muted-foreground">Rigorous validation ensuring 100% production readiness and security compliance.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={0.2} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-3xl transform rotate-3 scale-105 blur-xl"></div>
              <div className="bg-card border border-border/70 rounded-2xl p-6 shadow-xl relative z-10">
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
                  <span className="font-mono text-sm text-muted-foreground">system_rules.json</span>
                  <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  </div>
                </div>
                <pre className="text-xs font-mono text-muted-foreground overflow-x-auto">
{`{
  "deterministic_engine": {
    "enabled": true,
    "validation_level": "strict",
    "allow_hallucinations": false
  },
  "modules": [
    "cv_builder",
    "boolean_search",
    "ats_scorer"
  ]
}`}
                </pre>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteConfig.url}/jobs?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
