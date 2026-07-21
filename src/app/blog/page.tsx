import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { PageHero } from "@/components/marketing/page-hero";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { blogPosts } from "@/data/blog";
import { createMetadata } from "@/lib/site";

export const metadata = createMetadata({
  title: "Hiring Insights & Career Advice Blog",
  description:
    "Articles, insights, and best practices on global recruitment, HR tech, and remote work.",
  path: "/blog",
});;

export default function BlogPage() {
  return (
    <>
      <PageHero
        description="Editorial insight on global staffing, candidate trust and responsible AI recruiting."
        eyebrow="Blog"
        title="Ideas for building better global hiring systems."
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link className="group" href={`/blog/${post.slug}`} key={post.slug}>
              <Card className="h-full overflow-hidden">
                <Image
                  alt=""
                  className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  height={520}
                  src={post.image}
                  width={760}
                />
                <div className="p-6">
                  <Badge>{post.category}</Badge>
                  <h2 className="mt-4 text-xl font-semibold tracking-tight">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <p className="mt-5 text-sm font-medium text-primary">
                    {post.readTime}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
