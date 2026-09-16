import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import {
  eq,
} from 'drizzle-orm';

import {
  DATABASE,
} from '../src/database/database.module.js';

import {
  DatabaseTransactionHelper,
} from '../src/database/database.transaction.js';

import {
  categories,
} from '../src/database/schema/master-data/categories.js';

import {
  AppModule,
} from '../src/app.module.js';

describe('Database Transaction (e2e)', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should rollback database changes when transaction fails', async () => {
    const db = module.get(DATABASE);

    const transactionHelper =
      module.get(DatabaseTransactionHelper);

    const testCategoryName =
      '__transaction_rollback_test__';

    const existingBefore =
      await db
        .select()
        .from(categories)
        .where(
          eq(
            categories.name,
            testCategoryName,
          ),
        );

    expect(existingBefore).toHaveLength(0);

    await expect(
      transactionHelper.run(async (tx) => {
        await tx.insert(categories).values({
          name: testCategoryName,
          description:
            'Temporary transaction rollback test',
          status: 'ACTIVE',
        });

        throw new Error(
          'Intentional rollback test failure.',
        );
      }),
    ).rejects.toThrow(
      'Database transaction failed.',
    );

    const existingAfter =
      await db
        .select()
        .from(categories)
        .where(
          eq(
            categories.name,
            testCategoryName,
          ),
        );

    expect(existingAfter).toHaveLength(0);
  });
  
  it('should commit database changes when transaction succeeds', async () => {
  const db = module.get(DATABASE);

  const transactionHelper =
    module.get(DatabaseTransactionHelper);

  const testCategoryName =
    '__transaction_commit_test__';

  const existingBefore =
    await db
      .select()
      .from(categories)
      .where(
        eq(
          categories.name,
          testCategoryName,
        ),
      );

  expect(existingBefore).toHaveLength(0);

  await transactionHelper.run(async (tx) => {
    await tx.insert(categories).values({
      name: testCategoryName,
      description:
        'Temporary transaction commit test',
      status: 'ACTIVE',
    });
  });

  const existingAfter =
    await db
      .select()
      .from(categories)
      .where(
        eq(
          categories.name,
          testCategoryName,
        ),
      );

    expect(existingAfter).toHaveLength(1);

    await db
        .delete(categories)
        .where(
        eq(
            categories.name,
            testCategoryName,
        ),
        );
    });
});
