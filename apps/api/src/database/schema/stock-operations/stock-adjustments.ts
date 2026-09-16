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

export const stockAdjustmentStatus = pgEnum('stock_adjustment_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'POSTED',
  'CANCELLED',
]);

export const stockAdjustments = pgTable(
  'stock_adjustments',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    adjustmentNumber: text('adjustment_number').notNull(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    adjustmentDate: date('adjustment_date').notNull(),

    status: stockAdjustmentStatus('status').default('DRAFT').notNull(),

    reason: text('reason').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    approvedBy: uuid('approved_by').references(() => users.id),

    approvedAt: timestamp('approved_at', {
      withTimezone: true,
    }),

    postedBy: uuid('posted_by').references(() => users.id),

    postedAt: timestamp('posted_at', {
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
    adjustmentNumberUnique: uniqueIndex(
      'stock_adjustments_adjustment_number_unique',
    ).on(table.adjustmentNumber),

    warehouseIdx: index('stock_adjustments_warehouse_id_idx').on(
      table.warehouseId,
    ),

    statusIdx: index('stock_adjustments_status_idx').on(table.status),

    adjustmentDateIdx: index(
      'stock_adjustments_adjustment_date_idx',
    ).on(table.adjustmentDate),

    createdByIdx: index('stock_adjustments_created_by_idx').on(
      table.createdBy,
    ),

    approvedByIdx: index('stock_adjustments_approved_by_idx').on(
      table.approvedBy,
    ),

    postedByIdx: index('stock_adjustments_posted_by_idx').on(
      table.postedBy,
    ),
  }),
);