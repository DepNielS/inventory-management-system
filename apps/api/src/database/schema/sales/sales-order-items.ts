import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { salesOrders } from './sales-orders.js';
import { products } from '../master-data/products.js';

export const salesOrderItems = pgTable(
  'sales_order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    salesOrderId: uuid('sales_order_id')
      .notNull()
      .references(() => salesOrders.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    orderedQty: numeric('ordered_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

    unitPrice: numeric('unit_price', {
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
    salesOrderIdx: index(
      'sales_order_items_sales_order_id_idx',
    ).on(table.salesOrderId),

    productIdx: index('sales_order_items_product_id_idx').on(
      table.productId,
    ),

    orderedQtyCheck: check(
      'sales_order_items_ordered_qty_check',
      sql`${table.orderedQty} > 0`,
    ),

    unitPriceCheck: check(
      'sales_order_items_unit_price_check',
      sql`${table.unitPrice} >= 0`,
    ),
  }),
);