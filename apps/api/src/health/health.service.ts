import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { sql } from 'drizzle-orm';

import { DATABASE } from '../database/database.module.js';
import type { Database } from '../database/database.transaction.js';

@Injectable()
export class HealthService {
  constructor(
    @Inject(DATABASE)
    private readonly db: Database,
  ) {}

  async check() {
    try {
      await this.db.execute(sql`SELECT 1`);

      return {
        status: 'ok',
        database: 'up',
      };
    } catch {
      return {
        status: 'degraded',
        database: 'down',
      };
    }
  }
}