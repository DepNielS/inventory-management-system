import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { categories } from './categories.js';
import { masterStatusEnum } from './status.js';
import { units } from './units.js';

export const products = pgTable(
  'products',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    sku: text('sku').notNull(),

    barcode: text('barcode'),

    name: text('name').notNull(),

    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id),

    unitId: uuid('unit_id')
      .notNull()
      .references(() => units.id),

    minimumStock: numeric('minimum_stock', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    reorderPoint: numeric('reorder_point', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    maximumStock: numeric('maximum_stock', {
      precision: 14,
      scale: 2,
    })
      .notNull()
      .default('0'),

    description: text('description'),

    status: masterStatusEnum('status').default('ACTIVE').notNull(),

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

    deletedAt: timestamp('deleted_at', {
      withTimezone: true,
    }),
  },
  (table) => ({
    skuUnique: uniqueIndex('products_sku_unique').on(table.sku),

    barcodeUnique: uniqueIndex('products_barcode_unique').on(table.barcode),

    categoryIdx: index('products_category_id_idx').on(table.categoryId),

    unitIdx: index('products_unit_id_idx').on(table.unitId),

    statusIdx: index('products_status_idx').on(table.status),

    stockThresholdCheck: check(
      'products_stock_thresholds_check',
      sql`
        ${table.minimumStock} <= ${table.reorderPoint}
        AND ${table.reorderPoint} <= ${table.maximumStock}
      `,
    ),
  }),
);