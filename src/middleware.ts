import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  const searchParams = url.searchParams;

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

  const response = NextResponse.next();

  // 4. Control filter parameters & search queries indexing (Prompt 7)
  // Search and multi-filter combinations are set to noindex, follow
  const filterKeys = ["search", "salary", "experience", "skill", "role", "company", "sort"];
  const hasFilterParams = filterKeys.some((key) => searchParams.has(key));

  if (hasFilterParams) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  // 5. Apply enterprise production security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), display-capture=()"
  );
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev overlays
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  response.headers.set("Content-Security-Policy", cspDirectives.join("; "));

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)",
  ],
};
