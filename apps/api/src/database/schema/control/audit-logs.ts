import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from '../identity/users.js';

export const auditAction = pgEnum('audit_action', [
  'CREATE',
  'UPDATE',
  'DELETE',
  'VIEW',
  'LOGIN',
  'LOGOUT',
  'APPROVE',
  'REJECT',
  'POST',
  'CANCEL',
  'RECEIVE',
  'TRANSFER',
  'ADJUST',
  'OPNAME',
]);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),

    action: auditAction('action').notNull(),

    module: text('module').notNull(),

    resourceType: text('resource_type').notNull(),

    resourceId: uuid('resource_id'),

    description: text('description'),

    oldData: jsonb('old_data'),

    newData: jsonb('new_data'),

    ipAddress: text('ip_address'),

    userAgent: text('user_agent'),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userIdx: index('audit_logs_user_id_idx').on(table.userId),

    actionIdx: index('audit_logs_action_idx').on(table.action),

    moduleIdx: index('audit_logs_module_idx').on(table.module),

    resourceIdx: index('audit_logs_resource_idx').on(
      table.resourceType,
      table.resourceId,
    ),

    createdAtIdx: index('audit_logs_created_at_idx').on(
      table.createdAt,
    ),
  }),
);