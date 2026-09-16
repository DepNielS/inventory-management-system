import { and, eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { warehouseLocations } from '../../schema/master-data/warehouse-locations.js';
import { warehouses } from '../../schema/master-data/warehouses.js';

const locationTypes = [
  {
    code: 'RECEIVING',
    name: 'Receiving',
    type: 'RECEIVING' as const,
  },
  {
    code: 'STORAGE',
    name: 'Storage',
    type: 'STORAGE' as const,
  },
  {
    code: 'PICKING',
    name: 'Picking',
    type: 'PICKING' as const,
  },
  {
    code: 'DAMAGED',
    name: 'Damaged',
    type: 'DAMAGED' as const,
  },
  {
    code: 'QUARANTINE',
    name: 'Quarantine',
    type: 'QUARANTINE' as const,
  },
  {
    code: 'SHIPPING',
    name: 'Shipping',
    type: 'SHIPPING' as const,
  },
];

const warehouseSeedCodes = ['WH-P01', 'WH-J01'];

export async function seedWarehouseLocations(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const warehouseCode of warehouseSeedCodes) {
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

    for (const location of locationTypes) {
      const existing = await db
        .select()
        .from(warehouseLocations)
        .where(
          and(
            eq(warehouseLocations.warehouseId, warehouse[0].id),
            eq(warehouseLocations.code, location.code),
          ),
        )
        .limit(1);

      if (existing.length > 0) {
        continue;
      }

      await db.insert(warehouseLocations).values({
        warehouseId: warehouse[0].id,
        parentId: null,
        code: location.code,
        name: location.name,
        type: location.type,
        status: 'ACTIVE',
      });
    }
  }
}