import { and, eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { categories } from '../../schema/master-data/categories.js';
import { products } from '../../schema/master-data/products.js';
import { units } from '../../schema/master-data/units.js';

const productSeedData = [
  {
    sku: 'PRD-RC-001',
    name: 'Rice Cooker',
    categoryName: 'Home Appliances',
    unitSymbol: 'PCS',
    minimumStock: '10',
    reorderPoint: '20',
    maximumStock: '50',
    description: 'Electric rice cooker.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-BL-001',
    name: 'Blender',
    categoryName: 'Home Appliances',
    unitSymbol: 'PCS',
    minimumStock: '10',
    reorderPoint: '20',
    maximumStock: '50',
    description: 'Electric blender for household use.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-FN-001',
    name: 'Fan',
    categoryName: 'Home Appliances',
    unitSymbol: 'PCS',
    minimumStock: '10',
    reorderPoint: '20',
    maximumStock: '50',
    description: 'Electric household fan.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-IR-001',
    name: 'Iron',
    categoryName: 'Home Appliances',
    unitSymbol: 'PCS',
    minimumStock: '10',
    reorderPoint: '20',
    maximumStock: '50',
    description: 'Electric clothes iron.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-DP-001',
    name: 'Dispenser',
    categoryName: 'Home Appliances',
    unitSymbol: 'PCS',
    minimumStock: '5',
    reorderPoint: '10',
    maximumStock: '30',
    description: 'Household water dispenser.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-LL-001',
    name: 'LED Lamp',
    categoryName: 'Electronics',
    unitSymbol: 'PCS',
    minimumStock: '20',
    reorderPoint: '40',
    maximumStock: '100',
    description: 'LED lighting product.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-CB-001',
    name: 'Cable',
    categoryName: 'Electrical Accessories',
    unitSymbol: 'ROLL',
    minimumStock: '10',
    reorderPoint: '20',
    maximumStock: '50',
    description: 'Electrical cable supplied by roll.',
    status: 'ACTIVE' as const,
  },
  {
    sku: 'PRD-SK-001',
    name: 'Socket',
    categoryName: 'Electrical Accessories',
    unitSymbol: 'PCS',
    minimumStock: '20',
    reorderPoint: '40',
    maximumStock: '100',
    description: 'Electrical wall socket.',
    status: 'ACTIVE' as const,
  },
];

export async function seedProducts(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const product of productSeedData) {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.sku, product.sku))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    const category = await db
      .select({
        id: categories.id,
      })
      .from(categories)
      .where(eq(categories.name, product.categoryName))
      .limit(1);

    if (category.length === 0) {
      throw new Error(
        `Category "${product.categoryName}" was not found.`,
      );
    }

    const unit = await db
      .select({
        id: units.id,
      })
      .from(units)
      .where(eq(units.symbol, product.unitSymbol))
      .limit(1);

    if (unit.length === 0) {
      throw new Error(
        `Unit "${product.unitSymbol}" was not found.`,
      );
    }

    await db.insert(products).values({
      sku: product.sku,
      barcode: null,
      name: product.name,
      categoryId: category[0].id,
      unitId: unit[0].id,
      minimumStock: product.minimumStock,
      reorderPoint: product.reorderPoint,
      maximumStock: product.maximumStock,
      description: product.description,
      status: product.status,
    });
  }
}