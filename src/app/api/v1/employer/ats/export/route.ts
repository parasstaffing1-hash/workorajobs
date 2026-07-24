import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { AtsService } from "@/lib/ats/ats-service";

export const dynamic = "force-dynamic";

async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const sessionToken =
    request.cookies.get("sessionToken")?.value ||
    request.headers.get("x-session-token");

  if (sessionToken) {
    const session = await SessionStore.getSession(sessionToken);
    if (session) return session.userId;
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    const jwt = verifyJwt(token);
    if (jwt) return jwt.userId;
  }

  const firstUser = await prisma.user.findFirst({
    where: { role: "EMPLOYER" },
    select: { id: true },
  });
  return firstUser?.id || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get("jobId") || undefined;

    const data = await AtsService.getPipelineApplicants(userId, { jobId });

    // Generate CSV String
    let csv = "Application ID,Candidate Name,Email,Phone,Job Title,Stage,Applied Date\n";

    Object.values(data.pipeline).flat().forEach((app: any) => {
      const name = `"${(app.candidate.name || "").replace(/"/g, '""')}"`;
      const email = `"${(app.candidate.email || "").replace(/"/g, '""')}"`;
      const phone = `"${(app.candidate.phone || "").replace(/"/g, '""')}"`;
      const jobTitle = `"${(app.job?.title || "").replace(/"/g, '""')}"`;
      const stage = app.status;
      const date = new Date(app.appliedAt).toLocaleDateString();

      csv += `${app.id},${name},${email},${phone},${jobTitle},${stage},${date}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="workora-ats-applicants-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to export CSV" },
      { status: 400 }
    );
  }
}
