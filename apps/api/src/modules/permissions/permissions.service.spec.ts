import { describe, expect, it, vi } from 'vitest';

import { PermissionsService } from './permissions.service.js';

describe('PermissionsService', () => {
  it('should return permission names for a user', async () => {
    const resultRows = [
      { name: 'user.read' },
      { name: 'product.read' },
    ];

    const where = vi.fn().mockResolvedValue(resultRows);

    const secondInnerJoin = vi.fn(() => ({
      where,
    }));

    const firstInnerJoin = vi.fn(() => ({
      innerJoin: secondInnerJoin,
    }));

    const from = vi.fn(() => ({
      innerJoin: firstInnerJoin,
    }));

    const db = {
      selectDistinct: vi.fn(() => ({
        from,
      })),
    };

    const service = new PermissionsService(
      db as any,
    );

    const result =
      await service.getPermissionNamesByUserId(
        'user-001',
      );

    expect(db.selectDistinct).toHaveBeenCalledWith({
      name: expect.anything(),
    });

    expect(result).toEqual([
      'user.read',
      'product.read',
    ]);
  });
});