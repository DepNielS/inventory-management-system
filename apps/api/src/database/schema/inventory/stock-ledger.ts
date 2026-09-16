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
import { products } from '../master-data/products.js';
import { warehouses } from '../master-data/warehouses.js';
import { warehouseLocations } from '../master-data/warehouse-locations.js';
import { users } from '../identity/users.js';

export const stockLedgerReferenceType = pgEnum(
  'stock_ledger_reference_type',
  [
    'GOODS_RECEIPT',
    'STOCK_ISSUE',
    'TRANSFER_OUT',
    'TRANSFER_IN',
    'ADJUSTMENT',
    'RETURN_IN',
    'RETURN_OUT',
    'INTERNAL_MOVE',
  ],
);

export const stockLedgerMovementType = pgEnum('stock_ledger_movement_type', [
  'IN',
  'OUT',
]);

export const stockLedger = pgTable(
  'stock_ledger',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    transactionNumber: uuid('transaction_number')
      .defaultRandom()
      .notNull(),

    referenceType: stockLedgerReferenceType('reference_type').notNull(),

    referenceId: uuid('reference_id').notNull(),

    movementType: stockLedgerMovementType('movement_type').notNull(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    locationId: uuid('location_id')
      .notNull()
      .references(() => warehouseLocations.id),

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
    }).notNull(),

    totalCost: numeric('total_cost', {
      precision: 18,
      scale: 2,
    }).notNull(),

    balanceBefore: numeric('balance_before', {
      precision: 14,
      scale: 2,
    }).notNull(),

    balanceAfter: numeric('balance_after', {
      precision: 14,
      scale: 2,
    }).notNull(),

    averageCostBefore: numeric('average_cost_before', {
      precision: 14,
      scale: 2,
    }).notNull(),

    averageCostAfter: numeric('average_cost_after', {
      precision: 14,
      scale: 2,
    }).notNull(),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    createdAt: timestamp('created_at', {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    transactionNumberIdx: index(
      'stock_ledger_transaction_number_idx',
    ).on(table.transactionNumber),

    referenceIdx: index('stock_ledger_reference_idx').on(
      table.referenceType,
      table.referenceId,
    ),

    warehouseIdx: index('stock_ledger_warehouse_id_idx').on(
      table.warehouseId,
    ),

    locationIdx: index('stock_ledger_location_id_idx').on(
      table.locationId,
    ),

    productIdx: index('stock_ledger_product_id_idx').on(table.productId),

    createdAtIdx: index('stock_ledger_created_at_idx').on(table.createdAt),

    quantityCheck: check(
      'stock_ledger_quantity_check',
      sql`${table.quantity} > 0`,
    ),

    unitCostCheck: check(
      'stock_ledger_unit_cost_check',
      sql`${table.unitCost} >= 0`,
    ),

    totalCostCheck: check(
      'stock_ledger_total_cost_check',
      sql`${table.totalCost} >= 0`,
    ),

    balanceBeforeCheck: check(
      'stock_ledger_balance_before_check',
      sql`${table.balanceBefore} >= 0`,
    ),

    balanceAfterCheck: check(
      'stock_ledger_balance_after_check',
      sql`${table.balanceAfter} >= 0`,
    ),

    averageCostBeforeCheck: check(
      'stock_ledger_average_cost_before_check',
      sql`${table.averageCostBefore} >= 0`,
    ),

    averageCostAfterCheck: check(
      'stock_ledger_average_cost_after_check',
      sql`${table.averageCostAfter} >= 0`,
    ),
  }),
);