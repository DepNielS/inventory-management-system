import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';

import { createDatabaseClient } from '../database.client.js';
import { users } from '../schema/identity/users.js';
import { seedConfig } from './seed.config.js';

async function resetAdminPassword() {
  const { db, pool } = createDatabaseClient(seedConfig.databaseUrl);

  try {
    const employeeCode = 'EMP-0001';

    const passwordHash = await bcrypt.hash(
      seedConfig.adminPassword,
      12,
    );

    const updatedUsers = await db
      .update(users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.employeeCode, employeeCode))
      .returning({
        id: users.id,
        employeeCode: users.employeeCode,
        email: users.email,
      });

    if (updatedUsers.length === 0) {
      throw new Error(
        `User with employee code ${employeeCode} was not found.`,
      );
    }

    const admin = updatedUsers[0];

    console.log('Admin password reset successfully.');
    console.log(`Employee Code: ${admin.employeeCode}`);
    console.log(`Email: ${admin.email}`);
  } finally {
    await pool.end();
  }
}

resetAdminPassword().catch((error: unknown) => {
  console.error('Failed to reset admin password.');

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});