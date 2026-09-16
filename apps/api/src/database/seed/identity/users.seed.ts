import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { users } from '../../schema/identity/users.js';
import { seedConfig } from '../seed.config.js';

const userSeedData = [
  {
    employeeCode: 'EMP-0001',
    name: 'System Administrator',
    email: 'admin@sinar-distribusi.local',
    status: 'ACTIVE' as const,
  },
  {
    employeeCode: 'EMP-0002',
    name: 'Purchasing Staff',
    email: 'purchasing@sinar-distribusi.local',
    status: 'ACTIVE' as const,
  },
  {
    employeeCode: 'EMP-0003',
    name: 'Warehouse Staff Palembang',
    email: 'warehouse.palembang@sinar-distribusi.local',
    status: 'ACTIVE' as const,
  },
  {
    employeeCode: 'EMP-0004',
    name: 'Warehouse Manager',
    email: 'manager@sinar-distribusi.local',
    status: 'ACTIVE' as const,
  },
  {
    employeeCode: 'EMP-0005',
    name: 'Management',
    email: 'management@sinar-distribusi.local',
    status: 'ACTIVE' as const,
  },
];

export async function seedUsers(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  const passwordHash = await bcrypt.hash(
    seedConfig.adminPassword,
    12,
  );

  for (const user of userSeedData) {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.employeeCode, user.employeeCode))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(users).values({
      employeeCode: user.employeeCode,
      name: user.name,
      email: user.email,
      passwordHash,
      status: user.status,
    });
  }
}