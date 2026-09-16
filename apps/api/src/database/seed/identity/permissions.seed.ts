import { eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { permissions } from '../../schema/identity/permissions.js';

const permissionSeedData = [
  {
    name: 'View Users',
    description: 'View users',
  },
  {
    name: 'Create Users',
    description: 'Create users',
  },
  {
    name: 'Update Users',
    description: 'Update users',
  },
  {
    name: 'Delete Users',
    description: 'Delete users',
  },
  {
    name: 'View Roles',
    description: 'View roles',
  },
  {
    name: 'Create Roles',
    description: 'Create roles',
  },
  {
    name: 'Update Roles',
    description: 'Update roles',
  },
  {
    name: 'Delete Roles',
    description: 'Delete roles',
  },
  {
    name: 'View Permissions',
    description: 'View permissions',
  },
  {
    name: 'View Categories',
    description: 'View categories',
  },
  {
    name: 'Create Categories',
    description: 'Create categories',
  },
  {
    name: 'Update Categories',
    description: 'Update categories',
  },
  {
    name: 'Delete Categories',
    description: 'Delete categories',
  },
  {
    name: 'View Units',
    description: 'View units',
  },
  {
    name: 'Create Units',
    description: 'Create units',
  },
  {
    name: 'Update Units',
    description: 'Update units',
  },
  {
    name: 'Delete Units',
    description: 'Delete units',
  },
  {
    name: 'View Products',
    description: 'View products',
  },
  {
    name: 'Create Products',
    description: 'Create products',
  },
  {
    name: 'Update Products',
    description: 'Update products',
  },
  {
    name: 'Delete Products',
    description: 'Delete products',
  },
  {
    name: 'View Suppliers',
    description: 'View suppliers',
  },
  {
    name: 'Create Suppliers',
    description: 'Create suppliers',
  },
  {
    name: 'Update Suppliers',
    description: 'Update suppliers',
  },
  {
    name: 'Delete Suppliers',
    description: 'Delete suppliers',
  },
  {
    name: 'View Customers',
    description: 'View customers',
  },
  {
    name: 'Create Customers',
    description: 'Create customers',
  },
  {
    name: 'Update Customers',
    description: 'Update customers',
  },
  {
    name: 'Delete Customers',
    description: 'Delete customers',
  },
  {
    name: 'View Warehouses',
    description: 'View warehouses',
  },
  {
    name: 'Create Warehouses',
    description: 'Create warehouses',
  },
  {
    name: 'Update Warehouses',
    description: 'Update warehouses',
  },
  {
    name: 'Delete Warehouses',
    description: 'Delete warehouses',
  },
  {
    name: 'View Warehouse Locations',
    description: 'View warehouse locations',
  },
  {
    name: 'Create Warehouse Locations',
    description: 'Create warehouse locations',
  },
  {
    name: 'Update Warehouse Locations',
    description: 'Update warehouse locations',
  },
  {
    name: 'Delete Warehouse Locations',
    description: 'Delete warehouse locations',
  },
  {
    name: 'View Purchase Orders',
    description: 'View purchase orders',
  },
  {
    name: 'Create Purchase Orders',
    description: 'Create purchase orders',
  },
  {
    name: 'Update Purchase Orders',
    description: 'Update purchase orders',
  },
  {
    name: 'Approve Purchase Orders',
    description: 'Approve purchase orders',
  },
  {
    name: 'Cancel Purchase Orders',
    description: 'Cancel purchase orders',
  },
  {
    name: 'View Goods Receipts',
    description: 'View goods receipts',
  },
  {
    name: 'Create Goods Receipts',
    description: 'Create goods receipts',
  },
  {
    name: 'Post Goods Receipts',
    description: 'Post goods receipts',
  },
  {
    name: 'Complete Goods Receipts',
    description: 'Complete goods receipts',
  },
  {
    name: 'View Sales Orders',
    description: 'View sales orders',
  },
  {
    name: 'Create Sales Orders',
    description: 'Create sales orders',
  },
  {
    name: 'Update Sales Orders',
    description: 'Update sales orders',
  },
  {
    name: 'Approve Sales Orders',
    description: 'Approve sales orders',
  },
  {
    name: 'View Stock Issues',
    description: 'View stock issues',
  },
  {
    name: 'Create Stock Issues',
    description: 'Create stock issues',
  },
  {
    name: 'Post Stock Issues',
    description: 'Post stock issues',
  },
  {
    name: 'Complete Stock Issues',
    description: 'Complete stock issues',
  },
  {
    name: 'View Inventory',
    description: 'View inventory',
  },
  {
    name: 'View Stock Transfers',
    description: 'View stock transfers',
  },
  {
    name: 'Create Stock Transfers',
    description: 'Create stock transfers',
  },
  {
    name: 'Approve Stock Transfers',
    description: 'Approve stock transfers',
  },
  {
    name: 'Post Stock Transfers',
    description: 'Post stock transfers',
  },
  {
    name: 'Receive Stock Transfers',
    description: 'Receive stock transfers',
  },
  {
    name: 'View Stock Moves',
    description: 'View stock moves',
  },
  {
    name: 'Create Stock Moves',
    description: 'Create stock moves',
  },
  {
    name: 'Post Stock Moves',
    description: 'Post stock moves',
  },
  {
    name: 'View Stock Adjustments',
    description: 'View stock adjustments',
  },
  {
    name: 'Create Stock Adjustments',
    description: 'Create stock adjustments',
  },
  {
    name: 'Approve Stock Adjustments',
    description: 'Approve stock adjustments',
  },
  {
    name: 'Post Stock Adjustments',
    description: 'Post stock adjustments',
  },
  {
    name: 'View Stock Opnames',
    description: 'View stock opnames',
  },
  {
    name: 'Create Stock Opnames',
    description: 'Create stock opnames',
  },
  {
    name: 'Complete Stock Opnames',
    description: 'Complete stock opnames',
  },
  {
    name: 'View Purchase Returns',
    description: 'View purchase returns',
  },
  {
    name: 'Create Purchase Returns',
    description: 'Create purchase returns',
  },
  {
    name: 'Approve Purchase Returns',
    description: 'Approve purchase returns',
  },
  {
    name: 'Post Purchase Returns',
    description: 'Post purchase returns',
  },
  {
    name: 'View Customer Returns',
    description: 'View customer returns',
  },
  {
    name: 'Create Customer Returns',
    description: 'Create customer returns',
  },
  {
    name: 'Approve Customer Returns',
    description: 'Approve customer returns',
  },
  {
    name: 'Post Customer Returns',
    description: 'Post customer returns',
  },
  {
    name: 'View Audit Logs',
    description: 'View audit logs',
  },
];

export async function seedPermissions(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const permission of permissionSeedData) {
    const existing = await db
      .select()
      .from(permissions)
      .where(eq(permissions.name, permission.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(permissions).values(permission);
    }
  }
}