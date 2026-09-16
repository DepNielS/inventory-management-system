import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { categories } from '../../schema/master-data/categories.js';

const categorySeedData = [
  {
    name: 'Electronics',
    description: 'Electronic household products',
    status: 'ACTIVE' as const,
  },
  {
    name: 'Electrical Accessories',
    description: 'Electrical supporting products',
    status: 'ACTIVE' as const,
  },
  {
    name: 'Home Appliances',
    description: 'Household appliance products',
    status: 'ACTIVE' as const,
  },
];

export async function seedCategories(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const category of categorySeedData) {
    const existing = await db
      .select()
      .from(categories)
      .where(eq(categories.name, category.name))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(categories).values({
      name: category.name,
      description: category.description,
      status: category.status,
    });
  }
}