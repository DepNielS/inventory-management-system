import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { roles } from '../../schema/identity/roles.js';

const roleSeedData = [
  {
    name: 'Admin',
    description: 'Full system access.',
  },
  {
    name: 'Purchasing Staff',
    description: 'Manage procurement activities.',
  },
  {
    name: 'Warehouse Staff',
    description: 'Perform operational warehouse activities.',
  },
  {
    name: 'Warehouse Manager',
    description: 'Approve and manage warehouse operations.',
  },
  {
    name: 'Management',
    description: 'View management information and reports.',
  },
];

export async function seedRoles(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const role of roleSeedData) {
    const existing = await db
      .select()
      .from(roles)
      .where(eq(roles.name, role.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(roles).values(role);
    }
  }
}