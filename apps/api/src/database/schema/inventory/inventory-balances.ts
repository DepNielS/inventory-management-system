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
import { warehouses } from '../master-data/warehouses.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';
import { products } from '../master-data/products.js';

export const inventoryBalances = pgTable(
  'inventory_balances',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

    productId: uuid('product_id')
      .notNull()
      .references(() => products.id),

    physicalQty: numeric('physical_qty', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    reservedQty: numeric('reserved_qty', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    damagedQty: numeric('damaged_qty', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    quarantineQty: numeric('quarantine_qty', {
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
    warehouseLocationProductUnique: uniqueIndex(
      'inventory_balances_warehouse_location_product_unique',
    ).on(table.warehouseId, table.locationId, table.productId),

    warehouseIdx: index('inventory_balances_warehouse_id_idx').on(
      table.warehouseId,
    ),

    locationIdx: index('inventory_balances_location_id_idx').on(
      table.locationId,
    ),

    productIdx: index('inventory_balances_product_id_idx').on(
      table.productId,
    ),

    physicalQtyCheck: check(
      'inventory_balances_physical_qty_check',
      sql`${table.physicalQty} >= 0`,
    ),

    reservedQtyCheck: check(
      'inventory_balances_reserved_qty_check',
      sql`${table.reservedQty} >= 0`,
    ),

    damagedQtyCheck: check(
      'inventory_balances_damaged_qty_check',
      sql`${table.damagedQty} >= 0`,
    ),

    quarantineQtyCheck: check(
      'inventory_balances_quarantine_qty_check',
      sql`${table.quarantineQty} >= 0`,
    ),

    reservedNotAbovePhysicalCheck: check(
      'inventory_balances_reserved_not_above_physical_check',
      sql`${table.reservedQty} <= ${table.physicalQty}`,
    ),

    damagedNotAbovePhysicalCheck: check(
      'inventory_balances_damaged_not_above_physical_check',
      sql`${table.damagedQty} <= ${table.physicalQty}`,
    ),

    quarantineNotAbovePhysicalCheck: check(
      'inventory_balances_quarantine_not_above_physical_check',
      sql`${table.quarantineQty} <= ${table.physicalQty}`,
    ),
  }),
);