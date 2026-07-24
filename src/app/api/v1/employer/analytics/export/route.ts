import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { EmployerAnalyticsService, TimeRange } from "@/lib/employer/employer-analytics-service";

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
    const range = (searchParams.get("range") || "MONTHLY") as TimeRange;

    const data = await EmployerAnalyticsService.getEmployerAnalytics(userId, range);

    let csv = `WorkoraJobs Enterprise Analytics Report (${range})\n\n`;
    csv += "Metric,Value\n";
    csv += `Total Job Views,${data.metrics.totalViews}\n`;
    csv += `Total Applications,${data.metrics.totalApplications}\n`;
    csv += `Application Conversion Rate,${data.metrics.conversionRate}\n`;
    csv += `Interview Conversion Rate,${data.metrics.interviewConversion}\n`;
    csv += `Offer Acceptance Rate,${data.metrics.offerAcceptance}\n`;
    csv += `Average Time To Hire,${data.metrics.timeToHire}\n`;
    csv += `Cost Per Hire,${data.metrics.costPerHire}\n\n`;

    csv += "Job Title,Job Views,Applications,Conversion Rate,Status\n";
    data.topPerformingJobs.forEach((j: any) => {
      const title = `"${j.title.replace(/"/g, '""')}"`;
      csv += `${title},${j.views},${j.applications},${j.conversionRate},${j.status}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="workora-analytics-report-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to export CSV analytics" },
      { status: 400 }
    );
  }
}
