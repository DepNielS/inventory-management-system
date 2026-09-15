import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { warehouses } from './warehouses.js';
import { masterStatusEnum } from './status.js';

export const warehouseLocationTypeEnum = pgEnum(
  'warehouse_location_type',
  [
    'RECEIVING',
    'STORAGE',
    'PICKING',
    'DAMAGED',
    'QUARANTINE',
    'SHIPPING',
  ],
);

export const warehouseLocations = pgTable(
  'warehouse_locations',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),

    parentId: uuid('parent_id'),

    code: text('code').notNull(),

    name: text('name').notNull(),

    type: warehouseLocationTypeEnum('type').notNull(),

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
    warehouseCodeUnique: uniqueIndex(
      'warehouse_locations_warehouse_code_unique',
    ).on(table.warehouseId, table.code),

    warehouseIdx: index('warehouse_locations_warehouse_id_idx').on(
      table.warehouseId,
    ),

    parentIdx: index('warehouse_locations_parent_id_idx').on(table.parentId),

    typeIdx: index('warehouse_locations_type_idx').on(table.type),

    statusIdx: index('warehouse_locations_status_idx').on(table.status),
  }),
);