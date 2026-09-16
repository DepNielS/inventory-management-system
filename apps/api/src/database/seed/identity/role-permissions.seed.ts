import { and, eq } from 'drizzle-orm';
import type { createDatabaseClient } from '../../database.client.js';
import { permissions } from '../../schema/identity/permissions.js';
import { rolePermissions } from '../../schema/identity/role-permissions.js';
import { roles } from '../../schema/identity/roles.js';

const rolePermissionMap: Record<string, string[]> = {
  Admin: [
    'View Users',
    'Create Users',
    'Update Users',
    'Delete Users',
    'View Roles',
    'Create Roles',
    'Update Roles',
    'Delete Roles',
    'View Permissions',
    'View Categories',
    'Create Categories',
    'Update Categories',
    'Delete Categories',
    'View Units',
    'Create Units',
    'Update Units',
    'Delete Units',
    'View Products',
    'Create Products',
    'Update Products',
    'Delete Products',
    'View Suppliers',
    'Create Suppliers',
    'Update Suppliers',
    'Delete Suppliers',
    'View Customers',
    'Create Customers',
    'Update Customers',
    'Delete Customers',
    'View Warehouses',
    'Create Warehouses',
    'Update Warehouses',
    'Delete Warehouses',
    'View Warehouse Locations',
    'Create Warehouse Locations',
    'Update Warehouse Locations',
    'Delete Warehouse Locations',
    'View Purchase Orders',
    'Create Purchase Orders',
    'Update Purchase Orders',
    'Approve Purchase Orders',
    'Cancel Purchase Orders',
    'View Goods Receipts',
    'Create Goods Receipts',
    'Post Goods Receipts',
    'Complete Goods Receipts',
    'View Sales Orders',
    'Create Sales Orders',
    'Update Sales Orders',
    'Approve Sales Orders',
    'View Stock Issues',
    'Create Stock Issues',
    'Post Stock Issues',
    'Complete Stock Issues',
    'View Inventory',
    'View Stock Transfers',
    'Create Stock Transfers',
    'Approve Stock Transfers',
    'Post Stock Transfers',
    'Receive Stock Transfers',
    'View Stock Moves',
    'Create Stock Moves',
    'Post Stock Moves',
    'View Stock Adjustments',
    'Create Stock Adjustments',
    'Approve Stock Adjustments',
    'Post Stock Adjustments',
    'View Stock Opnames',
    'Create Stock Opnames',
    'Complete Stock Opnames',
    'View Purchase Returns',
    'Create Purchase Returns',
    'Approve Purchase Returns',
    'Post Purchase Returns',
    'View Customer Returns',
    'Create Customer Returns',
    'Approve Customer Returns',
    'Post Customer Returns',
    'View Audit Logs',
  ],

  'Purchasing Staff': [
    'View Suppliers',
    'Create Suppliers',
    'Update Suppliers',
    'View Purchase Orders',
    'Create Purchase Orders',
    'Update Purchase Orders',
    'View Goods Receipts',
    'Create Goods Receipts',
  ],

  'Warehouse Staff': [
    'View Products',
    'View Warehouses',
    'View Warehouse Locations',
    'View Inventory',
    'View Purchase Orders',
    'View Goods Receipts',
    'View Sales Orders',
    'View Stock Issues',
    'Create Stock Issues',
    'Post Stock Issues',
    'Complete Stock Issues',
    'View Stock Transfers',
    'Create Stock Transfers',
    'View Stock Moves',
    'Create Stock Moves',
    'View Stock Opnames',
    'Create Stock Opnames',
  ],

  'Warehouse Manager': [
    'View Products',
    'View Warehouses',
    'View Warehouse Locations',
    'View Inventory',
    'View Purchase Orders',
    'View Goods Receipts',
    'Post Goods Receipts',
    'Complete Goods Receipts',
    'View Sales Orders',
    'View Stock Issues',
    'Post Stock Issues',
    'Complete Stock Issues',
    'View Stock Transfers',
    'Create Stock Transfers',
    'Approve Stock Transfers',
    'Post Stock Transfers',
    'Receive Stock Transfers',
    'View Stock Moves',
    'Create Stock Moves',
    'Post Stock Moves',
    'View Stock Adjustments',
    'Create Stock Adjustments',
    'Approve Stock Adjustments',
    'Post Stock Adjustments',
    'View Stock Opnames',
    'Create Stock Opnames',
    'Complete Stock Opnames',
    'View Purchase Returns',
    'Create Purchase Returns',
    'Approve Purchase Returns',
    'Post Purchase Returns',
    'View Customer Returns',
    'Create Customer Returns',
    'Approve Customer Returns',
    'Post Customer Returns',
  ],

  Management: [
    'View Categories',
    'View Units',
    'View Products',
    'View Suppliers',
    'View Customers',
    'View Warehouses',
    'View Warehouse Locations',
    'View Purchase Orders',
    'View Goods Receipts',
    'View Sales Orders',
    'View Stock Issues',
    'View Inventory',
    'View Stock Transfers',
    'View Stock Moves',
    'View Stock Adjustments',
    'View Stock Opnames',
    'View Purchase Returns',
    'View Customer Returns',
    'View Audit Logs',
  ],
};

export async function seedRolePermissions(
  db: ReturnType<typeof createDatabaseClient>['db'],
) {
  for (const [roleName, permissionNames] of Object.entries(
    rolePermissionMap,
  )) {
    const roleResult = await db
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    const role = roleResult[0];

    if (!role) {
      throw new Error(`Role "${roleName}" was not found.`);
    }

    for (const permissionName of permissionNames) {
      const permissionResult = await db
        .select({ id: permissions.id })
        .from(permissions)
        .where(eq(permissions.name, permissionName))
        .limit(1);

      const permission = permissionResult[0];

      if (!permission) {
        throw new Error(
          `Permission "${permissionName}" was not found.`,
        );
      }

      const existing = await db
        .select()
        .from(rolePermissions)
        .where(
          and(
            eq(rolePermissions.roleId, role.id),
            eq(rolePermissions.permissionId, permission.id),
          ),
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(rolePermissions).values({
          roleId: role.id,
          permissionId: permission.id,
        });
      }
    }
  }
}