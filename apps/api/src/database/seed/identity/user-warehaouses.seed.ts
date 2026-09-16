import { and, eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { userWarehouses } from '../../schema/identity/user-warehouses.js';
import { users } from '../../schema/identity/users.js';
import { warehouses } from '../../schema/master-data/warehouses.js';

const userWarehouseSeedData = [
  {
    employeeCode: 'EMP-0001',
    warehouseCodes: ['WH-P01'],
  },
  {
    employeeCode: 'EMP-0002',
    warehouseCodes: ['WH-P01'],
  },
  {
    employeeCode: 'EMP-0003',
    warehouseCodes: ['WH-P01'],
  },
  {
    employeeCode: 'EMP-0004',
    warehouseCodes: ['WH-P01', 'WH-J01'],
  },
  {
    employeeCode: 'EMP-0005',
    warehouseCodes: ['WH-P01', 'WH-J01'],
  },
];

export async function seedUserWarehouses(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const assignment of userWarehouseSeedData) {
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

    for (const warehouseCode of assignment.warehouseCodes) {
      const warehouse = await db
        .select({
          id: warehouses.id,
        })
        .from(warehouses)
        .where(eq(warehouses.code, warehouseCode))
        .limit(1);

      if (warehouse.length === 0) {
        throw new Error(
          `Warehouse "${warehouseCode}" was not found.`,
        );
      }

      const existing = await db
        .select()
        .from(userWarehouses)
        .where(
          and(
            eq(userWarehouses.userId, user[0].id),
            eq(userWarehouses.warehouseId, warehouse[0].id),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        continue;
      }

      await db.insert(userWarehouses).values({
        userId: user[0].id,
        warehouseId: warehouse[0].id,
      });
    }
  }
}