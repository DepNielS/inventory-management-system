import { Test, TestingModule } from '@nestjs/testing';
import { sql } from 'drizzle-orm';
import { DATABASE } from '../src/database/database.module.js';
import { AppModule } from '../src/app.module.js';

describe('Database Connection (e2e)', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should connect to PostgreSQL through Drizzle', async () => {
    const db = module.get(DATABASE);

    const result = await db.execute(
      sql`SELECT current_database(), current_user`,
    );

    expect(result.rows).toHaveLength(1);

    expect(result.rows[0]).toMatchObject({
      current_database: 'inventory_management',
      current_user: 'inventory_user',
    });
  });
});