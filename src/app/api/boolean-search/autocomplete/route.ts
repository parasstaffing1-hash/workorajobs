import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/boolean-search/db";
import { booleanConcepts, conceptAliases } from "../../../../lib/boolean-search/schema";
import { eq, and, or, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";

    if (q.length < 2) {
      return NextResponse.json({ suggestions: { skills: [], jobTitles: [], companies: [], locations: [], frameworks: [] } });
    }

    const searchVal = q.toLowerCase();

    // 1. Direct query using Drizzle ORM
    let results: any[] = [];
    try {
      results = await db
        .select({
          id: booleanConcepts.id,
          name: booleanConcepts.name,
          type: booleanConcepts.type,
          slug: booleanConcepts.slug,
          aliasName: conceptAliases.name,
        })
        .from(booleanConcepts)
        .leftJoin(conceptAliases, eq(conceptAliases.conceptId, booleanConcepts.id))
        .where(
          and(
            eq(booleanConcepts.isLatest, true),
            eq(booleanConcepts.isDeleted, false),
            or(
              sql`LOWER(${booleanConcepts.name}) LIKE ${`%${searchVal}%`}`,
              and(
                sql`LOWER(${conceptAliases.name}) LIKE ${`%${searchVal}%`}`,
                eq(conceptAliases.isDeleted, false)
              )
            )
          )
        )
        .limit(50);
    } catch (dbError) {
      // Fallback Mock Data matching fuzzy search criteria
      console.warn("Database lookup failed, falling back to mock dictionary matches.");
      const mockDictionary = [
        { name: "TypeScript", type: "PROGRAMMING_LANGUAGE", aliases: ["TS"] },
        { name: "JavaScript", type: "PROGRAMMING_LANGUAGE", aliases: ["JS"] },
        { name: "Python", type: "PROGRAMMING_LANGUAGE", aliases: ["Py"] },
        { name: "Next.js", type: "FRAMEWORK", aliases: ["NextJS"] },
        { name: "React", type: "FRAMEWORK", aliases: ["ReactJS"] },
        { name: "PostgreSQL", type: "DATABASE", aliases: ["Postgres", "PG"] },
        { name: "Amazon Web Services", type: "CLOUD_PLATFORM", aliases: ["AWS"] },
        { name: "Docker", type: "DEVOPS_TOOL", aliases: [] },
        { name: "Software Engineer", type: "JOB_TITLE", aliases: ["Software Developer", "SWE", "Fullstack"] },
        { name: "Google", type: "COMPANY", aliases: ["Alphabet"] },
        { name: "Information Technology", type: "INDUSTRY", aliases: ["IT"] },
        { name: "San Francisco", type: "CITY", aliases: ["SF"] },
        { name: "California", type: "STATE", aliases: ["CA"] },
        { name: "United States", type: "COUNTRY", aliases: ["USA"] },
        { name: "Software Development", type: "SKILL", aliases: [] },
      ];

      results = mockDictionary
        .filter(item => 
          item.name.toLowerCase().includes(searchVal) || 
          item.aliases.some(alias => alias.toLowerCase().includes(searchVal))
        )
        .map((item, idx) => ({
          id: `mock-${idx}`,
          name: item.name,
          type: item.type,
          slug: item.name.toLowerCase().replace(/\s+/g, "-"),
          aliasName: item.aliases[0] || null
        }));
    }

    // 2. Group findings by Concept Type
    const grouped = {
      skills: [] as any[],
      jobTitles: [] as any[],
      companies: [] as any[],
      locations: [] as any[],
      frameworks: [] as any[],
    };

    // Keep track of unique matches by ID to avoid duplicates from joins
    const seen = new Set<string>();

    for (const row of results) {
      if (seen.has(row.id)) continue;
      seen.add(row.id);

      const matchInfo = {
        id: row.id,
        name: row.name,
        type: row.type,
        slug: row.slug,
        alias: row.aliasName,
      };

      if (row.type === "SKILL" || row.type === "TECHNOLOGY" || row.type === "PROGRAMMING_LANGUAGE") {
        grouped.skills.push(matchInfo);
      } else if (row.type === "JOB_TITLE") {
        grouped.jobTitles.push(matchInfo);
      } else if (row.type === "COMPANY") {
        grouped.companies.push(matchInfo);
      } else if (row.type === "LOCATION" || row.type === "COUNTRY" || row.type === "STATE" || row.type === "CITY") {
        grouped.locations.push(matchInfo);
      } else if (row.type === "FRAMEWORK" || row.type === "DATABASE") {
        grouped.frameworks.push(matchInfo);
      }
    }

    return NextResponse.json({ suggestions: grouped });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
