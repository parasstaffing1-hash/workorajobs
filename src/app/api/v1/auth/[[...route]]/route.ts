import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/jwt";
import { AuthService } from "@/lib/auth/auth-service";
import { RbacGuard } from "@/lib/auth/rbac";

export const dynamic = "force-dynamic";

// Validation Schemas
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2),
  role: z.enum(["JOB_SEEKER", "EMPLOYER", "RECRUITER", "ADMIN"]).optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

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

  try {
    const body = await request.json();

    // 1. POST /api/v1/auth/register
    if (subPath === "register") {
      const parsed = RegisterSchema.parse(body);
      const user = await AuthService.register(parsed as any);
      return NextResponse.json({ success: true, message: "User registered successfully", user }, { status: 201 });
    }

    // 2. POST /api/v1/auth/login
    if (subPath === "login") {
      const parsed = LoginSchema.parse(body);
      const result = await AuthService.login(parsed);
      
      const response = NextResponse.json({ success: true, ...result });
      response.cookies.set("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60,
      });
      return response;
    }

    // 3. POST /api/v1/auth/refresh
    if (subPath === "refresh") {
      const refreshToken = body.refreshToken || request.cookies.get("refreshToken")?.value;
      if (!refreshToken) {
        return NextResponse.json({ success: false, error: "Missing refresh token" }, { status: 400 });
      }
      const result = await AuthService.refreshTokens(refreshToken);
      return NextResponse.json({ success: true, ...result });
    }

    // 4. POST /api/v1/auth/logout
    if (subPath === "logout") {
      const refreshToken = body.refreshToken || request.cookies.get("refreshToken")?.value;
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete("refreshToken");
      return response;
    }

    // 5. POST /api/v1/auth/forgot-password
    if (subPath === "forgot-password") {
      const { email } = body;
      const result = await AuthService.forgotPassword(email);
      return NextResponse.json(result);
    }

    // 6. POST /api/v1/auth/reset-password
    if (subPath === "reset-password") {
      const { token, newPassword } = body;
      const result = await AuthService.resetPassword(token, newPassword);
      return NextResponse.json(result);
    }

    return NextResponse.json({ success: false, error: `Route POST /api/v1/auth/${subPath} not found` }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || "Authentication error" }, { status: 400 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  // 1. GET /api/v1/auth/me
  if (subPath === "me") {
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: { profile: true, employerProfile: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  }

  // 2. GET /api/v1/auth/users/:id (Admin Only)
  if (subPath.startsWith("users/")) {
    if (!authUser || !RbacGuard.isAdmin(authUser.role)) {
      return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });
    }

    const targetUserId = subPath.split("/")[1];
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: { profile: true, employerProfile: true },
    });

    return NextResponse.json({ success: true, user });
  }

  return NextResponse.json({ success: false, error: `Route GET /api/v1/auth/${subPath} not found` }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ route?: string[] }> }
) {
  const { route } = await params;
  const subPath = route ? route.join("/") : "";
  const authUser = getAuthUser(request);

  // 1. PUT /api/v1/auth/me
  if (subPath === "me") {
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id: authUser.userId },
      data: {
        name: body.name || undefined,
        profile: body.profile
          ? {
              upsert: {
                create: body.profile,
                update: body.profile,
              },
            }
          : undefined,
      },
      include: { profile: true, employerProfile: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  }

  return NextResponse.json({ success: false, error: `Route PUT /api/v1/auth/${subPath} not found` }, { status: 404 });
}
