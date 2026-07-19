import type { Metadata } from "next";

export const siteConfig = {
  name: "Workora Jobs",
  url: "https://www.workorajobs.com",
  description:
    "Workora Jobs is an AI-powered global staffing and recruitment platform for companies hiring trusted talent across borders.",
  keywords: [
    "global staffing",
    "recruitment platform",
    "AI hiring",
    "remote hiring",
    "enterprise recruiting",
    "talent marketplace",
    "Workora Jobs",
  ],
  links: {
    x: "https://x.com/workorajobs",
    linkedin: "https://www.linkedin.com/company/workorajobs",
  },
};

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image = "/opengraph-image",
  noIndex = false,
}: MetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: fullTitle,
    applicationName: siteConfig.name,
    description,
    keywords: siteConfig.keywords,
    metadataBase: new URL(siteConfig.url),
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        {
          url: "/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          url: "/favicon-48x48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          url: "/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      shortcut: ["/favicon.ico"],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteConfig.name,
    },
    alternates: {
      canonical: url,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} preview`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@workorajobs",
    },
  };
}
