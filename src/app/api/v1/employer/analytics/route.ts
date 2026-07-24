import { NextRequest, NextResponse } from "next/server";
import { EmployerAnalyticsService, TimeRange } from "@/lib/employer/employer-analytics-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const range = (searchParams.get("range") || "MONTHLY") as TimeRange;

    const data = await EmployerAnalyticsService.getEmployerAnalytics(userId, range);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch analytics" },
      { status: 400 }
    );
  }
}
