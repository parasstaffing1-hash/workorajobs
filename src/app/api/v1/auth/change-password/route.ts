import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { getAuthUserId } from "@/lib/auth/get-auth-user";
import { PasswordSchema } from "@/lib/auth/validation-schemas";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPasswordState(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      passwordHash: true,
      oauthAccounts: { select: { provider: true } },
      auditLogs: {
        where: {
          action: {
            in: [
              "USER_REGISTERED:JOB_SEEKER",
              "USER_REGISTERED:EMPLOYER",
              "USER_REGISTERED:RECRUITER",
              "EMPLOYER_REGISTERED",
              "USER_PASSWORD_SET",
              "USER_PASSWORD_CHANGED",
            ],
          },
        },
        select: { action: true },
        take: 1,
      },
      loginHistory: {
        where: { status: "SUCCESS" },
        select: { id: true },
        take: 1,
      },
    },
  });

  if (!user) return null;

  // Legacy OAuth accounts were assigned an unknowable random bcrypt hash.
  // Treat it as non-user-set only when there is no evidence that a local
  // password was registered, set, changed, or successfully used.
  const legacyOAuthOnly =
    user.oauthAccounts.length > 0 &&
    user.auditLogs.length === 0 &&
    user.loginHistory.length === 0;
  const hasPassword = Boolean(user.passwordHash) && !legacyOAuthOnly;

  return {
    ...user,
    hasPassword,
    providers: user.oauthAccounts.map((account) => account.provider),
  };
}

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId(request);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Sign in to manage your password." },
      { status: 401 }
    );
  }

  const state = await getPasswordState(userId).catch(() => null);
  if (!state) {
    return NextResponse.json(
      { success: false, error: "Account could not be loaded." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    hasPassword: state.hasPassword,
    providers: state.providers,
    role: state.role,
  });
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthUserId(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Sign in to manage your password." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const validation = PasswordSchema.safeParse(body.newPassword);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.issues[0]?.message || "Choose a stronger password." },
        { status: 400 }
      );
    }

    const state = await getPasswordState(userId);
    if (!state) {
      return NextResponse.json(
        { success: false, error: "Account could not be loaded." },
        { status: 404 }
      );
    }

    if (state.hasPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required." },
          { status: 400 }
        );
      }
      const matches = await bcrypt.compare(currentPassword, state.passwordHash as string);
      if (!matches) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect." },
          { status: 400 }
        );
      }
    } else if (state.oauthAccounts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Use the password reset flow to recover this account." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(validation.data, 12);
    await prisma.$transaction([
      prisma.user.update({ where: { id: userId }, data: { passwordHash } }),
      prisma.auditLog.create({
        data: {
          userId,
          action: state.hasPassword ? "USER_PASSWORD_CHANGED" : "USER_PASSWORD_SET",
          ipAddress: request.headers.get("x-forwarded-for") || undefined,
          userAgent: request.headers.get("user-agent") || undefined,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: state.hasPassword
        ? "Password changed successfully."
        : "Password created successfully. You can now sign in with email and password.",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to update password." },
      { status: 500 }
    );
  }
}
