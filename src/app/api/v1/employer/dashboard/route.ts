import { NextRequest, NextResponse } from "next/server";
import { EmployerDashboardService } from "@/lib/employer/employer-dashboard-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await EmployerDashboardService.getEmployerDashboardMetrics(userId);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch dashboard metrics" },
      { status: 400 }
    );
  }
}
