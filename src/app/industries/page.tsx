import { Metadata } from "next";
import Link from "next/link";
import { 
  Code2, 
  CircleDollarSign, 
  HeartPulse, 
  Building2, 
  HardHat, 
  Network, 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  MapPin, 
  Sparkles,
  Search
} from "lucide-react";

import { industriesData } from "@/data/industries";
import { companiesData } from "@/data/companies";
import { jobs } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHero } from "@/components/marketing/page-hero";
import { Section } from "@/components/layout/section";
import { CtaBand } from "@/components/marketing/cta-band";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Browse Jobs & Enterprise Employers by Industry | WorkoraJobs",
  description:
    "Explore top hiring industries including Information Technology, Banking & Finance, Healthcare, FMCG, Automotive, and Telecommunications on WorkoraJobs.",
  path: "/industries",
});

const iconMap: Record<string, any> = {
  Code2,
  CircleDollarSign,
  HeartPulse,
  Building2,
  HardHat,
  Network,
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        description="Discover career opportunities, technical skill requirements, and top enterprise market leaders across major global industries."
        eyebrow="Industry Sectors"
        title="Explore Jobs & Employers by Industry"
      >
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a href="#directory">
            <Button size="lg" variant="accent">
              Explore All Sectors
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </a>
          <Link href="/companies">
            <Button size="lg" variant="outline">
              Company Directory
            </Button>
          </Link>
        </div>
      </PageHero>

      <Section
        id="directory"
        eyebrow="Industry Directory"
        title="High-Growth Target Sectors"
        description="Select an industry to explore active job openings, tech stacks, Glassdoor ratings, and leading employer profiles."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industriesData.map((ind) => {
            const IconComponent = iconMap[ind.iconName] || Building2;
            
            // Calculate actual company & job counts for this industry
            const matchingCompanies = companiesData.filter(
              (c) => c.industry.toLowerCase().includes(ind.name.toLowerCase()) || ind.name.toLowerCase().includes(c.industry.toLowerCase())
            );

            return (
              <Card
                key={ind.id}
                className="group relative flex flex-col justify-between overflow-hidden border-border/70 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-4">
                  {/* Category & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl border border-primary/30 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <Badge className="bg-secondary text-primary font-semibold text-[11px]">
                      {ind.growthRate}
                    </Badge>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <Link href={`/industries/${ind.slug}`} className="hover:underline">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {ind.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {ind.shortDescription}
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-border/60 bg-secondary/20 p-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Active Employers</span>
                      <span className="font-bold text-foreground">{matchingCompanies.length || ind.topCompanies.length} Giants</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">Open Vacancies</span>
                      <span className="font-bold text-primary">{ind.openJobsCount}+ Roles</span>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block">In-Demand Tech Stack</span>
                    <div className="flex flex-wrap gap-1.5">
                      {ind.keySkills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-foreground"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action Link */}
                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Salary: <strong className="text-foreground">{ind.averageSalaryRange.split(' ')[0]}</strong>
                  </span>
                  <Link href={`/industries/${ind.slug}`}>
                    <Button variant="ghost" size="sm" className="text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                      Explore Sector →
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
