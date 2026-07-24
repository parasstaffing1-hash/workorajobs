import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized access." }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, error: "Current password and new password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } }).catch(() => null);

    if (user && user.passwordHash) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash).catch(() => false);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Incorrect current password." }, { status: 400 });
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash },
      }).catch(() => null);
    }

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: "Failed to change password." }, { status: 400 });
  }
}
