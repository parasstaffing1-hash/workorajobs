import { Metadata } from "next";

import { ProgrammaticSeo } from "@/components/seo/programmatic-seo";
import { parseProgrammaticSeo } from "@/lib/programmatic-seo-data";

export const revalidate = 3600; // ISR revalidate every hour

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = parseProgrammaticSeo("skills", slug);

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

export default async function SkillsSeoPage({ params }: Props) {
  const { slug } = await params;
  const data = parseProgrammaticSeo("skills", slug);

  return (
    <main className="min-h-screen py-6 bg-background">
      <ProgrammaticSeo {...data} />
    </main>
  );
}
