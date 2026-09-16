import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stockOpnames } from './stock-opnames.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const stockOpnameItems = pgTable(
  'stock_opname_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    stockOpnameId: uuid('stock_opname_id')
      .notNull()
      .references(() => stockOpnames.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    systemQty: numeric('system_qty', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    countedQty: numeric('counted_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

    differenceQty: numeric('difference_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

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
    stockOpnameIdx: index(
      'stock_opname_items_stock_opname_id_idx',
    ).on(table.stockOpnameId),

    productIdx: index('stock_opname_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('stock_opname_items_location_id_idx').on(
      table.locationId,
    ),

    systemQtyCheck: check(
      'stock_opname_items_system_qty_check',
      sql`${table.systemQty} >= 0`,
    ),

    countedQtyCheck: check(
      'stock_opname_items_counted_qty_check',
      sql`${table.countedQty} >= 0`,
    ),
  }),
);