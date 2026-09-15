import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  date,
} from 'drizzle-orm/pg-core';
import { suppliers } from '../master-data/suppliers.js';
import { warehouses } from '../master-data/warehouses.js';
import { users } from '../identity/users.js';

export const purchaseOrderStatus = pgEnum('purchase_order_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'CANCELLED',
]);

export const purchaseOrders = pgTable(
  'purchase_orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    poNumber: text('po_number').notNull(),

    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    orderDate: date('order_date').notNull(),

    expectedDate: date('expected_date'),

    status: purchaseOrderStatus('status').default('DRAFT').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    approvedBy: uuid('approved_by').references(() => users.id),

    approvedAt: timestamp('approved_at', {
      withTimezone: true,
    }),

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
    poNumberUnique: uniqueIndex('purchase_orders_po_number_unique').on(
      table.poNumber,
    ),

    supplierIdx: index('purchase_orders_supplier_id_idx').on(
      table.supplierId,
    ),

    warehouseIdx: index('purchase_orders_warehouse_id_idx').on(
      table.warehouseId,
    ),

    statusIdx: index('purchase_orders_status_idx').on(table.status),

    orderDateIdx: index('purchase_orders_order_date_idx').on(table.orderDate),

    createdByIdx: index('purchase_orders_created_by_idx').on(table.createdBy),

    approvedByIdx: index('purchase_orders_approved_by_idx').on(
      table.approvedBy,
    ),
  }),
);