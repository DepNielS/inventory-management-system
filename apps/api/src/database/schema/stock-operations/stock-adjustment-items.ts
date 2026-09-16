import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stockAdjustments } from './stock-adjustments.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const stockAdjustmentItems = pgTable(
  'stock_adjustment_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    stockAdjustmentId: uuid('stock_adjustment_id')
      .notNull()
      .references(() => stockAdjustments.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    adjustmentQty: numeric('adjustment_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

    unitCost: numeric('unit_cost', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

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
    stockAdjustmentIdx: index(
      'stock_adjustment_items_stock_adjustment_id_idx',
    ).on(table.stockAdjustmentId),

    productIdx: index('stock_adjustment_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('stock_adjustment_items_location_id_idx').on(
      table.locationId,
    ),

    unitCostCheck: check(
      'stock_adjustment_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);