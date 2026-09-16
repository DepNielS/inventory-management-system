import { and, eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { roles } from '../../schema/identity/roles.js';
import { userRoles } from '../../schema/identity/user-roles.js';
import { users } from '../../schema/identity/users.js';

const userRoleSeedData = [
  {
    employeeCode: 'EMP-0001',
    roleName: 'Admin',
  },
  {
    employeeCode: 'EMP-0002',
    roleName: 'Purchasing Staff',
  },
  {
    employeeCode: 'EMP-0003',
    roleName: 'Warehouse Staff',
  },
  {
    employeeCode: 'EMP-0004',
    roleName: 'Warehouse Manager',
  },
  {
    employeeCode: 'EMP-0005',
    roleName: 'Management',
  },
];

export async function seedUserRoles(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const assignment of userRoleSeedData) {
    const user = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.employeeCode, assignment.employeeCode))
      .limit(1);

    if (user.length === 0) {
      throw new Error(
        `User with employee code "${assignment.employeeCode}" was not found.`,
      );
    }

    const role = await db
      .select({
        id: roles.id,
      })
      .from(roles)
      .where(eq(roles.name, assignment.roleName))
      .limit(1);

    if (role.length === 0) {
      throw new Error(
        `Role "${assignment.roleName}" was not found.`,
      );
    }

    const existing = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, user[0].id),
          eq(userRoles.roleId, role[0].id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(userRoles).values({
      userId: user[0].id,
      roleId: role[0].id,
    });
  }
}