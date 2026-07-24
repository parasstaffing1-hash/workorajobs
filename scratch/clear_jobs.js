import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const jobCount = await prisma.job.count();
    console.log(`Current jobs count in database: ${jobCount}`);
    if (jobCount > 0) {
      const deleted = await prisma.job.deleteMany({});
      console.log(`Successfully deleted ${deleted.count} jobs from database.`);
    } else {
      console.log("No jobs found in database.");
    }
  } catch (error) {
    console.log("Database connection note:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
