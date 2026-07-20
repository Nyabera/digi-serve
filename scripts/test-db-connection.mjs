import postgres from "postgres";

const databaseUrl = process.env.MIGRATION_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("MIGRATION_DATABASE_URL is missing.");
}

const sql = postgres(databaseUrl, {
  max: 1,
  prepare: false,
  connect_timeout: 10,
});

try {
  const [result] = await sql`
    select
      current_database() as database,
      current_user as database_user,
      now() as checked_at
  `;

  console.log("Database connection successful:");
  console.log(result);
} finally {
  await sql.end();
}