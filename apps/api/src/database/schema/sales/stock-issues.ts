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
import { salesOrders } from './sales-orders.js';
import { users } from '../identity/users.js';

export const stockIssueStatus = pgEnum('stock_issue_status', [
  'DRAFT',
  'POSTED',
  'COMPLETED',
  'CANCELLED',
]);

export const stockIssues = pgTable(
  'stock_issues',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    issueNumber: text('issue_number').notNull(),

    salesOrderId: uuid('sales_order_id')
      .notNull()
      .references(() => salesOrders.id),

    issueDate: date('issue_date').notNull(),

    status: stockIssueStatus('status').default('DRAFT').notNull(),

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
    issueNumberUnique: uniqueIndex('stock_issues_issue_number_unique').on(
      table.issueNumber,
    ),

    salesOrderIdx: index('stock_issues_sales_order_id_idx').on(
      table.salesOrderId,
    ),

    statusIdx: index('stock_issues_status_idx').on(table.status),

    issueDateIdx: index('stock_issues_issue_date_idx').on(table.issueDate),

    createdByIdx: index('stock_issues_created_by_idx').on(table.createdBy),

    postedByIdx: index('stock_issues_posted_by_idx').on(table.postedBy),
  }),
);