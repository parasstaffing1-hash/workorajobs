import Image from "next/image";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/site";

import { JsonLd } from "@/components/seo/json-ld";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) return createMetadata({ title: "Hiring Insights & Career Advice Articles", path: "/blog" });

  return createMetadata({
    title: `${post.title} | Career & Hiring Insights`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image.startsWith("http") ? post.image : `https://workorajobs.com${post.image}`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      "@type": "Organization",
      name: "WorkoraJobs Sourcing Team",
      url: "https://workorajobs.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "WorkoraJobs",
      logo: {
        "@type": "ImageObject",
        url: "https://workorajobs.com/workora-jobs-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://workorajobs.com/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://workorajobs.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://workorajobs.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://workorajobs.com/blog/${post.slug}`,
      },
    ],
  };

  return (
    <article>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <Badge>{post.category}</Badge>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            {post.excerpt}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
              new Date(post.date),
            )}{" "}
            / {post.readTime}
          </p>
        </div>
        <Image
          alt={post.title}
          className="mx-auto mt-10 max-h-[480px] rounded-lg border border-border/70 object-cover shadow-premium"
          height={720}
          priority
          src={post.image}
          width={1120}
        />
        <div className="prose prose-slate mx-auto mt-12 max-w-3xl dark:prose-invert">
          {post.content.map((paragraph) => (
            <p
              className="text-lg leading-8 text-muted-foreground"
              key={paragraph}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Container>
    </article>
  );
}
