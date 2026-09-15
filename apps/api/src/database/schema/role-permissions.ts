import { primaryKey, uuid, pgTable } from 'drizzle-orm/pg-core';
import { permissions } from './permissions.js';
import { roles } from './roles.js';

export const rolePermissions = pgTable(
  'role_permissions',
  {
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),

    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.roleId, table.permissionId],
      name: 'role_permissions_pk',
    }),
  }),
);