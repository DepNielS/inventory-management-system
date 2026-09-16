import {
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { customers } from '../master-data/customers.js';
import { warehouses } from '../master-data/warehouses.js';
import { users } from '../identity/users.js';

export const salesOrderStatus = pgEnum('sales_order_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'CANCELLED',
]);

export const salesOrders = pgTable(
  'sales_orders',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    soNumber: text('so_number').notNull(),

    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    orderDate: date('order_date').notNull(),

    requestedDate: date('requested_date'),

    status: salesOrderStatus('status').default('DRAFT').notNull(),

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
    soNumberUnique: uniqueIndex('sales_orders_so_number_unique').on(
      table.soNumber,
    ),

    customerIdx: index('sales_orders_customer_id_idx').on(
      table.customerId,
    ),

    warehouseIdx: index('sales_orders_warehouse_id_idx').on(
      table.warehouseId,
    ),

    statusIdx: index('sales_orders_status_idx').on(table.status),

    orderDateIdx: index('sales_orders_order_date_idx').on(table.orderDate),

    createdByIdx: index('sales_orders_created_by_idx').on(table.createdBy),

    approvedByIdx: index('sales_orders_approved_by_idx').on(
      table.approvedBy,
    ),
  }),
);