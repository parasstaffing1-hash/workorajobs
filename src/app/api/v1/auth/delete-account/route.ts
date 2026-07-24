import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { prisma } from "@/lib/prisma";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const sessionToken = request.cookies.get("sessionToken")?.value;
    if (sessionToken) {
      await SessionStore.revokeSession(sessionToken).catch(() => null);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    }).catch(() => null);

    const response = NextResponse.json({
      success: true,
      message: "Account has been successfully scheduled for deletion.",
    });

    response.cookies.set("sessionToken", "", { maxAge: 0, path: "/" });
    response.cookies.set("userRole", "", { maxAge: 0, path: "/" });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to delete account." }, { status: 400 });
  }
}
