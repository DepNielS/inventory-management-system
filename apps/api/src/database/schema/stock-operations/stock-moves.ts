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
import { warehouseLocations } from '../master-data/warehouse-locations.js';
import { users } from '../identity/users.js';

export const stockMoveStatus = pgEnum('stock_move_status', [
  'DRAFT',
  'POSTED',
  'COMPLETED',
  'CANCELLED',
]);

export const stockMoves = pgTable(
  'stock_moves',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    moveNumber: text('move_number').notNull(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    sourceLocationId: uuid('source_location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    destinationLocationId: uuid('destination_location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    moveDate: date('move_date').notNull(),

    status: stockMoveStatus('status').default('DRAFT').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    postedBy: uuid('posted_by').references(() => users.id),

    postedAt: timestamp('posted_at', {
      withTimezone: true,
    }),

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
    moveNumberUnique: uniqueIndex('stock_moves_move_number_unique').on(
      table.moveNumber,
    ),

    warehouseIdx: index('stock_moves_warehouse_id_idx').on(
      table.warehouseId,
    ),

    sourceLocationIdx: index('stock_moves_source_location_id_idx').on(
      table.sourceLocationId,
    ),

    destinationLocationIdx: index(
      'stock_moves_destination_location_id_idx',
    ).on(table.destinationLocationId),

    statusIdx: index('stock_moves_status_idx').on(table.status),

    moveDateIdx: index('stock_moves_move_date_idx').on(table.moveDate),

    createdByIdx: index('stock_moves_created_by_idx').on(table.createdBy),

    postedByIdx: index('stock_moves_posted_by_idx').on(table.postedBy),
  }),
);