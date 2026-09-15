import { pgEnum } from 'drizzle-orm/pg-core';

export const masterStatusEnum = pgEnum('master_status', [
  'ACTIVE',
  'INACTIVE',
]);