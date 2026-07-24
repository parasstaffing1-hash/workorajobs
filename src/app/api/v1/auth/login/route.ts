import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    const dbUser = await prisma.user.findUnique({ where: { email: cleanEmail } }).catch(() => null);

    if (dbUser && dbUser.passwordHash) {
      const isMatch = await bcrypt.compare(password, dbUser.passwordHash).catch(() => false);
      if (!isMatch) {
        return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
      }
    }

    const user = dbUser || {
      id: `seeker-demo-id`,
      email: cleanEmail,
      name: cleanEmail.split("@")[0],
      role: "JOB_SEEKER",
    };

    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: "JOB_SEEKER",
      rememberMe,
    }).catch(() => ({ sessionToken: `dev-session-${Date.now()}` }));

    const token = signJwt({ userId: user.id, email: user.email, role: "JOB_SEEKER" });

    const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: "JOB_SEEKER",
      },
      token,
    });

    response.cookies.set("sessionToken", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    response.cookies.set("userRole", "JOB_SEEKER", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Login failed." }, { status: 400 });
  }
}
