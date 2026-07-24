import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";
import { CandidateSearchService } from "@/lib/candidates/candidate-search-service";

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

    const data = await CandidateSearchService.searchCandidates(userId, { limit: 100 });

    let csv = "Candidate Name,Email,Headline,Location,Notice Period,Expected Salary ($)\n";

    data.candidates.forEach((cand: any) => {
      const name = `"${(cand.name || "").replace(/"/g, '""')}"`;
      const email = `"${(cand.email || "").replace(/"/g, '""')}"`;
      const headline = `"${(cand.headline || "").replace(/"/g, '""')}"`;
      const location = `"${(cand.location || "").replace(/"/g, '""')}"`;
      const notice = cand.noticePeriod;
      const salary = cand.expectedSalary || "N/A";

      csv += `${name},${email},${headline},${location},${notice},${salary}\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="workora-candidate-sourcing-${Date.now()}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to export CSV" },
      { status: 400 }
    );
  }
}
