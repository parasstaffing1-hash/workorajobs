import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageTransition } from "@/components/motion/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeScript } from "@/components/theme/theme-script";
import { createMetadata, siteConfig } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = createMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0888f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0888f8" },
  ],
};

import { MotionBackground } from "@/components/ui/motion-background";

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeScript />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/workora-jobs-logo.png`,
            sameAs: [siteConfig.links.x, siteConfig.links.linkedin],
          }}
        />
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:shadow-soft-lg"
          href="#main-content"
        >
          Skip to content
        </a>
        <MotionBackground />
        <SiteHeader />
        <PageTransition>{children}</PageTransition>
        <SiteFooter />
      </body>
    </html>
  );
}
