export interface ExpandOptions {
  platform?: string; // For platform-specific expansion rules
  includeTypes?: ("SYNONYM" | "ALIAS" | "ABBREVIATION" | "RECRUITER_NAME" | "VENDOR_NAME" | "LEGACY_NAME" | "PLURAL" | "SINGULAR" | "REGIONAL_SPELLING")[];
}

export class SynonymEngine {
  // Performance Cache: Simple in-memory LRU-like cache
  private cache = new Map<string, { data: string[]; timestamp: number }>();
  private readonly CACHE_TTL_MS = 60000; // 60 seconds TTL

  /**
   * Helper to lazily load repository only on server-side
   */
  private async getRepository() {
    if (typeof window !== "undefined") return null;
    try {
      const { ConceptRepository } = await import("./repositories/concept.repository");
      return new ConceptRepository();
    } catch {
      return null;
    }
  }

  /**
   * Resolve an input term to its expanded synonyms and aliases.
   * Supports nested synonym group resolution, types filter, platform filter, and performance caching.
   */
  public async expand(term: string, options: ExpandOptions = {}): Promise<string[]> {
    const cleanTerm = term.trim().toLowerCase();
    const cacheKey = `${cleanTerm}:${options.platform || "default"}:${(options.includeTypes || []).join(",")}`;

    // 1. Check performance cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    const expansionSet = new Set<string>();
    expansionSet.add(term); // Always include original term

    const repo = await this.getRepository();
    let dbSuccess = false;

    if (repo) {
      try {
        const matches = await repo.resolveConcepts(cleanTerm);
        if (matches && matches.length > 0) {
          const visitedConcepts = new Set<string>();
          for (const match of matches) {
            await this.recursiveExpand(match.concept.id, expansionSet, visitedConcepts, options, repo);
          }
          dbSuccess = true;
        }
      } catch (dbError) {
        // Fallback below
      }
    }

    if (!dbSuccess) {
      // Fallback local dictionary rules matching the exact same concepts as seed.ts
      const fallbackRules: Record<string, string[]> = {
        react: ["ReactJS", "React.js", "React JS", "React Library"],
        reactjs: ["React", "React.js", "React JS"],
        typescript: ["TS", "TypeScript Language"],
        ts: ["TypeScript", "TypeScript Language"],
        aws: ["Amazon Web Services", "AWS Certified Solutions Architect"],
        postgres: ["PostgreSQL", "PGSQL", "PG", "Postgres"],
        postgresql: ["Postgres", "PGSQL", "PG"],
        swe: ["Software Engineer", "Software Developer", "Fullstack Developer", "Backend Developer"],
        "software engineer": ["SWE", "Software Developer", "Fullstack Developer", "Backend Developer"],
        it: ["Information Technology", "Tech Industry"],
        usa: ["United States", "US"],
      };

      const matchedFallbacks = fallbackRules[cleanTerm];
      if (matchedFallbacks) {
        matchedFallbacks.forEach(f => expansionSet.add(f));
      }
    }

    const result = Array.from(expansionSet);
    
    // 3. Save to cache
    this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return result;
  }

  /**
   * Recursively resolve synonyms and nested synonym groups with cycle detection.
   */
  private async recursiveExpand(
    conceptId: string, 
    expansionSet: Set<string>, 
    visitedConcepts: Set<string>,
    options: ExpandOptions,
    repo: any
  ): Promise<void> {
    if (visitedConcepts.has(conceptId)) return;
    visitedConcepts.add(conceptId);

    const concept = await repo.getConceptById(conceptId);
    if (!concept) return;

    // Add canonical name
    expansionSet.add(concept.name);

    // 2. Filter and add aliases
    if (concept.aliases) {
      for (const alias of concept.aliases) {
        const aliasType = (alias as any).aliasType || "SYNONYM";
        if (options.includeTypes && !options.includeTypes.includes(aliasType)) {
          continue; // Skip if filtered by type
        }
        expansionSet.add(alias.name);
      }
    }

    // 3. Resolve nested synonym groups using relation mappings
    if (typeof window === "undefined") {
      try {
        const { db } = await import("./db");
        const { conceptRelations } = await import("./schema");
        const { eq, and } = await import("drizzle-orm");

        const relations = await db
          .select({
            targetId: conceptRelations.targetConceptId,
            type: conceptRelations.relationType,
          })
          .from(conceptRelations)
          .where(
            and(
              eq(conceptRelations.sourceConceptId, conceptId),
              eq(conceptRelations.isDeleted, false)
            )
          );

        for (const rel of relations) {
          if (rel.type === "SYNONYM_GROUP_OF" || rel.type === "PARENT_OF" || rel.type === "RELATED_TO") {
            await this.recursiveExpand(rel.targetId, expansionSet, visitedConcepts, options, repo);
          }
        }
      } catch (err) {
        // ignore
      }
    }
  }

  /**
   * Collapse a list of variant terms back to their primary canonical concept name
   */
  public async collapse(terms: string[]): Promise<string> {
    if (terms.length === 0) return "";
    
    const fallbackCollapse: Record<string, string> = {
      ts: "TypeScript",
      typescript: "TypeScript",
      "typescript language": "TypeScript",
      react: "React",
      reactjs: "React",
      "react.js": "React",
      "react js": "React",
      aws: "Amazon Web Services",
      "amazon web services": "Amazon Web Services",
      postgres: "PostgreSQL",
      postgresql: "PostgreSQL",
      swe: "Software Engineer",
      "software engineer": "Software Engineer",
      "software developer": "Software Engineer",
      it: "Information Technology",
      "information technology": "Information Technology",
      usa: "United States",
      us: "United States",
      "united states": "United States",
    };

    const repo = await this.getRepository();

    // Resolve the first valid term back to its canonical concept name
    for (const term of terms) {
      const cleanTerm = term.trim().toLowerCase();
      
      if (repo) {
        try {
          const matches = await repo.resolveConcepts(cleanTerm);
          if (matches && matches.length > 0) {
            return matches[0].concept.name; // return primary canonical
          }
        } catch (err) {
          // Fallback checks
        }
      }

      // Fallback
      const matched = fallbackCollapse[cleanTerm];
      if (matched) {
        return matched;
      }
    }

    // Fallback default
    return terms[0];
  }

  /**
   * API: Create / register a manual synonym alias type under a concept
   */
  public async addAlias(
    conceptId: string, 
    name: string, 
    type: "SYNONYM" | "ALIAS" | "ABBREVIATION" | "RECRUITER_NAME" | "VENDOR_NAME" | "LEGACY_NAME" | "PLURAL" | "SINGULAR" | "REGIONAL_SPELLING" = "SYNONYM"
  ) {
    if (typeof window !== "undefined") return null;
    const { db } = await import("./db");
    const { conceptAliases } = await import("./schema");

    const result = await db.transaction(async (tx: any) => {
      const [newAlias] = await tx
        .insert(conceptAliases)
        .values({
          conceptId,
          name,
          isSynonym: type === "SYNONYM",
          aliasType: type,
          version: 1,
        })
        .returning();

      return newAlias;
    });

    this.cache.clear();
    return result;
  }

  /**
   * API: Soft delete a synonym alias
   */
  public async deleteAlias(aliasId: string) {
    if (typeof window !== "undefined") return null;
    const { db } = await import("./db");
    const { conceptAliases } = await import("./schema");
    const { eq } = await import("drizzle-orm");

    const result = await db
      .update(conceptAliases)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(conceptAliases.id, aliasId));
    
    this.cache.clear();
    return result;
  }
}
