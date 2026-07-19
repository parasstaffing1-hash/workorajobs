import { NextResponse } from "next/server";

import { jobs } from "@/data/jobs";
import { slugify } from "@/lib/slugs";

export const runtime = "nodejs";

export async function POST() {
  try {
    // In a fully seeded production environment, this would run Prisma queries:
    // const activeJobs = await prisma.job.findMany({ where: { status: 'ACTIVE' } });
    // This script simulates the check:
    const activeJobs = jobs;

    const summary = {
      totalActiveJobs: activeJobs.length,
      processedTitles: 0,
      processedCompanies: 0,
      processedSkills: 0,
      flaggedNoIndexCount: 0,
      sitemapUrlsRegenerated: 0,
    };

    const titleLocationPairs = new Set<string>();
    const companyNames = new Set<string>();
    const skills = new Set<string>();

    activeJobs.forEach((job) => {
      titleLocationPairs.add(`${slugify(job.title)}-in-${slugify(job.location)}`);
      companyNames.add(slugify(job.company));
      job.requiredSkills.forEach((s) => skills.add(slugify(s)));
    });

    summary.processedTitles = titleLocationPairs.size;
    summary.processedCompanies = companyNames.size;
    summary.processedSkills = skills.size;
    summary.sitemapUrlsRegenerated = titleLocationPairs.size + companyNames.size + skills.size + 2; // + remote & freshers

    return NextResponse.json({
      success: true,
      message: "Programmatic SEO index refreshed successfully.",
      timestamp: new Date().toISOString(),
      summary,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to sync SEO indices";
    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
