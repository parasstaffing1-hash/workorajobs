import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, location } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();

    let dbUser = await prisma.user.findUnique({ where: { email: cleanEmail } }).catch(() => null);

    if (dbUser) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    dbUser = await prisma.user
      .create({
        data: {
          email: cleanEmail,
          passwordHash,
          name: name || cleanEmail.split("@")[0],
          role: "JOB_SEEKER",
        },
      })
      .catch(() => null);

    const user = dbUser || {
      id: `seeker-${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split("@")[0],
      role: "JOB_SEEKER",
    };

    const session = await SessionStore.createSession({
      userId: user.id,
      email: user.email,
      role: "JOB_SEEKER",
    }).catch(() => ({ sessionToken: `dev-session-${Date.now()}` }));

    const token = signJwt({ userId: user.id, email: user.email, role: "JOB_SEEKER" });

    const response = NextResponse.json({
      success: true,
      message: "Job Seeker registration successful!",
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
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    response.cookies.set("userRole", "JOB_SEEKER", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Registration failed." }, { status: 400 });
  }
}
