import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { units } from '../../schema/master-data/units.js';

const unitSeedData = [
  {
    name: 'Piece',
    symbol: 'PCS',
    description: 'Unit for individual products',
  },
  {
    name: 'Box',
    symbol: 'BOX',
    description: 'Unit for boxed products',
  },
  {
    name: 'Set',
    symbol: 'SET',
    description: 'Unit for product sets',
  },
  {
    name: 'Roll',
    symbol: 'ROLL',
    description: 'Unit for cable and roll-based products',
  },
];

export async function seedUnits(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const unit of unitSeedData) {
    const existing = await db
      .select()
      .from(units)
      .where(eq(units.symbol, unit.symbol))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(units).values({
      name: unit.name,
      symbol: unit.symbol,
      description: unit.description,
    });
  }
}