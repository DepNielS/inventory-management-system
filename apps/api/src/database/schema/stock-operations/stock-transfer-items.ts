import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stockTransfers } from './stock-transfers.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const stockTransferItems = pgTable(
  'stock_transfer_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    stockTransferId: uuid('stock_transfer_id')
      .notNull()
      .references(() => stockTransfers.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    sourceLocationId: uuid('source_location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    destinationLocationId: uuid('destination_location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    quantity: numeric('quantity', {
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
    stockTransferIdx: index(
      'stock_transfer_items_stock_transfer_id_idx',
    ).on(table.stockTransferId),

    productIdx: index('stock_transfer_items_product_id_idx').on(
      table.productId,
    ),

    sourceLocationIdx: index(
      'stock_transfer_items_source_location_id_idx',
    ).on(table.sourceLocationId),

    destinationLocationIdx: index(
      'stock_transfer_items_destination_location_id_idx',
    ).on(table.destinationLocationId),

    quantityCheck: check(
      'stock_transfer_items_quantity_check',
      sql`${table.quantity} > 0`,
    ),

    unitCostCheck: check(
      'stock_transfer_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);