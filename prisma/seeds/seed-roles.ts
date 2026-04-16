/**
 * Roles Seed
 * Seed data for RoleSetting table — 4 system roles with permissions
 * 
 * These roles mirror DEFAULT_ROLE_PERMISSIONS from features/employees/permissions.ts
 * and are used by the sidebar + auth context for permission resolution.
 * 
 * Run: npx tsx prisma/seeds/seed-roles.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

// ============================================================================
// System Roles — Matching DEFAULT_ROLE_PERMISSIONS
// ============================================================================
const systemRoles = [
  {
    systemId: 'role-admin',
    id: 'Admin',
    name: 'Quản trị viên',
    description: 'Toàn quyền quản lý hệ thống',
    isSystem: true,
    sortOrder: 1,
    permissions: [
      'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
      'view_attendance', 'edit_attendance', 'approve_attendance',
      'view_leaves', 'create_leaves', 'approve_leaves',
      'view_payroll', 'create_payroll', 'approve_payroll',
      'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
      'view_complaints', 'create_complaints', 'edit_complaints', 'resolve_complaints',
      'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
      'view_products', 'create_products', 'edit_products', 'delete_products', 'view_brands', 'view_categories',
      'view_orders', 'view_own_orders', 'create_orders', 'edit_orders', 'delete_orders', 'approve_orders', 'cancel_orders', 'pay_orders',
      'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'delete_purchase_orders', 'approve_purchase_orders',
      'view_inventory', 'create_inventory', 'edit_inventory', 'delete_inventory', 'approve_inventory',
      'view_warranty', 'create_warranty', 'edit_warranty', 'delete_warranty',
      'view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers', 'approve_vouchers',
      'view_receipts', 'create_receipts', 'edit_receipts', 'delete_receipts',
      'view_payments', 'create_payments', 'edit_payments', 'delete_payments',
      'view_tasks', 'manage_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks', 'approve_tasks',
      'view_wiki', 'create_wiki', 'edit_wiki', 'delete_wiki',
      'view_reports', 'export_reports',
      'view_settings', 'edit_settings', 'manage_roles', 'manage_permissions',
      'view_shipments', 'create_shipments', 'edit_shipments', 'delete_shipments',
      'view_sales_returns', 'create_sales_returns', 'edit_sales_returns', 'delete_sales_returns', 'approve_sales_returns',
      'view_purchase_returns', 'create_purchase_returns', 'edit_purchase_returns', 'delete_purchase_returns', 'approve_purchase_returns',
      'view_supplier_warranty', 'create_supplier_warranty', 'edit_supplier_warranty', 'delete_supplier_warranty', 'confirm_supplier_warranty',
      'view_inventory_checks', 'create_inventory_checks', 'edit_inventory_checks', 'delete_inventory_checks', 'approve_inventory_checks',
      'view_stock_transfers', 'create_stock_transfers', 'edit_stock_transfers', 'delete_stock_transfers', 'approve_stock_transfers',
      'view_stock_locations', 'create_stock_locations', 'edit_stock_locations', 'delete_stock_locations',
      'view_cost_adjustments', 'create_cost_adjustments', 'approve_cost_adjustments',
      'view_reconciliation', 'create_reconciliation', 'approve_reconciliation',
      'view_packaging', 'create_packaging', 'edit_packaging',
      'view_dashboard', 'view_dashboard_sales', 'view_dashboard_inventory', 'view_dashboard_hr', 'view_dashboard_finance',
      'view_audit_log', 'export_audit_log',
      'view_branches', 'create_branches', 'edit_branches', 'delete_branches',
      'view_departments', 'create_departments', 'edit_departments', 'delete_departments',
    ],
  },
  {
    systemId: 'role-manager',
    id: 'Manager',
    name: 'Quản lý',
    description: 'Quản lý phòng ban',
    isSystem: true,
    sortOrder: 2,
    permissions: [
      'view_employees', 'edit_employees',
      'view_attendance', 'approve_attendance',
      'view_leaves', 'approve_leaves',
      'view_payroll',
      'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
      'view_complaints', 'resolve_complaints',
      'view_suppliers', 'create_suppliers', 'edit_suppliers',
      'view_products', 'create_products', 'edit_products', 'delete_products', 'view_brands', 'view_categories',
      'view_orders', 'view_own_orders', 'create_orders', 'edit_orders', 'approve_orders', 'cancel_orders', 'pay_orders',
      'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'approve_purchase_orders',
      'view_inventory', 'create_inventory', 'edit_inventory', 'approve_inventory',
      'view_warranty', 'create_warranty', 'edit_warranty',
      'view_vouchers', 'create_vouchers', 'edit_vouchers', 'approve_vouchers',
      'view_receipts', 'create_receipts', 'edit_receipts',
      'view_payments', 'create_payments', 'edit_payments',
      'view_tasks', 'manage_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks', 'approve_tasks',
      'view_wiki', 'create_wiki', 'edit_wiki',
      'view_reports', 'export_reports',
      'view_settings',
      'view_shipments', 'create_shipments', 'edit_shipments',
      'view_sales_returns', 'create_sales_returns', 'edit_sales_returns', 'approve_sales_returns',
      'view_purchase_returns', 'create_purchase_returns', 'edit_purchase_returns', 'approve_purchase_returns',
      'view_supplier_warranty', 'create_supplier_warranty', 'edit_supplier_warranty', 'confirm_supplier_warranty',
      'view_inventory_checks', 'create_inventory_checks', 'edit_inventory_checks', 'approve_inventory_checks',
      'view_stock_transfers', 'create_stock_transfers', 'edit_stock_transfers', 'approve_stock_transfers',
      'view_stock_locations', 'create_stock_locations', 'edit_stock_locations',
      'view_cost_adjustments', 'create_cost_adjustments', 'approve_cost_adjustments',
      'view_reconciliation', 'create_reconciliation', 'approve_reconciliation',
      'view_packaging', 'create_packaging', 'edit_packaging',
      'view_dashboard', 'view_dashboard_sales', 'view_dashboard_inventory', 'view_dashboard_hr', 'view_dashboard_finance',
      'view_audit_log',
      'view_branches', 'edit_branches',
      'view_departments', 'edit_departments',
    ],
  },
  {
    systemId: 'role-sales',
    id: 'Sales',
    name: 'Kinh doanh',
    description: 'Nhân viên kinh doanh',
    isSystem: true,
    sortOrder: 3,
    permissions: [
      'view_customers', 'create_customers', 'edit_customers',
      'view_complaints', 'create_complaints',
      'view_products', 'view_brands', 'view_categories',
      'view_own_orders', 'create_orders', 'edit_orders', 'pay_orders',
      'view_warranty', 'create_warranty',
      'view_tasks',
      'view_wiki',
      'view_reports',
      'view_shipments', 'create_shipments',
      'view_sales_returns', 'create_sales_returns',
      'view_packaging', 'create_packaging',
    ],
  },
  {
    systemId: 'role-warehouse',
    id: 'Warehouse',
    name: 'Kho',
    description: 'Nhân viên kho',
    isSystem: true,
    sortOrder: 4,
    permissions: [
      'view_products',
      'view_orders',
      'view_purchase_orders',
      'view_inventory',
      'view_suppliers',
      'view_tasks',
      'view_wiki',
      'view_supplier_warranty',
      'view_warranty',
      'view_complaints',
    ],
  },
];

export async function seedRoles() {
  console.log('🔐 Seeding Role Settings...');

  for (const role of systemRoles) {
    await prisma.roleSetting.upsert({
      where: { id: role.id },
      update: {
        name: role.name,
        description: role.description,
        permissions: JSON.stringify(role.permissions),
        isSystem: role.isSystem,
        sortOrder: role.sortOrder,
      },
      create: {
        systemId: role.systemId,
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: JSON.stringify(role.permissions),
        isSystem: role.isSystem,
        isActive: true,
        sortOrder: role.sortOrder,
        createdBy: 'SYSTEM',
      },
    });
    console.log(`   ✅ Role: ${role.name} (${role.id}) — ${role.permissions.length} permissions`);
  }

  // Also seed the role-settings key in Settings table (used by some UI components)
  const roleSettingsValue = {
    roles: systemRoles.map(r => ({
      id: r.id,
      name: r.name,
      systemId: r.systemId,
      isDefault: true,
      description: r.description,
      permissions: r.permissions,
    })),
  };
  await prisma.setting.upsert({
    where: { key_group: { key: 'role-settings', group: 'hrm' } },
    update: { value: roleSettingsValue },
    create: {
      key: 'role-settings',
      value: roleSettingsValue,
      type: 'json',
      category: 'hrm',
      group: 'hrm',
    },
  });
  console.log('   ✅ Setting: role-settings (synced)');

  console.log('✅ Role Settings seeded!');
}

// Run if executed directly
import { pathToFileURL } from 'url';
const isMainModule = import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMainModule) {
  seedRoles()
    .catch((e) => {
      console.error('❌ Seed error:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
