import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const migrationDatabaseUrl = process.env.MIGRATION_DATABASE_URL;

if (!migrationDatabaseUrl) {
  throw new Error("MIGRATION_DATABASE_URL is not configured.");
}

export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationDatabaseUrl,
  },
});