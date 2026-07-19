import { eq, and, sql, or } from "drizzle-orm";
import { db } from "../db";
import { booleanConcepts, conceptAliases, conceptRelations } from "../schema";
import { CreateConceptInput, UpdateConceptInput } from "../validation";

// Reusable slugify utility
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export class ConceptRepository {
  /**
   * Create a new taxonomy concept with optional aliases/synonyms
   */
  async createConcept(input: CreateConceptInput) {
    const slug = slugify(input.name);

    return await db.transaction(async (tx) => {
      // 1. Insert Core Concept
      const [concept] = await tx
        .insert(booleanConcepts)
        .values({
          name: input.name,
          slug,
          type: input.type,
          description: input.description || null,
          version: 1,
          isLatest: true,
          isDeleted: false,
        })
        .returning();

      // 2. Insert Aliases & Synonyms
      if (input.aliases && input.aliases.length > 0) {
        await tx.insert(conceptAliases).values(
          input.aliases.map((alias: any) => ({
            conceptId: concept.id,
            name: alias.name,
            isSynonym: alias.isSynonym,
            version: 1,
          }))
        );
      }

      return this.getConceptById(concept.id, tx);
    });
  }

  /**
   * Fetch a concept by ID (latest or specific historical version)
   */
  async getConceptById(id: string, tx: any = db) {
    const concept = await tx.query.booleanConcepts.findFirst({
      where: and(
        eq(booleanConcepts.id, id),
        eq(booleanConcepts.isDeleted, false)
      ),
      with: {
        aliases: {
          where: eq(conceptAliases.isDeleted, false),
        },
      },
    });

    return concept || null;
  }

  /**
   * Fetch a concept by slug (always retrieves the latest active version)
   */
  async getConceptBySlug(slug: string, tx: any = db) {
    const concept = await tx.query.booleanConcepts.findFirst({
      where: and(
        eq(booleanConcepts.slug, slug),
        eq(booleanConcepts.isLatest, true),
        eq(booleanConcepts.isDeleted, false)
      ),
      with: {
        aliases: {
          where: eq(conceptAliases.isDeleted, false),
        },
      },
    });

    return concept || null;
  }

  /**
   * Update a concept, supporting either in-place updates or version increments
   */
  async updateConcept(id: string, input: UpdateConceptInput) {
    return await db.transaction(async (tx) => {
      const current = await this.getConceptById(id, tx);
      if (!current) throw new Error("Concept not found");

      if (input.incrementVersion) {
        // 1. Mark current version as not latest
        await tx
          .update(booleanConcepts)
          .set({ isLatest: false, updatedAt: new Date() })
          .where(eq(booleanConcepts.id, current.id));

        // 2. Insert new versioned concept
        const newVersion = current.version + 1;
        const newName = input.name || current.name;
        const [newConcept] = await tx
          .insert(booleanConcepts)
          .values({
            name: newName,
            slug: slugify(newName),
            type: current.type,
            description: input.description !== undefined ? input.description : current.description,
            version: newVersion,
            isLatest: true,
            parentId: current.parentId || current.id, // preserve version tree anchor
            isDeleted: false,
          })
          .returning();

        // 3. Clone existing aliases to the new version if not overridden
        const newAliases = input.aliases || current.aliases;
        if (newAliases && newAliases.length > 0) {
          await tx.insert(conceptAliases).values(
            newAliases.map((alias: any) => ({
              conceptId: newConcept.id,
              name: alias.name,
              isSynonym: alias.isSynonym,
              version: newVersion,
            }))
          );
        }

        return this.getConceptById(newConcept.id, tx);
      } else {
        // In-place updates
        const updateData: Partial<typeof booleanConcepts.$inferSelect> = {
          updatedAt: new Date(),
        };
        if (input.name) {
          updateData.name = input.name;
          updateData.slug = slugify(input.name);
        }
        if (input.description !== undefined) {
          updateData.description = input.description;
        }

        await tx
          .update(booleanConcepts)
          .set(updateData)
          .where(eq(booleanConcepts.id, id));

        // If aliases are provided, soft-delete old aliases and insert new ones
        if (input.aliases) {
          await tx
            .update(conceptAliases)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where(eq(conceptAliases.conceptId, id));

          if (input.aliases.length > 0) {
            await tx.insert(conceptAliases).values(
              input.aliases.map((alias: any) => ({
                conceptId: id,
                name: alias.name,
                isSynonym: alias.isSynonym,
                version: current.version,
              }))
            );
          }
        }

        return this.getConceptById(id, tx);
      }
    });
  }

  /**
   * Soft-delete a taxonomy concept
   */
  async deleteConcept(id: string) {
    return await db.transaction(async (tx) => {
      // 1. Soft-delete the concept
      await tx
        .update(booleanConcepts)
        .set({ isDeleted: true, deletedAt: new Date() })
        .where(eq(booleanConcepts.id, id));

      // 2. Soft-delete its aliases
      await tx
        .update(conceptAliases)
        .set({ isDeleted: true, deletedAt: new Date() })
        .where(eq(conceptAliases.conceptId, id));

      return true;
    });
  }

  /**
   * List latest active concepts by category type
   */
  async listConcepts(type: typeof booleanConcepts.$inferSelect.type, limit = 20, offset = 0) {
    return await db
      .select()
      .from(booleanConcepts)
      .where(
        and(
          eq(booleanConcepts.type, type),
          eq(booleanConcepts.isLatest, true),
          eq(booleanConcepts.isDeleted, false)
        )
      )
      .limit(limit)
      .offset(offset);
  }

  /**
   * Resolve an input string (keyword, synonym, alias) to its core concepts
   */
  async resolveConcepts(keyword: string) {
    const searchVal = keyword.trim().toLowerCase();
    
    // Find direct concept matches or alias/synonym matches
    return await db
      .select({
        concept: booleanConcepts,
      })
      .from(booleanConcepts)
      .leftJoin(conceptAliases, eq(conceptAliases.conceptId, booleanConcepts.id))
      .where(
        and(
          eq(booleanConcepts.isLatest, true),
          eq(booleanConcepts.isDeleted, false),
          or(
            sql`LOWER(${booleanConcepts.name}) = ${searchVal}`,
            and(
              sql`LOWER(${conceptAliases.name}) = ${searchVal}`,
              eq(conceptAliases.isDeleted, false)
            )
          )
        )
      );
  }

  /**
   * Get version history of a concept
   */
  async getVersionHistory(conceptId: string) {
    const concept = await this.getConceptById(conceptId);
    if (!concept) return [];

    const rootId = concept.parentId || concept.id;

    return await db
      .select()
      .from(booleanConcepts)
      .where(
        and(
          or(eq(booleanConcepts.id, rootId), eq(booleanConcepts.parentId, rootId)),
          eq(booleanConcepts.isDeleted, false)
        )
      )
      .orderBy(booleanConcepts.version);
  }
}
