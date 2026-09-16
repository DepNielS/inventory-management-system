import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  date,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { purchaseOrders } from './purchase-orders.js';
import { users } from '../identity/users.js';

export const goodsReceiptStatus = pgEnum('goods_receipt_status', [
  'DRAFT',
  'POSTED',
  'COMPLETED',
  'CANCELLED',
]);

export const goodsReceipts = pgTable(
  'goods_receipts',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    receiptNumber: text('receipt_number').notNull(),

    purchaseOrderId: uuid('purchase_order_id')
      .notNull()
      .references(() => purchaseOrders.id),

    receiptDate: date('receipt_date').notNull(),

    status: goodsReceiptStatus('status').default('DRAFT').notNull(),

    notes: text('notes'),

    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id),

    postedBy: uuid('posted_by').references(() => users.id),

    postedAt: timestamp('posted_at', {
      withTimezone: true,
    }),

    completedAt: timestamp('completed_at', {
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
    receiptNumberUnique: uniqueIndex(
      'goods_receipts_receipt_number_unique',
    ).on(table.receiptNumber),

    purchaseOrderIdx: index('goods_receipts_purchase_order_id_idx').on(
      table.purchaseOrderId,
    ),

    statusIdx: index('goods_receipts_status_idx').on(table.status),

    receiptDateIdx: index('goods_receipts_receipt_date_idx').on(
      table.receiptDate,
    ),

    createdByIdx: index('goods_receipts_created_by_idx').on(table.createdBy),

    postedByIdx: index('goods_receipts_posted_by_idx').on(table.postedBy),
  }),
);