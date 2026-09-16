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
import { salesOrders } from '../sales/sales-orders.js';

export const customerReturnStatus = pgEnum('customer_return_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'POSTED',
  'CANCELLED',
]);

export const customerReturns = pgTable(
  'customer_returns',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    returnNumber: text('return_number').notNull(),

    customerId: uuid('customer_id')
      .notNull()
      .references(() => customers.id),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    salesOrderId: uuid('sales_order_id')
      .notNull()
      .references(() => salesOrders.id),

    returnDate: date('return_date').notNull(),

    status: customerReturnStatus('status').default('DRAFT').notNull(),

    reason: text('reason').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    approvedBy: uuid('approved_by').references(() => users.id),

    approvedAt: timestamp('approved_at', {
      withTimezone: true,
    }),

    postedBy: uuid('posted_by').references(() => users.id),

    postedAt: timestamp('posted_at', {
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
    returnNumberUnique: uniqueIndex(
      'customer_returns_return_number_unique',
    ).on(table.returnNumber),

    customerIdx: index('customer_returns_customer_id_idx').on(
      table.customerId,
    ),

    warehouseIdx: index('customer_returns_warehouse_id_idx').on(
      table.warehouseId,
    ),

    salesOrderIdx: index('customer_returns_sales_order_id_idx').on(
      table.salesOrderId,
    ),

    statusIdx: index('customer_returns_status_idx').on(table.status),

    returnDateIdx: index('customer_returns_return_date_idx').on(
      table.returnDate,
    ),

    createdByIdx: index('customer_returns_created_by_idx').on(
      table.createdBy,
    ),

    approvedByIdx: index('customer_returns_approved_by_idx').on(
      table.approvedBy,
    ),

    postedByIdx: index('customer_returns_posted_by_idx').on(
      table.postedBy,
    ),
  }),
);