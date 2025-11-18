import type { EmployeeRole } from './roles.ts';

/**
 * Permission types for role-based access control
 */
export type Permission =
  // Employee Management
  | 'view_employees'
  | 'create_employees'
  | 'edit_employees'
  | 'delete_employees'
  
  // Customer Management
  | 'view_customers'
  | 'create_customers'
  | 'edit_customers'
  | 'delete_customers'
  
  // Product Management
  | 'view_products'
  | 'create_products'
  | 'edit_products'
  | 'delete_products'
  
  // Order Management
  | 'view_orders'
  | 'create_orders'
  | 'edit_orders'
  | 'delete_orders'
  | 'approve_orders'
  
  // Inventory Management
  | 'view_inventory'
  | 'create_inventory'
  | 'edit_inventory'
  | 'delete_inventory'
  | 'approve_inventory'
  
  // Financial
  | 'view_vouchers'
  | 'create_vouchers'
  | 'edit_vouchers'
  | 'delete_vouchers'
  | 'approve_vouchers'
  
  // Reports
  | 'view_reports'
  | 'export_reports'
  
  // Settings
  | 'view_settings'
  | 'edit_settings'
  | 'manage_roles'
  | 'manage_permissions';

/**
 * Permission groups for UI organization
 */
export const PERMISSION_GROUPS = {
  employees: {
    label: 'Nhân viên',
    permissions: [
      'view_employees',
      'create_employees',
      'edit_employees',
      'delete_employees',
    ] as Permission[],
  },
  customers: {
    label: 'Khách hàng',
    permissions: [
      'view_customers',
      'create_customers',
      'edit_customers',
      'delete_customers',
    ] as Permission[],
  },
  products: {
    label: 'Sản phẩm',
    permissions: [
      'view_products',
      'create_products',
      'edit_products',
      'delete_products',
    ] as Permission[],
  },
  orders: {
    label: 'Đơn hàng',
    permissions: [
      'view_orders',
      'create_orders',
      'edit_orders',
      'delete_orders',
      'approve_orders',
    ] as Permission[],
  },
  inventory: {
    label: 'Kho hàng',
    permissions: [
      'view_inventory',
      'create_inventory',
      'edit_inventory',
      'delete_inventory',
      'approve_inventory',
    ] as Permission[],
  },
  financial: {
    label: 'Tài chính',
    permissions: [
      'view_vouchers',
      'create_vouchers',
      'edit_vouchers',
      'delete_vouchers',
      'approve_vouchers',
    ] as Permission[],
  },
  reports: {
    label: 'Báo cáo',
    permissions: [
      'view_reports',
      'export_reports',
    ] as Permission[],
  },
  settings: {
    label: 'Cài đặt',
    permissions: [
      'view_settings',
      'edit_settings',
      'manage_roles',
      'manage_permissions',
    ] as Permission[],
  },
} as const;

/**
 * Permission labels for display
 */
export const PERMISSION_LABELS: Record<Permission, string> = {
  // Employees
  view_employees: 'Xem nhân viên',
  create_employees: 'Thêm nhân viên',
  edit_employees: 'Sửa nhân viên',
  delete_employees: 'Xóa nhân viên',
  
  // Customers
  view_customers: 'Xem khách hàng',
  create_customers: 'Thêm khách hàng',
  edit_customers: 'Sửa khách hàng',
  delete_customers: 'Xóa khách hàng',
  
  // Products
  view_products: 'Xem sản phẩm',
  create_products: 'Thêm sản phẩm',
  edit_products: 'Sửa sản phẩm',
  delete_products: 'Xóa sản phẩm',
  
  // Orders
  view_orders: 'Xem đơn hàng',
  create_orders: 'Tạo đơn hàng',
  edit_orders: 'Sửa đơn hàng',
  delete_orders: 'Xóa đơn hàng',
  approve_orders: 'Duyệt đơn hàng',
  
  // Inventory
  view_inventory: 'Xem kho',
  create_inventory: 'Nhập/xuất kho',
  edit_inventory: 'Sửa phiếu kho',
  delete_inventory: 'Xóa phiếu kho',
  approve_inventory: 'Duyệt phiếu kho',
  
  // Financial
  view_vouchers: 'Xem phiếu thu chi',
  create_vouchers: 'Tạo phiếu thu chi',
  edit_vouchers: 'Sửa phiếu thu chi',
  delete_vouchers: 'Xóa phiếu thu chi',
  approve_vouchers: 'Duyệt phiếu thu chi',
  
  // Reports
  view_reports: 'Xem báo cáo',
  export_reports: 'Xuất báo cáo',
  
  // Settings
  view_settings: 'Xem cài đặt',
  edit_settings: 'Sửa cài đặt',
  manage_roles: 'Quản lý vai trò',
  manage_permissions: 'Quản lý phân quyền',
};

/**
 * Default permissions for each role
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<EmployeeRole, Permission[]> = {
  Admin: [
    // Full access to everything
    'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
    'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
    'view_products', 'create_products', 'edit_products', 'delete_products',
    'view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'approve_orders',
    'view_inventory', 'create_inventory', 'edit_inventory', 'delete_inventory', 'approve_inventory',
    'view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers', 'approve_vouchers',
    'view_reports', 'export_reports',
    'view_settings', 'edit_settings', 'manage_roles', 'manage_permissions',
  ],
  
  Manager: [
    // Can view and manage most things, approve transactions
    'view_employees', 'edit_employees',
    'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
    'view_products', 'create_products', 'edit_products', 'delete_products',
    'view_orders', 'create_orders', 'edit_orders', 'approve_orders',
    'view_inventory', 'create_inventory', 'edit_inventory', 'approve_inventory',
    'view_vouchers', 'create_vouchers', 'edit_vouchers', 'approve_vouchers',
    'view_reports', 'export_reports',
    'view_settings',
  ],
  
  Sales: [
    // Focus on customers and orders
    'view_customers', 'create_customers', 'edit_customers',
    'view_products',
    'view_orders', 'create_orders', 'edit_orders',
    'view_reports',
  ],
  
  Warehouse: [
    // Focus on inventory and products
    'view_products', 'edit_products',
    'view_orders',
    'view_inventory', 'create_inventory', 'edit_inventory',
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: EmployeeRole, permission: Permission, customPermissions?: Permission[]): boolean {
  const permissions = customPermissions || DEFAULT_ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: EmployeeRole, customPermissions?: Permission[]): Permission[] {
  return customPermissions || DEFAULT_ROLE_PERMISSIONS[role];
}
