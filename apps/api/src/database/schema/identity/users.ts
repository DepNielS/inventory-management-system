import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const userStatusEnum = pgEnum('user_status', [
  'ACTIVE',
  'INACTIVE',
]);

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),

    employeeCode: text('employee_code').notNull(),

    name: text('name').notNull(),

    email: text('email').notNull(),

    passwordHash: text('password_hash').notNull(),

    status: userStatusEnum('status').default('ACTIVE').notNull(),

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
    employeeCodeUnique: uniqueIndex('users_employee_code_unique').on(
      table.employeeCode,
    ),

    emailUnique: uniqueIndex('users_email_unique').on(table.email),
  }),
);