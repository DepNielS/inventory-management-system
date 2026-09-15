import {
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { masterStatusEnum } from './status.js';

export const suppliers = pgTable(
  'suppliers',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    code: text('code').notNull(),

    name: text('name').notNull(),

    phone: text('phone'),

    email: text('email'),

    address: text('address'),

    status: masterStatusEnum('status').default('ACTIVE').notNull(),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    deletedAt: timestamp('deleted_at', {
      withTimezone: true,
    }),
  },
  (table) => ({
    codeUnique: uniqueIndex('suppliers_code_unique').on(table.code),

    statusIdx: index('suppliers_status_idx').on(table.status),
  }),
);