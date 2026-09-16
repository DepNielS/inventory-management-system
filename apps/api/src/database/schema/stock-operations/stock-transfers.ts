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

export const stockTransferStatus = pgEnum('stock_transfer_status', [
  'DRAFT',
  'APPROVED',
  'IN_TRANSIT',
  'RECEIVED',
  'CANCELLED',
]);

export const stockTransfers = pgTable(
  'stock_transfers',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    transferNumber: text('transfer_number').notNull(),

    sourceWarehouseId: uuid('source_warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    destinationWarehouseId: uuid('destination_warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    transferDate: date('transfer_date').notNull(),

    status: stockTransferStatus('status').default('DRAFT').notNull(),

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

    receivedBy: uuid('received_by').references(() => users.id),

    receivedAt: timestamp('received_at', {
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
    transferNumberUnique: uniqueIndex(
      'stock_transfers_transfer_number_unique',
    ).on(table.transferNumber),

    sourceWarehouseIdx: index(
      'stock_transfers_source_warehouse_id_idx',
    ).on(table.sourceWarehouseId),

    destinationWarehouseIdx: index(
      'stock_transfers_destination_warehouse_id_idx',
    ).on(table.destinationWarehouseId),

    statusIdx: index('stock_transfers_status_idx').on(table.status),

    transferDateIdx: index('stock_transfers_transfer_date_idx').on(
      table.transferDate,
    ),

    createdByIdx: index('stock_transfers_created_by_idx').on(
      table.createdBy,
    ),

    approvedByIdx: index('stock_transfers_approved_by_idx').on(
      table.approvedBy,
    ),

    postedByIdx: index('stock_transfers_posted_by_idx').on(
      table.postedBy,
    ),

    receivedByIdx: index('stock_transfers_received_by_idx').on(
      table.receivedBy,
    ),
  }),
);
