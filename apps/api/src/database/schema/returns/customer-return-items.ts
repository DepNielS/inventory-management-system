import {
  check,
  index,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { customerReturns } from './customer-returns.js';
import { salesOrderItems } from '../sales/sales-order-items.js';
import { products } from '../master-data/products.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';

export const customerReturnCondition = pgEnum(
  'customer_return_condition',
  ['AVAILABLE', 'DAMAGED', 'QUARANTINE'],
);

export const customerReturnItems = pgTable(
  'customer_return_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    customerReturnId: uuid('customer_return_id')
      .notNull()
      .references(() => customerReturns.id),

    salesOrderItemId: uuid('sales_order_item_id')
      .notNull()
      .references(() => salesOrderItems.id),

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

    condition: customerReturnCondition('condition')
      .default('AVAILABLE')
      .notNull(),

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
    customerReturnIdx: index(
      'customer_return_items_customer_return_id_idx',
    ).on(table.customerReturnId),

    salesOrderItemIdx: index(
      'customer_return_items_sales_order_item_id_idx',
    ).on(table.salesOrderItemId),

    productIdx: index('customer_return_items_product_id_idx').on(
      table.productId,
    ),

    locationIdx: index('customer_return_items_location_id_idx').on(
      table.locationId,
    ),

    conditionIdx: index('customer_return_items_condition_idx').on(
      table.condition,
    ),

    returnedQtyCheck: check(
      'customer_return_items_returned_qty_check',
      sql`${table.returnedQty} > 0`,
    ),

    unitCostCheck: check(
      'customer_return_items_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),
  }),
);