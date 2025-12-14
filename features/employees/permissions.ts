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
  | 'manage_permissions'

  // Suppliers
  | 'view_suppliers'
  | 'create_suppliers'
  | 'edit_suppliers'
  | 'delete_suppliers'

  // Purchase Orders
  | 'view_purchase_orders'
  | 'create_purchase_orders'
  | 'edit_purchase_orders'
  | 'delete_purchase_orders'
  | 'approve_purchase_orders'

  // Attendance
  | 'view_attendance'
  | 'edit_attendance'
  | 'approve_attendance'

  // Leaves
  | 'view_leaves'
  | 'create_leaves'
  | 'approve_leaves'

  // Payroll
  | 'view_payroll'
  | 'create_payroll'
  | 'approve_payroll'

  // Warranty
  | 'view_warranty'
  | 'create_warranty'
  | 'edit_warranty'
  | 'delete_warranty'

  // Complaints
  | 'view_complaints'
  | 'create_complaints'
  | 'edit_complaints'
  | 'resolve_complaints'

  // Tasks
  | 'view_tasks'
  | 'create_tasks'
  | 'edit_tasks'
  | 'delete_tasks'

  // Wiki
  | 'view_wiki'
  | 'create_wiki'
  | 'edit_wiki'
  | 'delete_wiki'

  // Shipments (Giao hàng)
  | 'view_shipments'
  | 'create_shipments'
  | 'edit_shipments'
  | 'delete_shipments'

  // Sales Returns (Trả hàng bán)
  | 'view_sales_returns'
  | 'create_sales_returns'
  | 'edit_sales_returns'
  | 'delete_sales_returns'
  | 'approve_sales_returns'

  // Purchase Returns (Trả hàng mua)
  | 'view_purchase_returns'
  | 'create_purchase_returns'
  | 'edit_purchase_returns'
  | 'delete_purchase_returns'
  | 'approve_purchase_returns'

  // Inventory Checks (Kiểm kho)
  | 'view_inventory_checks'
  | 'create_inventory_checks'
  | 'edit_inventory_checks'
  | 'delete_inventory_checks'
  | 'approve_inventory_checks'

  // Stock Transfers (Chuyển kho)
  | 'view_stock_transfers'
  | 'create_stock_transfers'
  | 'edit_stock_transfers'
  | 'delete_stock_transfers'
  | 'approve_stock_transfers'

  // Stock Locations (Vị trí kho)
  | 'view_stock_locations'
  | 'create_stock_locations'
  | 'edit_stock_locations'
  | 'delete_stock_locations'

  // Cost Adjustments (Điều chỉnh giá vốn)
  | 'view_cost_adjustments'
  | 'create_cost_adjustments'
  | 'approve_cost_adjustments'

  // Reconciliation (Đối soát)
  | 'view_reconciliation'
  | 'create_reconciliation'
  | 'approve_reconciliation'

  // Packaging (Đóng gói)
  | 'view_packaging'
  | 'create_packaging'
  | 'edit_packaging'

  // Dashboard
  | 'view_dashboard'
  | 'view_dashboard_sales'
  | 'view_dashboard_inventory'
  | 'view_dashboard_hr'
  | 'view_dashboard_finance'

  // Audit Log
  | 'view_audit_log'
  | 'export_audit_log'

  // Branches (Chi nhánh)
  | 'view_branches'
  | 'create_branches'
  | 'edit_branches'
  | 'delete_branches'

  // Departments (Phòng ban)
  | 'view_departments'
  | 'create_departments'
  | 'edit_departments'
  | 'delete_departments';

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
  attendance: {
    label: 'Chấm công & Phép',
    permissions: [
      'view_attendance',
      'edit_attendance',
      'approve_attendance',
      'view_leaves',
      'create_leaves',
      'approve_leaves',
    ] as Permission[],
  },
  payroll: {
    label: 'Lương thưởng',
    permissions: [
      'view_payroll',
      'create_payroll',
      'approve_payroll',
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
  complaints: {
    label: 'Khiếu nại',
    permissions: [
      'view_complaints',
      'create_complaints',
      'edit_complaints',
      'resolve_complaints',
    ] as Permission[],
  },
  suppliers: {
    label: 'Nhà cung cấp',
    permissions: [
      'view_suppliers',
      'create_suppliers',
      'edit_suppliers',
      'delete_suppliers',
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
  purchase_orders: {
    label: 'Đơn mua hàng',
    permissions: [
      'view_purchase_orders',
      'create_purchase_orders',
      'edit_purchase_orders',
      'delete_purchase_orders',
      'approve_purchase_orders',
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
  warranty: {
    label: 'Bảo hành',
    permissions: [
      'view_warranty',
      'create_warranty',
      'edit_warranty',
      'delete_warranty',
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
  tasks: {
    label: 'Công việc',
    permissions: [
      'view_tasks',
      'create_tasks',
      'edit_tasks',
      'delete_tasks',
    ] as Permission[],
  },
  wiki: {
    label: 'Tài liệu (Wiki)',
    permissions: [
      'view_wiki',
      'create_wiki',
      'edit_wiki',
      'delete_wiki',
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
  shipments: {
    label: 'Giao hàng',
    permissions: [
      'view_shipments',
      'create_shipments',
      'edit_shipments',
      'delete_shipments',
    ] as Permission[],
  },
  sales_returns: {
    label: 'Trả hàng bán',
    permissions: [
      'view_sales_returns',
      'create_sales_returns',
      'edit_sales_returns',
      'delete_sales_returns',
      'approve_sales_returns',
    ] as Permission[],
  },
  purchase_returns: {
    label: 'Trả hàng mua',
    permissions: [
      'view_purchase_returns',
      'create_purchase_returns',
      'edit_purchase_returns',
      'delete_purchase_returns',
      'approve_purchase_returns',
    ] as Permission[],
  },
  inventory_checks: {
    label: 'Kiểm kho',
    permissions: [
      'view_inventory_checks',
      'create_inventory_checks',
      'edit_inventory_checks',
      'delete_inventory_checks',
      'approve_inventory_checks',
    ] as Permission[],
  },
  stock_transfers: {
    label: 'Chuyển kho',
    permissions: [
      'view_stock_transfers',
      'create_stock_transfers',
      'edit_stock_transfers',
      'delete_stock_transfers',
      'approve_stock_transfers',
    ] as Permission[],
  },
  stock_locations: {
    label: 'Vị trí kho',
    permissions: [
      'view_stock_locations',
      'create_stock_locations',
      'edit_stock_locations',
      'delete_stock_locations',
    ] as Permission[],
  },
  cost_adjustments: {
    label: 'Điều chỉnh giá vốn',
    permissions: [
      'view_cost_adjustments',
      'create_cost_adjustments',
      'approve_cost_adjustments',
    ] as Permission[],
  },
  reconciliation: {
    label: 'Đối soát',
    permissions: [
      'view_reconciliation',
      'create_reconciliation',
      'approve_reconciliation',
    ] as Permission[],
  },
  packaging: {
    label: 'Đóng gói',
    permissions: [
      'view_packaging',
      'create_packaging',
      'edit_packaging',
    ] as Permission[],
  },
  dashboard: {
    label: 'Dashboard',
    permissions: [
      'view_dashboard',
      'view_dashboard_sales',
      'view_dashboard_inventory',
      'view_dashboard_hr',
      'view_dashboard_finance',
    ] as Permission[],
  },
  audit_log: {
    label: 'Nhật ký hệ thống',
    permissions: [
      'view_audit_log',
      'export_audit_log',
    ] as Permission[],
  },
  branches: {
    label: 'Chi nhánh',
    permissions: [
      'view_branches',
      'create_branches',
      'edit_branches',
      'delete_branches',
    ] as Permission[],
  },
  departments: {
    label: 'Phòng ban',
    permissions: [
      'view_departments',
      'create_departments',
      'edit_departments',
      'delete_departments',
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
  
  // Attendance
  view_attendance: 'Xem chấm công',
  edit_attendance: 'Sửa chấm công',
  approve_attendance: 'Duyệt chấm công',
  
  // Leaves
  view_leaves: 'Xem nghỉ phép',
  create_leaves: 'Tạo đơn phép',
  approve_leaves: 'Duyệt đơn phép',
  
  // Payroll
  view_payroll: 'Xem bảng lương',
  create_payroll: 'Tạo bảng lương',
  approve_payroll: 'Duyệt bảng lương',

  // Customers
  view_customers: 'Xem khách hàng',
  create_customers: 'Thêm khách hàng',
  edit_customers: 'Sửa khách hàng',
  delete_customers: 'Xóa khách hàng',
  
  // Complaints
  view_complaints: 'Xem khiếu nại',
  create_complaints: 'Tạo khiếu nại',
  edit_complaints: 'Sửa khiếu nại',
  resolve_complaints: 'Xử lý khiếu nại',

  // Suppliers
  view_suppliers: 'Xem nhà cung cấp',
  create_suppliers: 'Thêm nhà cung cấp',
  edit_suppliers: 'Sửa nhà cung cấp',
  delete_suppliers: 'Xóa nhà cung cấp',

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
  
  // Purchase Orders
  view_purchase_orders: 'Xem đơn mua',
  create_purchase_orders: 'Tạo đơn mua',
  edit_purchase_orders: 'Sửa đơn mua',
  delete_purchase_orders: 'Xóa đơn mua',
  approve_purchase_orders: 'Duyệt đơn mua',

  // Inventory
  view_inventory: 'Xem kho',
  create_inventory: 'Nhập/xuất kho',
  edit_inventory: 'Sửa phiếu kho',
  delete_inventory: 'Xóa phiếu kho',
  approve_inventory: 'Duyệt phiếu kho',
  
  // Warranty
  view_warranty: 'Xem bảo hành',
  create_warranty: 'Tạo phiếu bảo hành',
  edit_warranty: 'Sửa phiếu bảo hành',
  delete_warranty: 'Xóa phiếu bảo hành',

  // Financial
  view_vouchers: 'Xem phiếu thu chi',
  create_vouchers: 'Tạo phiếu thu chi',
  edit_vouchers: 'Sửa phiếu thu chi',
  delete_vouchers: 'Xóa phiếu thu chi',
  approve_vouchers: 'Duyệt phiếu thu chi',
  
  // Tasks
  view_tasks: 'Xem công việc',
  create_tasks: 'Tạo công việc',
  edit_tasks: 'Sửa công việc',
  delete_tasks: 'Xóa công việc',

  // Wiki
  view_wiki: 'Xem tài liệu',
  create_wiki: 'Tạo tài liệu',
  edit_wiki: 'Sửa tài liệu',
  delete_wiki: 'Xóa tài liệu',

  // Reports
  view_reports: 'Xem báo cáo',
  export_reports: 'Xuất báo cáo',
  
  // Settings
  view_settings: 'Xem cài đặt',
  edit_settings: 'Sửa cài đặt',
  manage_roles: 'Quản lý vai trò',
  manage_permissions: 'Quản lý phân quyền',

  // Shipments
  view_shipments: 'Xem phiếu giao hàng',
  create_shipments: 'Tạo phiếu giao hàng',
  edit_shipments: 'Sửa phiếu giao hàng',
  delete_shipments: 'Xóa phiếu giao hàng',

  // Sales Returns
  view_sales_returns: 'Xem trả hàng bán',
  create_sales_returns: 'Tạo phiếu trả hàng bán',
  edit_sales_returns: 'Sửa phiếu trả hàng bán',
  delete_sales_returns: 'Xóa phiếu trả hàng bán',
  approve_sales_returns: 'Duyệt trả hàng bán',

  // Purchase Returns
  view_purchase_returns: 'Xem trả hàng mua',
  create_purchase_returns: 'Tạo phiếu trả hàng mua',
  edit_purchase_returns: 'Sửa phiếu trả hàng mua',
  delete_purchase_returns: 'Xóa phiếu trả hàng mua',
  approve_purchase_returns: 'Duyệt trả hàng mua',

  // Inventory Checks
  view_inventory_checks: 'Xem phiếu kiểm kho',
  create_inventory_checks: 'Tạo phiếu kiểm kho',
  edit_inventory_checks: 'Sửa phiếu kiểm kho',
  delete_inventory_checks: 'Xóa phiếu kiểm kho',
  approve_inventory_checks: 'Duyệt kiểm kho',

  // Stock Transfers
  view_stock_transfers: 'Xem phiếu chuyển kho',
  create_stock_transfers: 'Tạo phiếu chuyển kho',
  edit_stock_transfers: 'Sửa phiếu chuyển kho',
  delete_stock_transfers: 'Xóa phiếu chuyển kho',
  approve_stock_transfers: 'Duyệt chuyển kho',

  // Stock Locations
  view_stock_locations: 'Xem vị trí kho',
  create_stock_locations: 'Tạo vị trí kho',
  edit_stock_locations: 'Sửa vị trí kho',
  delete_stock_locations: 'Xóa vị trí kho',

  // Cost Adjustments
  view_cost_adjustments: 'Xem điều chỉnh giá vốn',
  create_cost_adjustments: 'Tạo điều chỉnh giá vốn',
  approve_cost_adjustments: 'Duyệt điều chỉnh giá vốn',

  // Reconciliation
  view_reconciliation: 'Xem đối soát',
  create_reconciliation: 'Tạo phiếu đối soát',
  approve_reconciliation: 'Duyệt đối soát',

  // Packaging
  view_packaging: 'Xem đóng gói',
  create_packaging: 'Tạo phiếu đóng gói',
  edit_packaging: 'Sửa phiếu đóng gói',

  // Dashboard
  view_dashboard: 'Xem tổng quan',
  view_dashboard_sales: 'Xem báo cáo bán hàng',
  view_dashboard_inventory: 'Xem báo cáo kho',
  view_dashboard_hr: 'Xem báo cáo nhân sự',
  view_dashboard_finance: 'Xem báo cáo tài chính',

  // Audit Log
  view_audit_log: 'Xem nhật ký hệ thống',
  export_audit_log: 'Xuất nhật ký hệ thống',

  // Branches
  view_branches: 'Xem chi nhánh',
  create_branches: 'Tạo chi nhánh',
  edit_branches: 'Sửa chi nhánh',
  delete_branches: 'Xóa chi nhánh',

  // Departments
  view_departments: 'Xem phòng ban',
  create_departments: 'Tạo phòng ban',
  edit_departments: 'Sửa phòng ban',
  delete_departments: 'Xóa phòng ban',
};

/**
 * Default permissions for each role
 */
export const DEFAULT_ROLE_PERMISSIONS: Record<EmployeeRole, Permission[]> = {
  Admin: [
    // Full access to everything
    'view_employees', 'create_employees', 'edit_employees', 'delete_employees',
    'view_attendance', 'edit_attendance', 'approve_attendance',
    'view_leaves', 'create_leaves', 'approve_leaves',
    'view_payroll', 'create_payroll', 'approve_payroll',
    'view_customers', 'create_customers', 'edit_customers', 'delete_customers',
    'view_complaints', 'create_complaints', 'edit_complaints', 'resolve_complaints',
    'view_suppliers', 'create_suppliers', 'edit_suppliers', 'delete_suppliers',
    'view_products', 'create_products', 'edit_products', 'delete_products',
    'view_orders', 'create_orders', 'edit_orders', 'delete_orders', 'approve_orders',
    'view_purchase_orders', 'create_purchase_orders', 'edit_purchase_orders', 'delete_purchase_orders', 'approve_purchase_orders',
    'view_inventory', 'create_inventory', 'edit_inventory', 'delete_inventory', 'approve_inventory',
    'view_warranty', 'create_warranty', 'edit_warranty', 'delete_warranty',
    'view_vouchers', 'create_vouchers', 'edit_vouchers', 'delete_vouchers', 'approve_vouchers',
    'view_tasks', 'create_tasks', 'edit_tasks', 'delete_tasks',
    'view_wiki', 'create_wiki', 'edit_wiki', 'delete_wiki',
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
  ],
  
  Manager: [
    // Can view and manage most things, approve transactions
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
    // New permissions for Manager
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
  ],
  
  Sales: [
    // Focus on customers and orders
    'view_customers', 'create_customers', 'edit_customers',
    'view_complaints', 'create_complaints',
    'view_products',
    'view_orders', 'create_orders', 'edit_orders',
    'view_warranty', 'create_warranty',
    'view_tasks', 'create_tasks', 'edit_tasks',
    'view_wiki',
    'view_reports',
    // New permissions for Sales
    'view_shipments', 'create_shipments',
    'view_sales_returns', 'create_sales_returns',
    'view_packaging', 'create_packaging',
    'view_dashboard', 'view_dashboard_sales',
  ],
  
  Warehouse: [
    // Focus on inventory and products
    'view_products', 'edit_products',
    'view_orders',
    'view_purchase_orders',
    'view_inventory', 'create_inventory', 'edit_inventory',
    'view_suppliers',
    'view_tasks', 'create_tasks', 'edit_tasks',
    'view_wiki',
    // New permissions for Warehouse
    'view_shipments', 'create_shipments', 'edit_shipments',
    'view_purchase_returns', 'create_purchase_returns',
    'view_inventory_checks', 'create_inventory_checks', 'edit_inventory_checks',
    'view_stock_transfers', 'create_stock_transfers', 'edit_stock_transfers',
    'view_stock_locations',
    'view_packaging', 'create_packaging', 'edit_packaging',
    'view_dashboard', 'view_dashboard_inventory',
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
