import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { goodsReceipts } from './goods-receipt.js';
import { purchaseOrderItems } from './purchase-order-items.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const goodsReceiptItems = pgTable(
  'goods_receipt_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    goodsReceiptId: uuid('goods_receipt_id')
      .notNull()
      .references(() => goodsReceipts.id),

    purchaseOrderItemId: uuid('purchase_order_item_id')
      .notNull()
      .references(() => purchaseOrderItems.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    receivedQty: numeric('received_qty', {
      precision: 14,
      scale: 2,
    }).notNull(),

    unitCost: numeric('unit_cost', {
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
    goodsReceiptIdx: index(
      'goods_receipt_items_goods_receipt_id_idx',
    ).on(table.goodsReceiptId),

    purchaseOrderItemIdx: index(
      'goods_receipt_items_purchase_order_item_id_idx',
    ).on(table.purchaseOrderItemId),

    productIdx: index('goods_receipt_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('goods_receipt_items_location_id_idx').on(
      table.locationId,
    ),

    receivedQtyCheck: check(
      'goods_receipt_items_received_qty_check',
      sql`${table.receivedQty} > 0`,
    ),

    unitCostCheck: check(
      'goods_receipt_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);