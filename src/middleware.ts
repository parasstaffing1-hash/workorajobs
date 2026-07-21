import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // 1. Skip system files, static files, APIs, and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. Duplicate slash removal (e.g. /jobs//details -> /jobs/details)
  if (pathname.includes("//")) {
    const cleanPath = pathname.replace(/\/+/g, "/");
    url.pathname = cleanPath;
    return NextResponse.redirect(url, 308);
  }

  // 3. Lowercase URL normalization
  if (/[A-Z]/.test(pathname)) {
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }

  // Let Next.js trailingSlash: false config handle trailing slash redirects natively.
  // Apply production security headers
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - workora-jobs-logo.png (assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)",
  ],
};
