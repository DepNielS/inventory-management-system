import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { warehouses } from '../master-data/warehouses.js';
import { users } from '../identity/users.js';

export const stockOpnameStatus = pgEnum('stock_opname_status', [
  'DRAFT',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
]);

export const stockOpnames = pgTable(
  'stock_opnames',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    opnameNumber: text('opname_number').notNull(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    opnameDate: date('opname_date').notNull(),

    status: stockOpnameStatus('status').default('DRAFT').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    completedBy: uuid('completed_by').references(() => users.id),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

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
  },
  (table) => ({
    opnameNumberUnique: uniqueIndex(
      'stock_opnames_opname_number_unique',
    ).on(table.opnameNumber),

    warehouseIdx: index('stock_opnames_warehouse_id_idx').on(
      table.warehouseId,
    ),

    statusIdx: index('stock_opnames_status_idx').on(table.status),

    opnameDateIdx: index('stock_opnames_opname_date_idx').on(
      table.opnameDate,
    ),

    createdByIdx: index('stock_opnames_created_by_idx').on(
      table.createdBy,
    ),

    completedByIdx: index('stock_opnames_completed_by_idx').on(
      table.completedBy,
    ),
  }),
);