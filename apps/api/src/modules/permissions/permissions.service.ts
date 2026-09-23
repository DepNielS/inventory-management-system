import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE } from '../../database/database.module.js';
import type { Database } from '../../database/database.transaction.js';
import { permissions } from '../../database/schema/identity/permissions.js';
import { rolePermissions } from '../../database/schema/identity/role-permissions.js';
import { userRoles } from '../../database/schema/identity/user-roles.js';

@Injectable()
export class PermissionsService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async getPermissionNamesByUserId(
    userId: string,
  ): Promise<string[]> {
    const result = await this.db
      .selectDistinct({
        name: permissions.name,
      })
      .from(userRoles)
      .innerJoin(
        rolePermissions,
        eq(
          userRoles.roleId,
          rolePermissions.roleId,
        ),
      )
      .innerJoin(
        permissions,
        eq(
          rolePermissions.permissionId,
          permissions.id,
        ),
      )
      .where(eq(userRoles.userId, userId));

    return result.map((permission) => permission.name);
  }
}