import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const units = pgTable(
  'units',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    name: text('name').notNull(),

    symbol: text('symbol').notNull(),

    description: text('description'),

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
    nameUnique: uniqueIndex('units_name_unique').on(table.name),

    symbolUnique: uniqueIndex('units_symbol_unique').on(table.symbol),
  }),
);