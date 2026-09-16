import { createDatabaseClient } from '../database.client.js';
import { seedConfig } from './seed.config.js';

async function main() {
  const { pool } = createDatabaseClient(seedConfig.databaseUrl);

  try {
    console.log('Starting database seed...');

    // Domain seeds will be executed here.

    console.log('Database seed completed successfully.');
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Database seed failed.');

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exit(1);
});