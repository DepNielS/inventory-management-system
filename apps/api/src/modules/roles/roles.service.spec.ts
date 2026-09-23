import { describe, expect, it, vi } from 'vitest';

import { RolesService } from './roles.service.js';

describe('RolesService', () => {
  it('should return role names for a user', async () => {
    const resultRows = [
      { name: 'Admin' },
      { name: 'Warehouse Manager' },
    ];

    const where = vi.fn().mockResolvedValue(resultRows);

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

    const service = new RolesService(
      db as any,
    );

    const result =
      await service.getRoleNamesByUserId(
        'user-001',
      );

    expect(db.selectDistinct).toHaveBeenCalledWith({
      name: expect.anything(),
    });

    expect(result).toEqual([
      'Admin',
      'Warehouse Manager',
    ]);
  });
});