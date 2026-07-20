import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not configured.");
}

const globalForDatabase = globalThis as unknown as {
  sqlClient?: ReturnType<typeof postgres>;
};

const sqlClient =
  globalForDatabase.sqlClient ??
  postgres(databaseUrl, {
    max: 1,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.sqlClient = sqlClient;
}

export const db = drizzle(sqlClient);
export { sqlClient };