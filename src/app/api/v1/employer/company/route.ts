import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/lib/company/company-service";
import { getAuthUserId } from "@/lib/auth/get-auth-user";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const data = await CompanyService.getEmployerCompany(userId);
    return NextResponse.json({ success: true, ...data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch company profile" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request, "EMPLOYER");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = await CompanyService.updateCompanyProfile(userId, body);

    return NextResponse.json({
      success: true,
      message: "Company profile updated successfully!",
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to update company profile" },
      { status: 400 }
    );
  }
}
