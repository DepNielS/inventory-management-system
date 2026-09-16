import {
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { products } from '../master-data/products.js';
import { warehouses } from '../master-data/warehouses.js';
import { users } from '../identity/users.js';

export const stockReservationStatus = pgEnum(
  'stock_reservation_status',
  ['ACTIVE', 'PARTIALLY_RELEASED', 'RELEASED'],
);

export const stockReservations = pgTable(
  'stock_reservations',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    referenceType: text('reference_type').notNull(),

    referenceId: uuid('reference_id').notNull(),

    reservedQty: numeric('reserved_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

    releasedQty: numeric('released_qty', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    status: stockReservationStatus('status').default('ACTIVE').notNull(),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

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
    warehouseIdx: index('stock_reservations_warehouse_id_idx').on(
      table.warehouseId,
    ),

    productIdx: index('stock_reservations_product_id_idx').on(
      table.productId,
    ),

    referenceIdx: index('stock_reservations_reference_idx').on(
      table.referenceType,
      table.referenceId,
    ),

    statusIdx: index('stock_reservations_status_idx').on(table.status),

    reservedQtyCheck: check(
      'stock_reservations_reserved_qty_check',
      sql`${table.reservedQty} > 0`,
    ),

    releasedQtyCheck: check(
      'stock_reservations_released_qty_check',
      sql`${table.releasedQty} >= 0`,
    ),

    releasedNotAboveReservedCheck: check(
      'stock_reservations_released_not_above_reserved_check',
      sql`${table.releasedQty} <= ${table.reservedQty}`,
    ),
  }),
);