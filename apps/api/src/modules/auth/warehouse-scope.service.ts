import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE } from '../../database/database.module.js';
import type { Database } from '../../database/database.transaction.js';
import { userWarehouses } from '../../database/schema/identity/user-warehouses.js';
import { warehouses } from '../../database/schema/master-data/warehouses.js';

@Injectable()
export class WarehouseScopeService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async getWarehouseIdsByUserId(
    userId: string,
  ): Promise<string[]> {
    const result = await this.db
      .selectDistinct({
        warehouseId: userWarehouses.warehouseId,
      })
      .from(userWarehouses)
      .innerJoin(
        warehouses,
        eq(
          userWarehouses.warehouseId,
          warehouses.id,
        ),
      )
      .where(
        eq(userWarehouses.userId, userId),
      );

    return result.map(
      (warehouse) => warehouse.warehouseId,
    );
  }
}