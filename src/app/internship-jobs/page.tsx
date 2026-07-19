import { Metadata } from "next";

import { ProgrammaticSeo } from "@/components/seo/programmatic-seo";
import { parseProgrammaticSeo } from "@/lib/programmatic-seo-data";

export const revalidate = 3600; // ISR revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
  const data = parseProgrammaticSeo("internships", "internship-jobs");

  return {
    title: data.title,
    description: data.description,
    alternates: {
      canonical: data.canonicalUrl,
    },
    robots: data.noindex ? "noindex, nofollow" : "index, follow",
    openGraph: {
      title: data.title,
      description: data.description,
      url: data.canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.description,
    },
  };
}

export default function InternshipJobsSeoPage() {
  const data = parseProgrammaticSeo("internships", "internship-jobs");

  return (
    <main className="min-h-screen py-6 bg-background">
      <ProgrammaticSeo {...data} />
    </main>
  );
}
