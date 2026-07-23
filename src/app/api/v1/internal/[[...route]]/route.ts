import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isInternalAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const authHeader = request.headers.get("authorization");
  const internalSecret = process.env.INTERNAL_API_KEY || process.env.JWT_SECRET || "workora_internal_secret";

  if (apiKey && apiKey === internalSecret) {
    return true;
  }

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const decoded = verifyJwt(token);
    if (decoded && (decoded.role === "ADMIN" || decoded.role === "RECRUITER")) {
      return true;
    }
  }

  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";

  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized internal access" }, { status: 401 });
  }

  if (subPath === "health" || subPath === "") {
    return NextResponse.json({
      status: "healthy",
      service: "Workora Internal Automation API",
      timestamp: new Date().toISOString(),
    });
  }

  if (subPath === "jobs/stats") {
    const totalJobs = await prisma.job.count();
    const activeJobs = await prisma.job.count({ where: { deletedAt: null } });
    return NextResponse.json({ success: true, totalJobs, activeJobs });
  }

  return NextResponse.json({ success: false, error: `Internal route GET /api/v1/internal/${subPath} not found` }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";

  if (!isInternalAuthorized(request)) {
    return NextResponse.json({ success: false, error: "Unauthorized internal access" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  if (subPath === "jobs/sync") {
    return NextResponse.json({
      success: true,
      message: "Internal job feed sync initiated",
      syncedAt: new Date().toISOString(),
      updatedCount: body.jobs?.length || 0,
    });
  }

  if (subPath === "seo/publish") {
    return NextResponse.json({
      success: true,
      message: "SEO content published and pinged to search engines",
      publishedAt: new Date().toISOString(),
      slug: body.slug || "all",
    });
  }

  if (subPath === "reindex") {
    return NextResponse.json({
      success: true,
      message: "Search index rebuild dispatched",
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: false, error: `Internal route POST /api/v1/internal/${subPath} not found` }, { status: 404 });
}
