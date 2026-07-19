import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://workora:workora_password@localhost:5432/workora_jobs?schema=public",
});

export const db = drizzle({ client: pool });
