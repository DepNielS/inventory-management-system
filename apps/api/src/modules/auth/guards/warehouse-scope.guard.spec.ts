import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { WarehouseScopeGuard } from './warehouse-scope.guard.js';

function createExecutionContext(options: {
  user?: {
    id: string;
    employeeCode: string;
    email: string;
  };
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}): ExecutionContext {
  const request = {
    user: options.user,
    params: options.params,
    body: options.body,
    query: options.query,
  };

  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

describe('WarehouseScopeGuard', () => {
  const user = {
    id: 'user-001',
    employeeCode: 'EMP-0001',
    email: 'admin@sinar-distribusi.local',
  };

  it('should allow user when requested warehouse is in scope', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi
        .fn()
        .mockResolvedValue([
          'warehouse-palembang-id',
          'warehouse-jambi-id',
        ]),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
      params: {
        warehouseId: 'warehouse-palembang-id',
      },
    });

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);

    expect(
      warehouseScopeService.getWarehouseIdsByUserId,
    ).toHaveBeenCalledWith(user.id);
  });

  it('should reject user when requested warehouse is outside scope', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi
        .fn()
        .mockResolvedValue([
          'warehouse-palembang-id',
        ]),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
      params: {
        warehouseId: 'warehouse-jambi-id',
      },
    });

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new ForbiddenException(
        'You do not have access to this warehouse.',
      ),
    );
  });

  it('should read warehouseId from request body', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi
        .fn()
        .mockResolvedValue([
          'warehouse-palembang-id',
        ]),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
      body: {
        warehouseId: 'warehouse-palembang-id',
      },
    });

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should read warehouseId from query', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi
        .fn()
        .mockResolvedValue([
          'warehouse-palembang-id',
        ]),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
      query: {
        warehouseId: 'warehouse-palembang-id',
      },
    });

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should reject request without warehouseId', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi.fn(),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
    });

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new BadRequestException(
        'warehouseId is required.',
      ),
    );

    expect(
      warehouseScopeService.getWarehouseIdsByUserId,
    ).not.toHaveBeenCalled();
  });

  it('should reject unauthenticated request', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi.fn(),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({});

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new UnauthorizedException(
        'Authentication is required.',
      ),
    );
  });

  it('should reject user with no warehouse assignments', async () => {
    const warehouseScopeService = {
      getWarehouseIdsByUserId: vi
        .fn()
        .mockResolvedValue([]),
    };

    const guard = new WarehouseScopeGuard(
      warehouseScopeService as any,
    );

    const context = createExecutionContext({
      user,
      params: {
        warehouseId: 'warehouse-palembang-id',
      },
    });

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new ForbiddenException(
        'You do not have access to this warehouse.',
      ),
    );
  });
});