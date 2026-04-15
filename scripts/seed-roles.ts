/**
 * Seed Role Settings - Tạo dữ liệu mẫu cho Vai trò
 * 
 * Script này tạo các vai trò mặc định trong bảng Setting
 * với key='role-settings', group='hrm'
 */

import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

// Danh sách permissions đầy đủ cho từng vai trò
const ADMIN_PERMISSIONS = [
  // Employees
  'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
  // Attendance & Leaves & Payroll
  'view_attendance', 'edit_attendance', 'approve_attendance',
  'view_leaves', 'create_leaves', 'approve_leaves',
  'view_payroll', 'create_payroll', 'approve_payroll',
  // Customers
  'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
  // Complaints
  'view_complaints', 'create_complaints', 'edit_complaints', 'resolve_complaints',
  // Suppliers
  'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
  // Products & Inventory
  'view_products', 'create_products', 'edit_products', 'delete_products',
  'view_inventory', 'create_inventory', 'edit_inventory', 'delete_inventory', 'approve_inventory',
  // Orders
  'view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'approve_orders',
  // Purchase Orders
  'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'delete_purchase_orders', 'approve_purchase_orders',
  // Warranty
  'view_warranty', 'create_warranty', 'edit_warranty', 'delete_warranty',
  // Vouchers
  'view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers', 'approve_vouchers',
  // Tasks & Wiki
  'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
  'view_wiki', 'create_wiki', 'edit_wiki', 'delete_wiki',
  // Reports & Settings
  'view_reports', 'export_reports',
  'view_settings', 'edit_settings', 'manage_roles', 'manage_permissions',
  // New permissions
  'view_shipments', 'create_shipments', 'edit_shipments', 'delete_shipments',
  'view_sales_returns', 'create_sales_returns', 'edit_sales_returns', 'delete_sales_returns', 'approve_sales_returns',
  'view_purchase_returns', 'create_purchase_returns', 'edit_purchase_returns', 'delete_purchase_returns', 'approve_purchase_returns',
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
]

const MANAGER_PERMISSIONS = [
  'view_employees', 'edit_employees',
  'view_attendance', 'approve_attendance',
  'view_leaves', 'approve_leaves',
  'view_payroll',
  'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
  'view_complaints', 'resolve_complaints',
  'view_suppliers', 'create_suppliers', 'edit_suppliers',
  'view_products', 'create_products', 'edit_products', 'delete_products',
  'view_orders', 'create_orders', 'edit_orders', 'approve_orders',
  'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'approve_purchase_orders',
  'view_inventory', 'create_inventory', 'edit_inventory', 'approve_inventory',
  'view_warranty', 'create_warranty', 'edit_warranty',
  'view_vouchers', 'create_vouchers', 'edit_vouchers', 'approve_vouchers',
  'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
  'view_wiki', 'create_wiki', 'edit_wiki',
  'view_reports', 'export_reports',
  'view_settings',
  'view_shipments', 'create_shipments', 'edit_shipments',
  'view_sales_returns', 'create_sales_returns', 'edit_sales_returns', 'approve_sales_returns',
  'view_purchase_returns', 'create_purchase_returns', 'edit_purchase_returns', 'approve_purchase_returns',
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
]

const SALES_PERMISSIONS = [
  'view_customers', 'create_customers', 'edit_customers',
  'view_complaints', 'create_complaints',
  'view_products',
  'view_orders', 'create_orders', 'edit_orders',
  'view_warranty', 'create_warranty',
  'view_tasks', 'create_tasks', 'edit_tasks',
  'view_wiki',
  'view_reports',
  'view_shipments', 'create_shipments',
  'view_sales_returns', 'create_sales_returns',
  'view_packaging', 'create_packaging',
  'view_dashboard', 'view_dashboard_sales',
]

const WAREHOUSE_PERMISSIONS = [
  'view_products', 'edit_products',
  'view_orders',
  'view_purchase_orders',
  'view_inventory', 'create_inventory', 'edit_inventory',
  'view_suppliers',
  'view_tasks', 'create_tasks', 'edit_tasks',
  'view_wiki',
  'view_shipments', 'create_shipments', 'edit_shipments',
  'view_purchase_returns', 'create_purchase_returns',
  'view_inventory_checks', 'create_inventory_checks', 'edit_inventory_checks',
  'view_stock_transfers', 'create_stock_transfers', 'edit_stock_transfers',
  'view_stock_locations',
  'view_packaging', 'create_packaging', 'edit_packaging',
  'view_dashboard', 'view_dashboard_inventory',
]

// Dữ liệu vai trò mẫu
const ROLE_SETTINGS = [
  {
    id: 'Admin',
    name: 'Quản trị viên',
    description: 'Toàn quyền hệ thống',
    permissions: ADMIN_PERMISSIONS,
    isDefault: true,
  },
  {
    id: 'Manager',
    name: 'Quản lý',
    description: 'Quản lý phòng ban',
    permissions: MANAGER_PERMISSIONS,
    isDefault: true,
  },
  {
    id: 'Sales',
    name: 'Kinh doanh',
    description: 'Nhân viên kinh doanh',
    permissions: SALES_PERMISSIONS,
    isDefault: true,
  },
  {
    id: 'Warehouse',
    name: 'Kho',
    description: 'Nhân viên kho',
    permissions: WAREHOUSE_PERMISSIONS,
    isDefault: true,
  },
]

async function seedRoles() {
  console.log('🌱 Bắt đầu seed dữ liệu vai trò...')

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    // Seed vai trò vào Setting table
    console.log('📝 Đang seed vai trò (roles)...')
    
    await prisma.setting.upsert({
      where: {
        key_group: {
          key: 'role-settings',
          group: 'hrm',
        },
      },
      update: {
        value: ROLE_SETTINGS,
        updatedAt: new Date(),
      },
      create: {
        systemId: crypto.randomUUID(),
        key: 'role-settings',
        group: 'hrm',
        type: 'json',
        category: 'hrm',
        value: ROLE_SETTINGS,
        description: 'Cài đặt vai trò và phân quyền',
      },
    })

    console.log(`  ✅ Roles: ${ROLE_SETTINGS.length} vai trò`)
    console.log('     - Admin: Quản trị viên (', ADMIN_PERMISSIONS.length, 'quyền)')
    console.log('     - Manager: Quản lý (', MANAGER_PERMISSIONS.length, 'quyền)')
    console.log('     - Sales: Kinh doanh (', SALES_PERMISSIONS.length, 'quyền)')
    console.log('     - Warehouse: Kho (', WAREHOUSE_PERMISSIONS.length, 'quyền)')

    console.log('✨ Seed vai trò hoàn tất!')
  } catch (error) {
    console.error('❌ Lỗi khi seed vai trò:', error)
    throw error
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

seedRoles().catch(console.error)
