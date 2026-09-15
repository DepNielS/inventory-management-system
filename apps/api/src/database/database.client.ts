import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export function createDatabaseClient(databaseUrl: string) {
  const pool = new Pool({
    connectionString: databaseUrl,
  });

  const db = drizzle(pool);

  return {
    db,
    pool,
  };
}