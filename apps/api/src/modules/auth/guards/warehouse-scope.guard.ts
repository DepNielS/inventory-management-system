import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type {
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import type { AuthenticatedUser } from '../types/authenticated-user.type.js';
import { WarehouseScopeService } from '../warehouse-scope.service.js';

interface WarehouseScopedRequest {
  user?: AuthenticatedUser;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
}

@Injectable()
export class WarehouseScopeGuard implements CanActivate {
  constructor(
    private readonly warehouseScopeService: WarehouseScopeService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context
        .switchToHttp()
        .getRequest<WarehouseScopedRequest>();

    const user = request.user;

    if (!user) {
      throw new UnauthorizedException(
        'Authentication is required.',
      );
    }

    const warehouseId = this.extractWarehouseId(request);

    if (!warehouseId) {
      throw new BadRequestException(
        'warehouseId is required.',
      );
    }

    const warehouseIds =
      await this.warehouseScopeService.getWarehouseIdsByUserId(
        user.id,
      );

    if (!warehouseIds.includes(warehouseId)) {
      throw new ForbiddenException(
        'You do not have access to this warehouse.',
      );
    }

    return true;
  }

  private extractWarehouseId(
    request: WarehouseScopedRequest,
  ): string | undefined {
    const paramWarehouseId =
      this.readStringValue(
        request.params?.warehouseId,
      );

    if (paramWarehouseId) {
      return paramWarehouseId;
    }

    const bodyWarehouseId =
      this.readStringValue(
        request.body?.warehouseId,
      );

    if (bodyWarehouseId) {
      return bodyWarehouseId;
    }

    return this.readStringValue(
      request.query?.warehouseId,
    );
  }

  private readStringValue(
    value: unknown,
  ): string | undefined {
    return typeof value === 'string' &&
      value.trim().length > 0
      ? value.trim()
      : undefined;
  }
}