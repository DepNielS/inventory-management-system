import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { warehouses } from '../../schema/master-data/warehouses.js';

const warehouseSeedData = [
  {
    code: 'WH-P01',
    name: 'Warehouse Palembang',
    address: 'Jl. Pergudangan No. 1, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'WH-J01',
    name: 'Warehouse Jambi',
    address: 'Jl. Pergudangan No. 1, Jambi',
    status: 'ACTIVE' as const,
  },
];

export async function seedWarehouses(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const warehouse of warehouseSeedData) {
    const existing = await db
      .select()
      .from(warehouses)
      .where(eq(warehouses.code, warehouse.code))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(warehouses).values({
      code: warehouse.code,
      name: warehouse.name,
      address: warehouse.address,
      status: warehouse.status,
    });
  }
}