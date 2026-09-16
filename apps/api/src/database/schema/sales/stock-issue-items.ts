import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { stockIssues } from './stock-issues.js';
import { salesOrderItems } from './sales-order-items.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const stockIssueItems = pgTable(
  'stock_issue_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    stockIssueId: uuid('stock_issue_id')
      .notNull()
      .references(() => stockIssues.id),

    salesOrderItemId: uuid('sales_order_item_id')
      .notNull()
      .references(() => salesOrderItems.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    issuedQty: numeric('issued_qty', {
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
    stockIssueIdx: index(
      'stock_issue_items_stock_issue_id_idx',
    ).on(table.stockIssueId),

    salesOrderItemIdx: index(
      'stock_issue_items_sales_order_item_id_idx',
    ).on(table.salesOrderItemId),

    productIdx: index('stock_issue_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('stock_issue_items_location_id_idx').on(
      table.locationId,
    ),

    issuedQtyCheck: check(
      'stock_issue_items_issued_qty_check',
      sql`${table.issuedQty} > 0`,
    ),

    unitCostCheck: check(
      'stock_issue_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);