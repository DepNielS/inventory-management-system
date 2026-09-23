import {
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';

import { RbacGuard } from './rbac.guard.js';

function createExecutionContext(
  user?: {
    id: string;
    employeeCode: string;
    email: string;
  },
): ExecutionContext {
  const request = {
    user,
  };

  return {
    getHandler: vi.fn(),
    getClass: vi.fn(),
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

function createGuard(
  options: {
    requiredRoles?: string[];
    requiredPermissions?: string[];
    roleNames?: string[];
    permissionNames?: string[];
  } = {},
) {
  const reflector = {
    getAllAndOverride: vi
      .fn()
      .mockImplementation((key: string) => {
        if (key === 'roles') {
          return options.requiredRoles ?? [];
        }

        if (key === 'permissions') {
          return options.requiredPermissions ?? [];
        }

        return [];
      }),
  };

  const rolesService = {
    getRoleNamesByUserId: vi
      .fn()
      .mockResolvedValue(
        options.roleNames ?? [],
      ),
  };

  const permissionsService = {
    getPermissionNamesByUserId: vi
      .fn()
      .mockResolvedValue(
        options.permissionNames ?? [],
      ),
  };

  const guard = new RbacGuard(
    reflector as any,
    rolesService as any,
    permissionsService as any,
  );

  return {
    guard,
    rolesService,
    permissionsService,
  };
}

describe('RbacGuard', () => {
  const user = {
    id: 'user-001',
    employeeCode: 'EMP-0001',
    email: 'admin@sinar-distribusi.local',
  };

  it('should allow access when no RBAC metadata is defined', async () => {
    const { guard } = createGuard();

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should allow access when user has one of the required roles', async () => {
    const { guard } = createGuard({
      requiredRoles: [
        'Admin',
        'Warehouse Manager',
      ],
      roleNames: ['Admin'],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should reject access when user has none of the required roles', async () => {
    const { guard } = createGuard({
      requiredRoles: [
        'Admin',
        'Warehouse Manager',
      ],
      roleNames: ['Warehouse Staff'],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new ForbiddenException(
        'You do not have permission to perform this action.',
      ),
    );
  });

  it('should allow access when user has all required permissions', async () => {
    const { guard } = createGuard({
      requiredPermissions: [
        'product.read',
        'product.update',
      ],
      permissionNames: [
        'product.read',
        'product.update',
        'product.create',
      ],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should reject access when a required permission is missing', async () => {
    const { guard } = createGuard({
      requiredPermissions: [
        'product.read',
        'product.update',
      ],
      permissionNames: [
        'product.read',
      ],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new ForbiddenException(
        'You do not have permission to perform this action.',
      ),
    );
  });

  it('should require both role and permission when both are defined', async () => {
    const { guard } = createGuard({
      requiredRoles: ['Admin'],
      requiredPermissions: ['product.update'],
      roleNames: ['Admin'],
      permissionNames: ['product.update'],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).resolves.toBe(true);
  });

  it('should reject when role passes but permission fails', async () => {
    const { guard } = createGuard({
      requiredRoles: ['Admin'],
      requiredPermissions: ['product.update'],
      roleNames: ['Admin'],
      permissionNames: [],
    });

    const context = createExecutionContext(user);

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new ForbiddenException(
        'You do not have permission to perform this action.',
      ),
    );
  });

  it('should reject when authentication context is missing', async () => {
    const { guard } = createGuard({
      requiredRoles: ['Admin'],
    });

    const context = createExecutionContext();

    await expect(
      guard.canActivate(context),
    ).rejects.toThrowError(
      new UnauthorizedException(
        'Authentication is required.',
      ),
    );
  });
});