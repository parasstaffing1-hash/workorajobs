import { db, pool } from "./db";
import { booleanConcepts, conceptAliases } from "./schema";
import { ConceptRepository } from "./repositories/concept.repository";

const repository = new ConceptRepository();

const SEED_DATA = [
  // 1. Programming Languages
  {
    name: "TypeScript",
    type: "PROGRAMMING_LANGUAGE" as const,
    description: "Strict syntactical superset of JavaScript adding optional static typing.",
    aliases: [{ name: "TS", isSynonym: true }, { name: "TypeScript Language", isSynonym: false }]
  },
  {
    name: "JavaScript",
    type: "PROGRAMMING_LANGUAGE" as const,
    description: "High-level, core dynamic scripting language of the Web.",
    aliases: [{ name: "JS", isSynonym: true }, { name: "ES6", isSynonym: true }]
  },
  {
    name: "Python",
    type: "PROGRAMMING_LANGUAGE" as const,
    description: "High-level programming language known for readability.",
    aliases: [{ name: "Py", isSynonym: true }]
  },
  // 2. Frameworks
  {
    name: "Next.js",
    type: "FRAMEWORK" as const,
    description: "React framework for production-grade Server-Side Rendering.",
    aliases: [{ name: "NextJS", isSynonym: true }, { name: "Next.js Framework", isSynonym: false }]
  },
  {
    name: "React",
    type: "FRAMEWORK" as const,
    description: "Component-based library for building user interfaces.",
    aliases: [{ name: "ReactJS", isSynonym: true }, { name: "React Library", isSynonym: false }]
  },
  // 3. Databases
  {
    name: "PostgreSQL",
    type: "DATABASE" as const,
    description: "Powerful, open-source object-relational database system.",
    aliases: [{ name: "Postgres", isSynonym: true }, { name: "PGSQL", isSynonym: true }, { name: "PG", isSynonym: true }]
  },
  // 4. Cloud Platforms
  {
    name: "Amazon Web Services",
    type: "CLOUD_PLATFORM" as const,
    description: "Comprehensive, evolving cloud computing platform provided by Amazon.",
    aliases: [{ name: "AWS", isSynonym: true }]
  },
  // 5. DevOps Tools
  {
    name: "Docker",
    type: "DEVOPS_TOOL" as const,
    description: "PaaS product using OS-level virtualization to deliver software in containers.",
    aliases: [{ name: "Docker Containers", isSynonym: false }]
  },
  // 6. Job Titles
  {
    name: "Software Engineer",
    type: "JOB_TITLE" as const,
    description: "A professional who applies software engineering principles to design, develop, maintain, test, and evaluate software.",
    aliases: [
      { name: "Software Developer", isSynonym: true },
      { name: "SWE", isSynonym: true },
      { name: "Fullstack Developer", isSynonym: true },
      { name: "Backend Developer", isSynonym: true },
      { name: "Frontend Developer", isSynonym: true }
    ]
  },
  // 7. Companies
  {
    name: "Google",
    type: "COMPANY" as const,
    description: "Alphabet subsidiary specializing in Internet-related services and products.",
    aliases: [{ name: "Alphabet", isSynonym: true }, { name: "Google LLC", isSynonym: false }]
  },
  // 8. Industries
  {
    name: "Information Technology",
    type: "INDUSTRY" as const,
    description: "The study or use of systems for storing, retrieving, and sending information.",
    aliases: [{ name: "IT", isSynonym: true }, { name: "Tech Industry", isSynonym: false }]
  },
  // 9. Locations
  {
    name: "United States",
    type: "COUNTRY" as const,
    description: "North American country spanning 50 states.",
    aliases: [{ name: "USA", isSynonym: true }, { name: "US", isSynonym: true }]
  },
  {
    name: "California",
    type: "STATE" as const,
    description: "Pacific coast state of the United States.",
    aliases: [{ name: "CA", isSynonym: true }]
  },
  {
    name: "San Francisco",
    type: "CITY" as const,
    description: "Major financial and cultural center in Northern California.",
    aliases: [{ name: "SF", isSynonym: true }, { name: "San Fran", isSynonym: true }]
  },
  // 10. Degree Types
  {
    name: "Bachelor of Science",
    type: "DEGREE_TYPE" as const,
    description: "Undergraduate degree awarded for completed courses in science or tech.",
    aliases: [{ name: "BS", isSynonym: true }, { name: "B.Sc.", isSynonym: true }]
  },
  // 11. Security Clearance
  {
    name: "Secret Clearance",
    type: "SECURITY_CLEARANCE" as const,
    description: "Level of security clearance allowing access to secret info.",
    aliases: [{ name: "Secret", isSynonym: true }]
  },
  // 12. Visa Status
  {
    name: "H1B Visa",
    type: "VISA_STATUS" as const,
    description: "US visa program allowing employers to employ foreign workers in specialty occupations.",
    aliases: [{ name: "H-1B", isSynonym: true }, { name: "H1B", isSynonym: true }]
  },
  // 13. Notice Period
  {
    name: "Immediate",
    type: "NOTICE_PERIOD" as const,
    description: "Available to join immediately.",
    aliases: [{ name: "Immediate Joiner", isSynonym: true }, { name: "No Notice Period", isSynonym: true }]
  },
  // 14. Employment Types
  {
    name: "Full-Time",
    type: "EMPLOYMENT_TYPE" as const,
    description: "Standard full employment working hours.",
    aliases: [{ name: "FT", isSynonym: true }]
  },
  // 15. Universities
  {
    name: "Stanford University",
    type: "UNIVERSITY" as const,
    description: "Private research university in Stanford, California.",
    aliases: [{ name: "Stanford", isSynonym: true }]
  },
  // 16. Certifications
  {
    name: "AWS Certified Solutions Architect",
    type: "CERTIFICATION" as const,
    description: "AWS cloud solutions architect professional credential.",
    aliases: [{ name: "AWS Solutions Architect", isSynonym: true }, { name: "AWS SAA", isSynonym: true }]
  },
  // 17. Operating Systems
  {
    name: "Linux",
    type: "OPERATING_SYSTEM" as const,
    description: "Open-source Unix-like operating system kernel.",
    aliases: [{ name: "GNU/Linux", isSynonym: true }]
  },
  // 18. Technologies
  {
    name: "REST API",
    type: "TECHNOLOGY" as const,
    description: "Representational State Transfer application programming interface.",
    aliases: [{ name: "RESTful API", isSynonym: true }, { name: "REST Web Services", isSynonym: false }]
  },
  // 19. Skills
  {
    name: "Software Development",
    type: "SKILL" as const,
    description: "Process of conceiving, specifying, designing, programming, documenting, testing, and bug fixing.",
    aliases: [{ name: "Software Development Skill", isSynonym: false }]
  }
];

export async function seedBooleanSearch() {
  console.log("🌱 Starting Boolean Search Taxonomy seeding...");
  
  try {
    // Clear existing values in transaction
    await db.transaction(async (tx) => {
      await tx.delete(conceptAliases);
      await tx.delete(booleanConcepts);
    });

    console.log("🧹 Previous taxonomy data cleared.");

    for (const item of SEED_DATA) {
      const concept = await repository.createConcept(item);
      console.log(`✅ Seeded concept: [${item.type}] ${concept?.name} (${concept?.aliases.length} aliases)`);
    }

    console.log("🎉 Seeding completed successfully!");
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
  } finally {
    await pool.end();
  }
}
