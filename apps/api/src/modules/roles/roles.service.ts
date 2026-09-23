import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { DATABASE } from '../../database/database.module.js';
import type { Database } from '../../database/database.transaction.js';
import { roles } from '../../database/schema/identity/roles.js';
import { userRoles } from '../../database/schema/identity/user-roles.js';

@Injectable()
export class RolesService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async getRoleNamesByUserId(
    userId: string,
  ): Promise<string[]> {
    const result = await this.db
      .selectDistinct({
        name: roles.name,
      })
      .from(userRoles)
      .innerJoin(
        roles,
        eq(userRoles.roleId, roles.id),
      )
      .where(eq(userRoles.userId, userId));

    return result.map((role) => role.name);
  }
}