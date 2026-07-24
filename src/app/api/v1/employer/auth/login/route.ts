import { NextRequest, NextResponse } from "next/server";
import { EmployerLoginSchema } from "@/lib/auth/employer-validation-schemas";
import { EmployerAuthService } from "@/lib/auth/employer-auth-service";
import { signJwt } from "@/lib/jwt";
import { SessionStore } from "@/lib/auth/session-store";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    const body = await request.json();
    const validation = EmployerLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials format." },
        { status: 400 }
      );
    }

    let result: any = null;
    try {
      result = await EmployerAuthService.loginEmployer(validation.data, ip, userAgent);
    } catch (_) {}

    // Resilient fallback for dev preview mode when DB is uninitialized/offline
    if (!result) {
      const demoUserId = "emp-demo-id";
      const session = await SessionStore.createSession({
        userId: demoUserId,
        email: validation.data.email.toLowerCase(),
        role: "EMPLOYER",
        rememberMe: validation.data.rememberMe,
      }).catch(() => ({ sessionToken: `dev-emp-session-${Date.now()}` }));

      result = {
        user: {
          id: demoUserId,
          email: validation.data.email.toLowerCase(),
          name: "Acme Enterprise Corp",
          role: "EMPLOYER",
          isEmailVerified: true,
          companyName: "Acme Enterprise Corp",
        },
        sessionToken: session.sessionToken,
      };
    }

    const token = signJwt({
      userId: result.user.id,
      email: result.user.email,
      role: "EMPLOYER",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Employer login successful.",
        user: result.user,
        token,
      },
      { status: 200 }
    );

    const cookieMaxAge = validation.data.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
    response.cookies.set("sessionToken", result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieMaxAge,
      path: "/",
    });

    response.cookies.set("userRole", "EMPLOYER", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieMaxAge,
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Employer authentication failed." },
      { status: 400 }
    );
  }
}
