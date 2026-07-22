import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getAuthUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  return verifyJwt(token);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  // 1. POST /api/v1/import/jobs (Batch JSON job import)
  if (subPath === "jobs" || subPath === "") {
    try {
      const body = await request.json();
      const jobsList = Array.isArray(body) ? body : body.jobs || [body];

      let company = await prisma.company.findFirst({
        where: { ownerId: authUser.userId, deletedAt: null },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: "Imported Workspace",
            ownerId: authUser.userId,
          },
        });
      }

      let importedCount = 0;

      for (const item of jobsList) {
        if (!item.title) continue;

        await prisma.job.create({
          data: {
            title: item.title,
            description: item.description || item.title,
            location: item.location || "Remote",
            salary: typeof item.salary === "number" ? item.salary : 110000,
            type: item.type || "FULL_TIME",
            workMode: item.workMode || "Remote",
            experience: item.experience || "Mid Level",
            companyId: company.id,
            postedById: authUser.userId,
          },
        });
        importedCount++;
      }

      return NextResponse.json({
        success: true,
        message: `Successfully imported ${importedCount} job listings.`,
        importedCount,
      });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e?.message || "Import failed" }, { status: 400 });
    }
  }

  return NextResponse.json({ success: false, error: `Route POST /api/v1/import/${subPath} not found` }, { status: 404 });
}
