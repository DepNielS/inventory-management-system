import { primaryKey, pgTable, uuid } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { warehouses } from '../master-data/warehouses.js';

export const userWarehouses = pgTable(
  'user_warehouses',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),

    warehouseId: uuid('warehouse_id')
      .notNull()
      .references(() => warehouses.id),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.userId, table.warehouseId],
      name: 'user_warehouses_pk',
    }),
  }),
);