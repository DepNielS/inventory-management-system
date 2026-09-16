import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stockMoves } from './stock-moves.js';
import { products } from '../master-data/products.js';

export const stockMoveItems = pgTable(
  'stock_move_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    stockMoveId: uuid('stock_move_id')
      .notNull()
      .references(() => stockMoves.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

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
    stockMoveIdx: index('stock_move_items_stock_move_id_idx').on(
      table.stockMoveId,
    ),

    productIdx: index('stock_move_items_product_id_idx').on(
      table.productId,
    ),

    quantityCheck: check(
      'stock_move_items_quantity_check',
      sql`${table.quantity} > 0`,
    ),

    unitCostCheck: check(
      'stock_move_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);