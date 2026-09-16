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
import { suppliers } from '../master-data/suppliers.js';
import { warehouses } from '../master-data/warehouses.js';
import { users } from '../identity/users.js';
import { goodsReceipts } from '../procurement/goods-receipts.js';

export const purchaseReturnStatus = pgEnum('purchase_return_status', [
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'POSTED',
  'CANCELLED',
]);

export const purchaseReturns = pgTable(
  'purchase_returns',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    returnNumber: text('return_number').notNull(),

    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    goodsReceiptId: uuid('goods_receipt_id')
      .notNull()
      .references(() => goodsReceipts.id),

    returnDate: date('return_date').notNull(),

    status: purchaseReturnStatus('status').default('DRAFT').notNull(),

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
      'purchase_returns_return_number_unique',
    ).on(table.returnNumber),

    supplierIdx: index('purchase_returns_supplier_id_idx').on(
      table.supplierId,
    ),

    warehouseIdx: index('purchase_returns_warehouse_id_idx').on(
      table.warehouseId,
    ),

    goodsReceiptIdx: index('purchase_returns_goods_receipt_id_idx').on(
      table.goodsReceiptId,
    ),

    statusIdx: index('purchase_returns_status_idx').on(table.status),

    returnDateIdx: index('purchase_returns_return_date_idx').on(
      table.returnDate,
    ),

    createdByIdx: index('purchase_returns_created_by_idx').on(
      table.createdBy,
    ),

    approvedByIdx: index('purchase_returns_approved_by_idx').on(
      table.approvedBy,
    ),

    postedByIdx: index('purchase_returns_posted_by_idx').on(
      table.postedBy,
    ),
  }),
);