import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { CanActivate, ExecutionContext } from '@nestjs/common';

import { PermissionsService } from '../../permissions/permissions.service.js';
import {
  PERMISSIONS_KEY,
} from '../../permissions/decorators/permissions.decorator.js';
import {
  ROLES_KEY,
} from '../decorators/roles.decorator.js';
import { RolesService } from '../roles.service.js';
import type { AuthenticatedUser } from '../../auth/types/authenticated-user.type.js';

interface AuthenticatedRequest {
  user?: AuthenticatedUser;
}

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles =
      this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      ) ?? [];

    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(
        PERMISSIONS_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      ) ?? [];

    if (
      requiredRoles.length === 0 &&
      requiredPermissions.length === 0
    ) {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Authentication is required.',
      );
    }

    const [roleNames, permissionNames] =
      await Promise.all([
        this.rolesService.getRoleNamesByUserId(
          user.id,
        ),
        this.permissionsService.getPermissionNamesByUserId(
          user.id,
        ),
      ]);

    const hasRequiredRole =
      requiredRoles.length === 0 ||
      requiredRoles.some((role) =>
        roleNames.includes(role),
      );

    const hasRequiredPermissions =
      requiredPermissions.length === 0 ||
      requiredPermissions.every((permission) =>
        permissionNames.includes(permission),
      );

    if (!hasRequiredRole || !hasRequiredPermissions) {
      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}