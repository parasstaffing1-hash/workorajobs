import { pgTable, uuid, varchar, text, boolean, integer, timestamp, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";
import { relations, eq } from "drizzle-orm";

// 1. Concept Type Enum representing the 25 requested core domains
export const conceptTypeEnum = pgEnum("concept_type", [
  "SKILL",
  "SKILL_ALIAS", // included as aliases or separate types
  "JOB_TITLE",
  "COMPANY",
  "INDUSTRY",
  "TECHNOLOGY",
  "PROGRAMMING_LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "CLOUD_PLATFORM",
  "DEVOPS_TOOL",
  "OPERATING_SYSTEM",
  "CERTIFICATION",
  "UNIVERSITY",
  "LOCATION",
  "COUNTRY",
  "STATE",
  "CITY",
  "EMPLOYMENT_TYPE",
  "SECURITY_CLEARANCE",
  "VISA_STATUS",
  "NOTICE_PERIOD",
  "DEGREE_TYPE"
]);

// 2. Core Taxonomy Concepts Table
export const booleanConcepts = pgTable(
  "boolean_concepts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 256 }).notNull(),
    slug: varchar("slug", { length: 256 }).notNull(),
    type: conceptTypeEnum("type").notNull(),
    description: text("description"),
    
    // Version Control fields
    version: integer("version").default(1).notNull(),
    isLatest: boolean("is_latest").default(true).notNull(),
    parentId: uuid("parent_id"), // Self-referencing foreign key for version trace / inheritance tree
    
    // Soft Delete fields
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("concept_slug_unique_idx").on(table.slug).where(eq(table.isLatest, true)), // uniqueness on latest versions
    index("concept_name_idx").on(table.name),
    index("concept_type_idx").on(table.type),
    index("concept_version_idx").on(table.parentId),
  ]
);

// 3. Concept Aliases and Synonyms Table (Supporting Unlimited Aliases and Synonyms)
export const conceptAliases = pgTable(
  "concept_aliases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conceptId: uuid("concept_id")
      .references(() => booleanConcepts.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 256 }).notNull(),
    isSynonym: boolean("is_synonym").default(true).notNull(), // true = synonym, false = acronym/abbreviation/alias
    aliasType: varchar("alias_type", { length: 64 }).default("SYNONYM").notNull(), // SYNONYM, ALIAS, ABBREVIATION, RECRUITER_NAME, VENDOR_NAME, LEGACY_NAME, PLURAL, SINGULAR, REGIONAL_SPELLING
    
    // Versioning
    version: integer("version").default(1).notNull(),
    
    // Soft Delete
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("alias_name_idx").on(table.name),
    index("alias_concept_idx").on(table.conceptId),
  ]
);

// 4. Concept Hierarchical and Cross-Boundary Relations Table (e.g. Country -> State -> City)
export const conceptRelations = pgTable(
  "concept_relations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceConceptId: uuid("source_concept_id")
      .references(() => booleanConcepts.id, { onDelete: "cascade" })
      .notNull(),
    targetConceptId: uuid("target_concept_id")
      .references(() => booleanConcepts.id, { onDelete: "cascade" })
      .notNull(),
    relationType: varchar("relation_type", { length: 64 }).notNull(), // e.g. "PARENT_OF", "REQUIRES", "RELATED_TO"
    
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("relation_source_idx").on(table.sourceConceptId),
    index("relation_target_idx").on(table.targetConceptId),
  ]
);

// Define relations configurations for eager queries
export const booleanConceptsRelations = relations(booleanConcepts, ({ one, many }) => ({
  parent: one(booleanConcepts, {
    fields: [booleanConcepts.parentId],
    references: [booleanConcepts.id],
  }),
  versions: many(booleanConcepts),
  aliases: many(conceptAliases),
  relationsFrom: many(conceptRelations, { relationName: "sourceRelations" }),
  relationsTo: many(conceptRelations, { relationName: "targetRelations" }),
}));

export const conceptAliasesRelations = relations(conceptAliases, ({ one }) => ({
  concept: one(booleanConcepts, {
    fields: [conceptAliases.conceptId],
    references: [booleanConcepts.id],
  }),
}));

export const conceptRelationsRelations = relations(conceptRelations, ({ one }) => ({
  sourceConcept: one(booleanConcepts, {
    fields: [conceptRelations.sourceConceptId],
    references: [booleanConcepts.id],
    relationName: "sourceRelations",
  }),
  targetConcept: one(booleanConcepts, {
    fields: [conceptRelations.targetConceptId],
    references: [booleanConcepts.id],
    relationName: "targetRelations",
  }),
}));
