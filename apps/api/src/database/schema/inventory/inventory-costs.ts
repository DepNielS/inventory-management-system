import {
  check,
  index,
  numeric,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { products } from '../master-data/products.js';
import { warehouses } from '../master-data/warehouses.js';

export const inventoryCosts = pgTable(
  'inventory_costs',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    quantity: numeric('quantity', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    averageUnitCost: numeric('average_unit_cost', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    totalValue: numeric('total_value', {
      precision: 18,
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
    warehouseProductUnique: uniqueIndex(
      'inventory_costs_warehouse_product_unique',
    ).on(table.warehouseId, table.productId),

    warehouseIdx: index('inventory_costs_warehouse_id_idx').on(
      table.warehouseId,
    ),

    productIdx: index('inventory_costs_product_id_idx').on(
      table.productId,
    ),

    quantityCheck: check(
      'inventory_costs_quantity_check',
      sql`${table.quantity} >= 0`,
    ),

    averageUnitCostCheck: check(
      'inventory_costs_average_unit_cost_check',
      sql`${table.averageUnitCost} >= 0`,
    ),

    totalValueCheck: check(
      'inventory_costs_total_value_check',
      sql`${table.totalValue} >= 0`,
    ),
  }),
);