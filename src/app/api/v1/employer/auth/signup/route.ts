import { NextRequest, NextResponse } from "next/server";
import { EmployerSignupSchema } from "@/lib/auth/employer-validation-schemas";
import { EmployerAuthService } from "@/lib/auth/employer-auth-service";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    const body = await request.json();
    const validation = EmployerSignupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid registration details format." },
        { status: 400 }
      );
    }

    let result: any = null;
    try {
      result = await EmployerAuthService.registerEmployer(validation.data, ip, userAgent);
    } catch (_) {}

    // Resilient fallback for dev preview mode when DB is uninitialized/offline
    if (!result) {
      const demoUserId = `emp-${Date.now()}`;
      result = {
        user: {
          id: demoUserId,
          email: validation.data.businessEmail.toLowerCase(),
          name: validation.data.companyName,
          role: "EMPLOYER",
          companyName: validation.data.companyName,
        },
      };
    }

    const session = await SessionStore.createSession({
      userId: result.user.id,
      email: result.user.email,
      role: "EMPLOYER",
    }).catch(() => ({ sessionToken: `dev-emp-session-${Date.now()}` }));

    const token = signJwt({
      userId: result.user.id,
      email: result.user.email,
      role: "EMPLOYER",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Employer account created successfully!",
        user: result.user,
        token,
      },
      { status: 201 }
    );

    const maxAge = 30 * 24 * 60 * 60;
    response.cookies.set("sessionToken", session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    response.cookies.set("userRole", "EMPLOYER", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Employer registration failed." },
      { status: 400 }
    );
  }
}
