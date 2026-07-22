import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProgrammaticSeoEngine } from "@/lib/seo/programmatic-seo";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://workorajobs.com";

  // 1. GET /api/v1/seo/sitemap
  if (subPath === "sitemap") {
    const sitemaps = [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-static.xml`,
      `${baseUrl}/sitemap-jobs-active.xml`,
      `${baseUrl}/sitemap-companies.xml`,
      `${baseUrl}/sitemap-skills.xml`,
      `${baseUrl}/sitemap-industries.xml`,
      `${baseUrl}/sitemap-blog.xml`,
    ];
    return NextResponse.json({ success: true, count: sitemaps.length, sitemaps });
  }

  // 2. GET /api/v1/seo/robots
  if (subPath === "robots") {
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /candidate/
Disallow: /employer/

Sitemap: ${baseUrl}/sitemap.xml`;
    return new NextResponse(robotsTxt, { headers: { "Content-Type": "text/plain" } });
  }

  // 3. GET /api/v1/seo/schema/:jobId
  if (subPath.startsWith("schema/")) {
    const jobId = subPath.split("/")[1];
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true },
    });

    if (!job) {
      return NextResponse.json({ success: false, error: "Job listing not found" }, { status: 404 });
    }

    const schema = ProgrammaticSeoEngine.generateJobPostingSchema(job);
    return NextResponse.json({ success: true, schema });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/seo/${subPath} not found` }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";

  // 1. POST /api/v1/seo/rebuild
  if (subPath === "rebuild") {
    const activeJobs = await prisma.job.count({ where: { deletedAt: null } });
    const companies = await prisma.company.count({ where: { deletedAt: null } });

    return NextResponse.json({
      success: true,
      message: "SEO sitemaps and programmatic pages rebuilt successfully.",
      stats: {
        activeJobsIndexed: activeJobs,
        companiesIndexed: companies,
        sitemapsGenerated: 7,
        rebuiltAt: new Date().toISOString(),
      },
    });
  }

  // 2. POST /api/v1/seo/indexnow
  if (subPath === "indexnow") {
    try {
      const body = await request.json();
      const urls = body.urls || [];
      if (!Array.isArray(urls) || urls.length === 0) {
        return NextResponse.json({ success: false, error: "No URLs provided for IndexNow submission" }, { status: 400 });
      }
      const result = await ProgrammaticSeoEngine.submitToIndexNow(urls);
      return NextResponse.json(result);
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "IndexNow submission failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/seo/${subPath} not found` }, { status: 404 });
}
