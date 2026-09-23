import { describe, expect, it, vi } from 'vitest';

import { WarehouseScopeService } from './warehouse-scope.service.js';

describe('WarehouseScopeService', () => {
  it('should return warehouse ids assigned to a user', async () => {
    const resultRows = [
      {
        warehouseId: 'warehouse-palembang-id',
      },
      {
        warehouseId: 'warehouse-jambi-id',
      },
    ];

    const where = vi
      .fn()
      .mockResolvedValue(resultRows);

    const innerJoin = vi.fn(() => ({
      where,
    }));

    const from = vi.fn(() => ({
      innerJoin,
    }));

    const db = {
      selectDistinct: vi.fn(() => ({
        from,
      })),
    };

    const service = new WarehouseScopeService(
      db as any,
    );

    const result =
      await service.getWarehouseIdsByUserId(
        'user-001',
      );

    expect(result).toEqual([
      'warehouse-palembang-id',
      'warehouse-jambi-id',
    ]);
  });

  it('should return an empty array when user has no warehouse assignment', async () => {
    const where = vi
      .fn()
      .mockResolvedValue([]);

    const innerJoin = vi.fn(() => ({
      where,
    }));

    const from = vi.fn(() => ({
      innerJoin,
    }));

    const db = {
      selectDistinct: vi.fn(() => ({
        from,
      })),
    };

    const service = new WarehouseScopeService(
      db as any,
    );

    const result =
      await service.getWarehouseIdsByUserId(
        'user-without-warehouse',
      );

    expect(result).toEqual([]);
  });
});