import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { customers } from '../../schema/master-data/customers.js';

const customerSeedData = [
  {
    code: 'CUS-001',
    name: 'PT Maju Bersama',
    phone: '0711-666001',
    email: 'purchasing@majubersama.local',
    address: 'Jl. Perdagangan No. 101, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'CUS-002',
    name: 'CV Sejahtera Abadi',
    phone: '0711-666002',
    email: 'purchasing@sejahteraabadi.local',
    address: 'Jl. Niaga No. 202, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'CUS-003',
    name: 'Toko Elektronik Jaya',
    phone: '0711-666003',
    email: 'toko@elektronikjaya.local',
    address: 'Jl. Elektronik No. 303, Palembang',
    status: 'ACTIVE' as const,
  },
  {
    code: 'CUS-004',
    name: 'PT Sumber Makmur',
    phone: '0711-666004',
    email: 'purchasing@sumbermakmur.local',
    address: 'Jl. Distribusi No. 404, Palembang',
    status: 'ACTIVE' as const,
  },
];

export async function seedCustomers(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const customer of customerSeedData) {
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.code, customer.code))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    await db.insert(customers).values({
      code: customer.code,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      status: customer.status,
    });
  }
}