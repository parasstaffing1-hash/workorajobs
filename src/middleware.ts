import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const PUBLIC_EMPLOYER_PATHS = new Set([
  "/employer/login",
  "/employer/signup",
  "/employer/forgot-password",
  "/employer/reset-password",
  "/employer/verify-email",
]);

function isStaticOrSystemPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  );
}

function getTrustedOrigins(request: NextRequest): Set<string> {
  const forwardedHost = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const forwardedProto =
    request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.replace(":", "");
  const values = [
    request.nextUrl.origin,
    forwardedHost ? `${forwardedProto}://${forwardedHost}` : null,
    forwardedHost ? `https://${forwardedHost}` : null,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    ...(process.env.TRUSTED_ORIGINS || process.env.CSRF_TRUSTED_ORIGINS || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  ];

  return new Set(
    values
      .filter(Boolean)
      .map((value) => {
        try {
          return new URL(value as string).origin;
        } catch {
          return null;
        }
      })
      .filter((value): value is string => Boolean(value))
  );
}

function getRequestOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).origin;
    } catch {
      return null;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      return null;
    }
  }

  return null;
}

function isTrustedBrowserMutation(request: NextRequest): boolean {
  const requestOrigin = getRequestOrigin(request);
  if (!requestOrigin) return false;
  return getTrustedOrigins(request).has(requestOrigin);
}

function shouldEnforceCsrfOrigin(request: NextRequest): boolean {
  if (!request.nextUrl.pathname.startsWith("/api/")) return false;
  if (!MUTATING_METHODS.has(request.method.toUpperCase())) return false;
  if (!request.cookies.get("sessionToken")?.value) return false;

  // Non-browser integrations must authenticate with headers and are not protected
  // by SameSite cookies, so origin checks are only enforced for cookie auth.
  if (request.headers.get("authorization")) return false;
  if (request.headers.get("x-session-token")) return false;
  if (request.headers.get("x-api-key")) return false;
  if (request.headers.get("x-n8n-secret")) return false;

  return true;
}

function buildContentSecurityPolicy(): string {
  const isProd = process.env.NODE_ENV === "production";
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    !isProd ? "'unsafe-eval'" : "",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.clarity.ms",
    "https://*.clarity.ms",
    "https://challenges.cloudflare.com",
    "https://checkout.razorpay.com",
    "https://browser.sentry-cdn.com",
  ].filter(Boolean);

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https: ws: wss:",
    "frame-src 'self' https://www.googletagmanager.com https://challenges.cloudflare.com https://checkout.razorpay.com https://api.razorpay.com",
    "worker-src 'self' blob:",
    "media-src 'self' blob: data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ];

  if (isProd) {
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("Content-Security-Policy", buildContentSecurityPolicy());
  return response;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const isApiPath = pathname.startsWith("/api/");

  if (isStaticOrSystemPath(pathname)) {
    return NextResponse.next();
  }

  if (shouldEnforceCsrfOrigin(request) && !isTrustedBrowserMutation(request)) {
    return applySecurityHeaders(
      NextResponse.json(
        { success: false, error: "Cross-origin request rejected." },
        { status: 403 }
      )
    );
  }

  if (!isApiPath && pathname.includes("//")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/+/g, "/");
    return applySecurityHeaders(NextResponse.redirect(url, 308));
  }

  if (!isApiPath && /[A-Z]/.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return applySecurityHeaders(NextResponse.redirect(url, 308));
  }

  const isEmployerWorkspace =
    !isApiPath &&
    (pathname === "/employer" || pathname.startsWith("/employer/")) &&
    !PUBLIC_EMPLOYER_PATHS.has(pathname);

  if (isEmployerWorkspace) {
    const sessionToken = request.cookies.get("sessionToken")?.value;
    const userRole = request.cookies.get("userRole")?.value;
    if (!sessionToken || (userRole !== "EMPLOYER" && userRole !== "ADMIN")) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/employer/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("returnUrl", `${pathname}${request.nextUrl.search}`);
      return applySecurityHeaders(NextResponse.redirect(loginUrl, 307));
    }
  }

  const isAdminWorkspace =
    !isApiPath && (pathname === "/admin" || pathname.startsWith("/admin/"));

  if (isAdminWorkspace) {
    const sessionToken = request.cookies.get("sessionToken")?.value;
    const userRole = request.cookies.get("userRole")?.value;
    if (!sessionToken || userRole !== "ADMIN") {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("returnUrl", `${pathname}${request.nextUrl.search}`);
      return applySecurityHeaders(NextResponse.redirect(loginUrl, 307));
    }
  }

  const response = NextResponse.next();

  const filterKeys = ["search", "salary", "experience", "skill", "role", "company", "sort"];
  const hasFilterParams = filterKeys.some((key) => searchParams.has(key));

  if (!isApiPath && hasFilterParams) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return applySecurityHeaders(response);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico)$).*)",
  ],
};
