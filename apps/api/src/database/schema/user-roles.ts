import { primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { roles } from './roles.js';
import { users } from './users.js';

export const userRoles = pgTable(
  'user_roles',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),

    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.roleId],
      name: 'user_roles_pk',
    }),
  }),
);