import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { purchaseOrders } from './purchase-orders.js';
import { products } from '../master-data/products.js';

export const purchaseOrderItems = pgTable(
  'purchase_order_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    purchaseOrderId: uuid('purchase_order_id')
      .notNull()
      .references(() => purchaseOrders.id),

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
    purchaseOrderIdx: index(
      'purchase_order_items_purchase_order_id_idx',
    ).on(table.purchaseOrderId),

    productIdx: index('purchase_order_items_product_id_idx').on(
      table.productId,
    ),

    orderedQtyCheck: check(
      'purchase_order_items_ordered_qty_check',
      sql`${table.orderedQty} > 0`,
    ),

    unitPriceCheck: check(
      'purchase_order_items_unit_price_check',
      sql`${table.unitPrice} >= 0`,
    ),
  }),
);