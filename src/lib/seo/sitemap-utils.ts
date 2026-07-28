import { jobs as staticJobs, getJobSlug, slugify, type Job } from "@/data/jobs";
import { prisma } from "@/lib/prisma";

export const SITEMAP_URL_LIMIT = 50_000;

export type SitemapUrl = {
  loc: string;
  lastmod?: Date | string | null;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

type SitemapJobRow = {
  id: string;
  title: string;
  slug: string | null;
  updatedAt: Date | null;
  postedAt: Date | null;
  company: {
    name: string;
  } | null;
};

export function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toIsoDate(value?: Date | string | null): string {
  if (!value) return new Date().toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

export function renderUrlSet(urls: SitemapUrl[]): string {
  const urlsXml = urls
    .map((url) => {
      const parts = [
        "  <url>",
        `    <loc>${xmlEscape(url.loc)}</loc>`,
        url.lastmod ? `    <lastmod>${toIsoDate(url.lastmod)}</lastmod>` : "",
        url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : "",
        typeof url.priority === "number" ? `    <priority>${url.priority.toFixed(1)}</priority>` : "",
        "  </url>",
      ].filter(Boolean);

      return parts.join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
}

export function renderSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: Date | string | null }>): string {
  const sitemapsXml = sitemaps
    .map(
      (sitemap) => `  <sitemap>
    <loc>${xmlEscape(sitemap.loc)}</loc>
    <lastmod>${toIsoDate(sitemap.lastmod)}</lastmod>
  </sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}

export async function getActiveJobSitemapCount(): Promise<number> {
  try {
    const count = await prisma.job.count({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [{ deadlineAt: null }, { deadlineAt: { gte: new Date() } }],
      },
    });

    return count || staticJobs.filter((job) => !job.isClosed).length;
  } catch {
    return staticJobs.filter((job) => !job.isClosed).length;
  }
}

export async function getActiveJobSitemapUrls(baseUrl: string, page: number): Promise<SitemapUrl[]> {
  const safePage = Math.max(0, page);
  const skip = safePage * SITEMAP_URL_LIMIT;

  try {
    const rows = await prisma.job.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
        OR: [{ deadlineAt: null }, { deadlineAt: { gte: new Date() } }],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        updatedAt: true,
        postedAt: true,
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { postedAt: "desc" }],
      skip,
      take: SITEMAP_URL_LIMIT,
    });

    if (rows.length > 0) {
      return rows.map((job) => jobRowToSitemapUrl(baseUrl, job));
    }
  } catch {
    // Static fallback keeps local builds and empty development databases working.
  }

  return staticJobs
    .filter((job) => !job.isClosed)
    .slice(skip, skip + SITEMAP_URL_LIMIT)
    .map((job) => staticJobToSitemapUrl(baseUrl, job));
}

function jobRowToSitemapUrl(baseUrl: string, job: SitemapJobRow): SitemapUrl {
  const companyName = job.company?.name || "workora";
  const slug = job.slug || `${slugify(job.title)}-${slugify(companyName)}-${slugify(job.id)}`;

  return {
    loc: `${baseUrl}/jobs/${slug}`,
    lastmod: job.updatedAt || job.postedAt,
    changefreq: "daily",
    priority: 0.9,
  };
}

function staticJobToSitemapUrl(baseUrl: string, job: Job): SitemapUrl {
  return {
    loc: `${baseUrl}/jobs/${getJobSlug(job)}`,
    lastmod: job.datePostedIso || new Date().toISOString(),
    changefreq: "daily",
    priority: 0.9,
  };
}
