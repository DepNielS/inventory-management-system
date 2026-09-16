import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { purchaseReturns } from './purchase-returns.js';
import { goodsReceiptItems } from '../procurement/goods-receipt-items.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const purchaseReturnItems = pgTable(
  'purchase_return_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    purchaseReturnId: uuid('purchase_return_id')
      .notNull()
      .references(() => purchaseReturns.id),

    goodsReceiptItemId: uuid('goods_receipt_item_id')
      .notNull()
      .references(() => goodsReceiptItems.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    returnedQty: numeric('returned_qty', {
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
    purchaseReturnIdx: index(
      'purchase_return_items_purchase_return_id_idx',
    ).on(table.purchaseReturnId),

    goodsReceiptItemIdx: index(
      'purchase_return_items_goods_receipt_item_id_idx',
    ).on(table.goodsReceiptItemId),

    productIdx: index('purchase_return_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('purchase_return_items_location_id_idx').on(
      table.locationId,
    ),

    returnedQtyCheck: check(
      'purchase_return_items_returned_qty_check',
      sql`${table.returnedQty} > 0`,
    ),

    unitCostCheck: check(
      'purchase_return_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);