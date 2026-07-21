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

    // Build URL list for IndexNow automatic submission
    const urlsToSubmit: string[] = [
      "https://workorajobs.com/",
      "https://workorajobs.com/jobs",
      "https://workorajobs.com/blog",
      "https://workorajobs.com/about",
      "https://workorajobs.com/services",
      "https://workorajobs.com/prep",
      "https://workorajobs.com/resume-builder",
      "https://workorajobs.com/companies",
    ];

    activeJobs.forEach((job) => {
      const jobTitleSlug = slugify(job.title);
      const companySlug = slugify(job.company);
      const locationSlug = slugify(job.location);

      urlsToSubmit.push(`https://workorajobs.com/jobs/${jobTitleSlug}-in-${locationSlug}`);
      urlsToSubmit.push(`https://workorajobs.com/jobs/${jobTitleSlug}-jobs`);
      urlsToSubmit.push(`https://workorajobs.com/company/${companySlug}-jobs`);
    });

    const uniqueUrlsList = Array.from(new Set(urlsToSubmit));

    // Submit to IndexNow API (Bing/Yandex)
    let indexNowSubmittedCount = 0;
    let indexNowSuccess = false;

    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          host: "workorajobs.com",
          key: "16d8438fd62243ea8c7d0464673b88fe",
          keyLocation: "https://workorajobs.com/16d8438fd62243ea8c7d0464673b88fe.txt",
          urlList: uniqueUrlsList.slice(0, 1000), // Cap at 1000 URLs per submit batch
        }),
      });
      indexNowSuccess = res.ok;
      indexNowSubmittedCount = Math.min(uniqueUrlsList.length, 1000);
    } catch (e) {
      console.error("IndexNow API Submission Error: ", e);
    }

    return NextResponse.json({
      success: true,
      message: "Programmatic SEO index refreshed successfully.",
      timestamp: new Date().toISOString(),
      summary,
      indexNow: {
        success: indexNowSuccess,
        urlsSubmitted: indexNowSubmittedCount,
      },
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
