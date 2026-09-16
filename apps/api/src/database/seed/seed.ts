import { createDatabaseClient } from '../database.client.js';

import { seedPermissions } from './identity/permissions.seed.js';
import { seedRoles } from './identity/roles.seed.js';
import { seedRolePermissions } from './identity/role-permissions.seed.js';
import { seedUsers } from './identity/users.seed.js';
import { seedUserRoles } from './identity/user-roles.seed.js';
import { seedUserWarehouses } from './identity/user-warehouses.seed.js';

import { seedCategories } from './master-data/categories.seed.js';
import { seedUnits } from './master-data/units.seed.js';
import { seedProducts } from './master-data/products.seed.js';
import { seedSuppliers } from './master-data/suppliers.seed.js';
import { seedCustomers } from './master-data/customers.seed.js';
import { seedWarehouses } from './master-data/warehouses.seed.js';
import { seedWarehouseLocations } from './master-data/warehouse-locations.seed.js';

import { seedConfig } from './seed.config.js';

async function main() {
  const { db, pool } = createDatabaseClient(seedConfig.databaseUrl);

  try {
    console.log('Starting database seed...');

    console.log('Seeding permissions...');
    await seedPermissions(db);

    console.log('Seeding roles...');
    await seedRoles(db);

    console.log('Seeding role permissions...');
    await seedRolePermissions(db);

    console.log('Seeding users...');
    await seedUsers(db);

    console.log('Seeding user roles...');
    await seedUserRoles(db);

    console.log('Seeding categories...');
    await seedCategories(db);

    console.log('Seeding units...');
    await seedUnits(db);

    console.log('Seeding products...');
    await seedProducts(db);

    console.log('Seeding suppliers...');
    await seedSuppliers(db);

    console.log('Seeding customers...');
    await seedCustomers(db);

    console.log('Seeding warehouses...');
    await seedWarehouses(db);

    console.log('Seeding warehouse locations...');
    await seedWarehouseLocations(db);

    console.log('Seeding user warehouses...');
    await seedUserWarehouses(db);

    console.log('Database seed completed successfully.');
  } catch (error: unknown) {
    console.error('Database seed failed.');

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error('Database seed failed unexpectedly.');

  if (error instanceof Error) {
    console.error(error.message);
    console.error(error.stack);
  } else {
    console.error(error);
  }

  process.exitCode = 1;
});