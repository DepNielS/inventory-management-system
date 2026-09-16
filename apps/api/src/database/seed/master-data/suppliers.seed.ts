import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { suppliers } from '../../schema/master-data/suppliers.js';

const supplierSeedData = [
  {
    code: 'SUP-001',
    name: 'PT Elektronik Nusantara',
    phone: '0711-555001',
    email: 'sales@elektroniknusantara.local',
    address: 'Jl. Industri No. 101, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'SUP-002',
    name: 'PT Sumber Perkakas Indonesia',
    phone: '0711-555002',
    email: 'sales@sumberperkakas.local',
    address: 'Jl. Distributor No. 202, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'SUP-003',
    name: 'CV Cahaya Listrik',
    phone: '0711-555003',
    email: 'sales@cahayalistrik.local',
    address: 'Jl. Listrik No. 303, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'SUP-004',
    name: 'PT Rumah Tangga Sejahtera',
    phone: '0711-555004',
    email: 'sales@rumahtangga.local',
    address: 'Jl. Peralatan Rumah Tangga No. 404, Palembang',
    status: 'ACTIVE' as const,
  },
];

export async function seedSuppliers(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const supplier of supplierSeedData) {
    const existing = await db
      .select()
      .from(suppliers)
      .where(eq(suppliers.code, supplier.code))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(suppliers).values({
      code: supplier.code,
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      status: supplier.status,
    });
  }
}