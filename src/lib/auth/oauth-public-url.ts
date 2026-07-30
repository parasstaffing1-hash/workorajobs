import { NextRequest } from "next/server";

/**
 * Builds OAuth URLs from the configured public application origin.
 * Standalone Next.js behind Nginx can expose an internal request origin such as
 * https://0.0.0.0, which OAuth providers must never receive as a callback URL.
 */
export function oauthPublicUrl(request: NextRequest, pathname: string): URL {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    (process.env.NODE_ENV === "production" ? "https://workorajobs.com" : "");
  if (configuredOrigin) {
    const origin = new URL(configuredOrigin);
    if (process.env.NODE_ENV === "production" && origin.protocol !== "https:") {
      throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS in production.");
    }
    return new URL(pathname, origin);
  }

  return new URL(pathname, request.url);
}
