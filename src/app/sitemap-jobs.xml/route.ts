import { NextResponse } from "next/server";

import { siteConfig } from "@/lib/site";

export async function GET() {
  return NextResponse.redirect(`${siteConfig.url}/sitemap-jobs-active.xml`, 308);
}
