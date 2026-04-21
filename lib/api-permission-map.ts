/**
 * Centralized API Route → Permission Mapping
 * 
 * Maps URL patterns + HTTP methods to required permissions.
 * The Edge middleware uses this map to enforce permissions on ALL API routes.
 * 
 * DESIGN:
 * - Routes not in this map default to auth-only (backward compatible)
 * - Public/system routes are in SKIP_PERMISSION_ROUTES
 * - First matching pattern wins (more specific patterns first)
 * - Uses only permissions defined in Permission type (features/employees/permissions.ts)
 */

import type { Permission } from '@/features/employees/permissions'

export interface RoutePermission {
  pattern: RegExp
  methods: Partial<Record<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', Permission>>
}

/**
 * Permission routing table. Order matters — first match wins.
 */
export const API_PERMISSION_MAP: RoutePermission[] = [
  // ============================================
  // EMPLOYEES & ORG STRUCTURE
  // ============================================
  {
    pattern: /^employees\/(filter-options|deleted|stats)/,
    methods: { GET: 'view_employees' },
  },
  {
    pattern: /^employees\/bulk$/,
    methods: { POST: 'delete_employees' },
  },
  {
    pattern: /^employees\/[^/]+\/restore/,
    methods: { POST: 'edit_employees' },
  },
  {
    pattern: /^employees\/[^/]+\/permanent/,
    methods: { DELETE: 'delete_employees' },
  },
  {
    pattern: /^employees\/[^/]+$/,
    methods: { GET: 'view_employees', PUT: 'edit_employees', DELETE: 'delete_employees' },
  },
  {
    pattern: /^employees$/,
    methods: { GET: 'view_employees', POST: 'create_employees' },
  },
  // Employee types / job titles → employee permissions
  {
    pattern: /^employee-types\/[^/]+$/,
    methods: { GET: 'view_employees', PUT: 'edit_employees', DELETE: 'delete_employees' },
  },
  {
    pattern: /^employee-types$/,
    methods: { GET: 'view_employees', POST: 'create_employees' },
  },
  // Departments → department permissions
  {
    pattern: /^departments\/[^/]+$/,
    methods: { GET: 'view_departments', PUT: 'edit_departments', DELETE: 'delete_departments' },
  },
  {
    pattern: /^departments$/,
    methods: { GET: 'view_departments', POST: 'create_departments' },
  },
  {
    pattern: /^job-titles\/[^/]+$/,
    methods: { GET: 'view_employees', PUT: 'edit_employees', DELETE: 'delete_employees' },
  },
  {
    pattern: /^job-titles$/,
    methods: { GET: 'view_employees', POST: 'create_employees' },
  },

  // ============================================
  // EMPLOYEE DOCUMENTS (use employee permissions)
  // ============================================
  {
    pattern: /^employee-documents/,
    methods: { GET: 'view_employees', POST: 'edit_employees', PUT: 'edit_employees' },
  },
  {
    pattern: /^files\/employee\//,
    methods: { DELETE: 'delete_employees' },
  },

  // ============================================
  // EMPLOYEE PAYROLL PROFILES
  // ============================================
  {
    pattern: /^employee-payroll-profiles\/[^/]+$/,
    methods: { PATCH: 'create_payroll', DELETE: 'approve_payroll' },
  },
  {
    pattern: /^employee-payroll-profiles/,
    methods: { GET: 'view_payroll', POST: 'create_payroll' },
  },

  // ============================================
  // ATTENDANCE
  // ============================================
  {
    pattern: /^attendance\/bulk/,
    methods: { PATCH: 'edit_attendance' },
  },
  {
    pattern: /^attendance\/employee-summary/,
    methods: { GET: 'view_attendance' },
  },
  {
    pattern: /^attendance\/locks/,
    methods: { GET: 'view_attendance', POST: 'approve_attendance', DELETE: 'approve_attendance' },
  },
  {
    pattern: /^attendance\/[^/]+$/,
    methods: { GET: 'view_attendance', PUT: 'edit_attendance', DELETE: 'approve_attendance' },
  },
  {
    pattern: /^attendance$/,
    methods: { GET: 'view_attendance', POST: 'edit_attendance', PATCH: 'edit_attendance' },
  },

  // ============================================
  // LEAVE
  // ============================================
  {
    pattern: /^leaves\/batch/,
    methods: { POST: 'approve_leaves' },
  },
  {
    pattern: /^leaves\/[^/]+$/,
    methods: { GET: 'view_leaves', PATCH: 'approve_leaves', DELETE: 'approve_leaves' },
  },
  {
    pattern: /^leaves$/,
    methods: { GET: 'view_leaves', POST: 'create_leaves' },
  },

  // ============================================
  // PAYROLL
  // ============================================
  {
    pattern: /^payroll\/batch-with-results/,
    methods: { POST: 'approve_payroll' },
  },
  {
    pattern: /^payroll\/(employee-history|stats)/,
    methods: { GET: 'view_payroll' },
  },
  {
    pattern: /^payroll\/templates\/[^/]+$/,
    methods: { GET: 'view_payroll', PATCH: 'create_payroll', DELETE: 'approve_payroll' },
  },
  {
    pattern: /^payroll\/templates/,
    methods: { GET: 'view_payroll', POST: 'approve_payroll', PUT: 'approve_payroll' },
  },
  {
    pattern: /^payroll\/payslips\/[^/]+$/,
    methods: { GET: 'view_payroll', PATCH: 'create_payroll', DELETE: 'approve_payroll' },
  },
  {
    pattern: /^payroll\/payslips/,
    methods: { GET: 'view_payroll' },
  },
  {
    pattern: /^payroll\/[^/]+\/(status|cancel)/,
    methods: { PATCH: 'create_payroll', POST: 'create_payroll' },
  },
  {
    pattern: /^payroll\/[^/]+$/,
    methods: { GET: 'view_payroll', PUT: 'create_payroll', DELETE: 'approve_payroll' },
  },
  {
    pattern: /^payroll$/,
    methods: { GET: 'view_payroll', POST: 'create_payroll' },
  },

  // ============================================
  // PENALTIES (HR → employee permissions)
  // ============================================
  {
    pattern: /^penalt(ies|y-types)/,
    methods: { GET: 'view_employees', POST: 'edit_employees', PUT: 'edit_employees', PATCH: 'edit_employees', DELETE: 'delete_employees' },
  },

  // ============================================
  // CUSTOMERS
  // ============================================
  {
    pattern: /^customers\/(deleted|stats)/,
    methods: { GET: 'view_customers' },
  },
  {
    pattern: /^customers\/batch-import/,
    methods: { POST: 'create_customers' },
  },
  {
    pattern: /^customers\/[^/]+\/restore/,
    methods: { POST: 'edit_customers' },
  },
  {
    pattern: /^customers\/[^/]+\/permanent/,
    methods: { DELETE: 'delete_customers' },
  },
  {
    pattern: /^customers\/[^/]+$/,
    methods: { GET: 'view_customers', PUT: 'edit_customers', DELETE: 'delete_customers' },
  },
  {
    pattern: /^customers$/,
    methods: { GET: 'view_customers', POST: 'create_customers' },
  },
  {
    pattern: /^customer-(debt|sla)/,
    methods: { GET: 'view_customers', POST: 'edit_customers' },
  },

  // ============================================
  // PRODUCTS
  // ============================================
  {
    pattern: /^products\/(deleted|stats|linked|list|pkgx-mapping)/,
    methods: { GET: 'view_products' },
  },
  {
    pattern: /^products\/bulk/,
    methods: { POST: 'create_products' },
  },
  {
    pattern: /^products\/validate-stock/,
    methods: { POST: 'view_inventory' },
  },
  {
    pattern: /^products\/[^/]+\/inventory/,
    methods: { PATCH: 'edit_inventory' },
  },
  {
    pattern: /^products\/[^/]+\/permanent/,
    methods: { DELETE: 'delete_products' },
  },
  {
    pattern: /^products\/[^/]+\/restore/,
    methods: { POST: 'edit_products' },
  },
  {
    pattern: /^products\/[^/]+$/,
    methods: { GET: 'view_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^products$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // PRODUCT CONVERSIONS (Sản phẩm quy đổi)
  {
    pattern: /^product-conversions\/[^/]+$/,
    methods: { GET: 'view_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^product-conversions$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // PRODUCT BATCHES (Lô hàng - HSD)
  {
    pattern: /^product-batches\/[^/]+$/,
    methods: { GET: 'view_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^product-batches$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // PRODUCT SERIALS (IMEI/Serial tracking)
  {
    pattern: /^product-serials\/[^/]+$/,
    methods: { GET: 'view_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^product-serials$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // ============================================
  // BRANDS
  // ============================================
  {
    pattern: /^brands\/(deleted|bulk)/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },
  {
    pattern: /^brands\/[^/]+\/(permanent|restore)/,
    methods: { POST: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^brands\/[^/]+$/,
    methods: { GET: 'view_products', PUT: 'edit_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^brands$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // ============================================
  // CATEGORIES
  // ============================================
  {
    pattern: /^categories\/(deleted|bulk)/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },
  {
    pattern: /^categories\/[^/]+\/(permanent|restore)/,
    methods: { POST: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^categories\/[^/]+$/,
    methods: { GET: 'view_products', PUT: 'edit_products', PATCH: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^categories$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // ============================================
  // UNITS
  // ============================================
  {
    pattern: /^units\/[^/]+$/,
    methods: { GET: 'view_products', PUT: 'edit_products', DELETE: 'delete_products' },
  },
  {
    pattern: /^units$/,
    methods: { GET: 'view_products', POST: 'create_products' },
  },

  // ============================================
  // ORDERS
  // ============================================
  {
    pattern: /^orders\/cursor/,
    methods: { GET: 'view_orders' },
  },
  {
    pattern: /^orders\/cod-reconciliation/,
    methods: { POST: 'approve_orders' },
  },
  {
    pattern: /^orders\/[^/]+\/cancel$/,
    methods: { POST: 'cancel_orders' },
  },
  {
    pattern: /^orders\/[^/]+\/duplicate$/,
    methods: { POST: 'create_orders' },
  },
  {
    pattern: /^orders\/[^/]+\/(status|recalculate-status)$/,
    methods: { PATCH: 'edit_orders', POST: 'edit_orders' },
  },
  {
    pattern: /^orders\/[^/]+\/payments/,
    methods: { GET: 'view_orders', POST: 'pay_orders' },
  },
  {
    pattern: /^orders\/[^/]+\/packaging/,
    methods: { GET: 'view_packaging', POST: 'create_packaging', PATCH: 'edit_packaging' },
  },
  {
    pattern: /^orders\/[^/]+\/shipment/,
    methods: { GET: 'view_shipments', POST: 'create_shipments' },
  },
  {
    pattern: /^orders\/[^/]+$/,
    methods: { GET: 'view_orders', PUT: 'edit_orders', PATCH: 'edit_orders', DELETE: 'delete_orders' },
  },
  {
    pattern: /^orders$/,
    methods: { GET: 'view_orders', POST: 'create_orders' },
  },
  {
    pattern: /^packaging/,
    methods: { GET: 'view_packaging' },
  },

  // ============================================
  // SALES RETURNS
  // ============================================
  {
    pattern: /^sales-returns\/stats/,
    methods: { GET: 'view_sales_returns' },
  },
  {
    pattern: /^sales-returns\/[^/]+\/(receive|exchange)/,
    methods: { POST: 'edit_sales_returns' },
  },
  {
    pattern: /^sales-returns\/[^/]+$/,
    methods: { GET: 'view_sales_returns', PATCH: 'edit_sales_returns', DELETE: 'delete_sales_returns' },
  },
  {
    pattern: /^sales-returns$/,
    methods: { GET: 'view_sales_returns', POST: 'create_sales_returns' },
  },

  // ============================================
  // INVENTORY
  // ============================================
  {
    pattern: /^inventory-checks\/stats/,
    methods: { GET: 'view_inventory_checks' },
  },
  {
    pattern: /^inventory-checks\/[^/]+\/(balance|cancel)/,
    methods: { POST: 'edit_inventory_checks' },
  },
  {
    pattern: /^inventory-checks\/[^/]+$/,
    methods: { GET: 'view_inventory_checks', PATCH: 'edit_inventory_checks', DELETE: 'delete_inventory_checks' },
  },
  {
    pattern: /^inventory-checks$/,
    methods: { GET: 'view_inventory_checks', POST: 'create_inventory_checks' },
  },
  {
    pattern: /^inventory-receipts\/[^/]+$/,
    methods: { GET: 'view_inventory', PATCH: 'edit_inventory', DELETE: 'delete_inventory' },
  },
  {
    pattern: /^inventory-receipts$/,
    methods: { GET: 'view_inventory', POST: 'create_inventory' },
  },
  {
    pattern: /^inventory$/,
    methods: { GET: 'view_inventory', POST: 'create_inventory' },
  },
  // Stock locations
  {
    pattern: /^stock-locations\/[^/]+$/,
    methods: { GET: 'view_stock_locations', PUT: 'edit_stock_locations', DELETE: 'delete_stock_locations' },
  },
  {
    pattern: /^stock-locations$/,
    methods: { GET: 'view_stock_locations', POST: 'create_stock_locations' },
  },
  {
    pattern: /^storage-locations\/[^/]+$/,
    methods: { GET: 'view_stock_locations', PUT: 'edit_stock_locations', DELETE: 'delete_stock_locations' },
  },
  {
    pattern: /^storage-locations$/,
    methods: { GET: 'view_stock_locations', POST: 'create_stock_locations' },
  },
  // Stock history
  {
    pattern: /^stock-history/,
    methods: { GET: 'view_inventory', POST: 'create_inventory' },
  },
  // Stock transfers
  {
    pattern: /^stock-transfers\/stats/,
    methods: { GET: 'view_stock_transfers' },
  },
  {
    pattern: /^stock-transfers\/[^/]+\/(start|cancel|complete)$/,
    methods: { POST: 'edit_stock_transfers' },
  },
  {
    pattern: /^stock-transfers\/[^/]+$/,
    methods: { GET: 'view_stock_transfers', PATCH: 'edit_stock_transfers', DELETE: 'delete_stock_transfers' },
  },
  {
    pattern: /^stock-transfers$/,
    methods: { GET: 'view_stock_transfers', POST: 'create_stock_transfers' },
  },
  // Cost adjustments
  {
    pattern: /^cost-adjustments\/[^/]+\/(cancel|confirm)$/,
    methods: { POST: 'approve_cost_adjustments' },
  },
  {
    pattern: /^cost-adjustments\/[^/]+$/,
    methods: { GET: 'view_cost_adjustments', PATCH: 'create_cost_adjustments', DELETE: 'approve_cost_adjustments' },
  },
  {
    pattern: /^cost-adjustments$/,
    methods: { GET: 'view_cost_adjustments', POST: 'create_cost_adjustments' },
  },
  // Price adjustments (same family as cost adjustments)
  {
    pattern: /^price-adjustments\/[^/]+\/(cancel|confirm)$/,
    methods: { POST: 'approve_cost_adjustments' },
  },
  {
    pattern: /^price-adjustments\/[^/]+$/,
    methods: { GET: 'view_cost_adjustments', PATCH: 'create_cost_adjustments', DELETE: 'approve_cost_adjustments' },
  },
  {
    pattern: /^price-adjustments$/,
    methods: { GET: 'view_cost_adjustments', POST: 'create_cost_adjustments' },
  },

  // ============================================
  // PURCHASE ORDERS / RETURNS / SUPPLIERS
  // ============================================
  {
    pattern: /^ordered-products$/,
    methods: { GET: 'view_purchase_orders' },
  },
  {
    pattern: /^purchase-orders\/[^/]+\/(cancel|process-receipt)/,
    methods: { POST: 'edit_purchase_orders' },
  },
  {
    pattern: /^purchase-orders\/[^/]+$/,
    methods: { GET: 'view_purchase_orders', PUT: 'edit_purchase_orders', PATCH: 'edit_purchase_orders', DELETE: 'delete_purchase_orders' },
  },
  {
    pattern: /^purchase-orders$/,
    methods: { GET: 'view_purchase_orders', POST: 'create_purchase_orders' },
  },
  {
    pattern: /^purchase-returns\/stats/,
    methods: { GET: 'view_purchase_returns' },
  },
  {
    pattern: /^purchase-returns\/[^/]+\/process/,
    methods: { POST: 'edit_purchase_returns' },
  },
  {
    pattern: /^purchase-returns\/[^/]+$/,
    methods: { GET: 'view_purchase_returns', PATCH: 'edit_purchase_returns', DELETE: 'delete_purchase_returns' },
  },
  {
    pattern: /^purchase-returns$/,
    methods: { GET: 'view_purchase_returns', POST: 'create_purchase_returns' },
  },
  // Supplier Warranty (BH NCC)
  {
    pattern: /^supplier-warranties\/[^/]+$/,
    methods: { GET: 'view_supplier_warranty', PATCH: 'edit_supplier_warranty', DELETE: 'delete_supplier_warranty' },
  },
  {
    pattern: /^supplier-warranties$/,
    methods: { GET: 'view_supplier_warranty', POST: 'create_supplier_warranty' },
  },
  // Suppliers
  {
    pattern: /^suppliers\/deleted/,
    methods: { GET: 'view_suppliers' },
  },
  {
    pattern: /^suppliers\/[^/]+\/(restore|permanent)/,
    methods: { POST: 'edit_suppliers', DELETE: 'delete_suppliers' },
  },
  {
    pattern: /^suppliers\/[^/]+$/,
    methods: { GET: 'view_suppliers', PUT: 'edit_suppliers', PATCH: 'edit_suppliers', DELETE: 'delete_suppliers' },
  },
  {
    pattern: /^suppliers$/,
    methods: { GET: 'view_suppliers', POST: 'create_suppliers' },
  },

  // ============================================
  // FINANCE (Cash, Payments, Receipts, Cashbook)
  // ============================================
  {
    pattern: /^cash-accounts\/balances/,
    methods: { GET: 'view_vouchers' },
  },
  {
    pattern: /^cash-accounts\/[^/]+\/set-default/,
    methods: { POST: 'approve_vouchers' },
  },
  {
    pattern: /^cash-accounts\/[^/]+$/,
    methods: { GET: 'view_vouchers', PUT: 'edit_vouchers', DELETE: 'delete_vouchers' },
  },
  {
    pattern: /^cash-accounts$/,
    methods: { GET: 'view_vouchers', POST: 'create_vouchers' },
  },
  {
    pattern: /^cash-transactions\/[^/]+$/,
    methods: { GET: 'view_vouchers', DELETE: 'delete_vouchers' },
  },
  {
    pattern: /^cash-transactions$/,
    methods: { GET: 'view_vouchers', POST: 'create_vouchers' },
  },
  {
    pattern: /^cashbook/,
    methods: { GET: 'view_vouchers' },
  },
  {
    pattern: /^payments\/[^/]+$/,
    methods: { GET: 'view_payments', PUT: 'edit_payments', DELETE: 'delete_payments' },
  },
  {
    pattern: /^payments$/,
    methods: { GET: 'view_payments', POST: 'create_payments' },
  },
  {
    pattern: /^receipts\/[^/]+$/,
    methods: { GET: 'view_receipts', PUT: 'edit_receipts', DELETE: 'delete_receipts' },
  },
  {
    pattern: /^receipts$/,
    methods: { GET: 'view_receipts', POST: 'create_receipts' },
  },
  {
    pattern: /^reconciliation-sheets\/available-shipments/,
    methods: { GET: 'view_reconciliation' },
  },
  {
    pattern: /^reconciliation-sheets\/[^/]+\/confirm/,
    methods: { POST: 'approve_reconciliation' },
  },
  {
    pattern: /^reconciliation-sheets\/[^/]+$/,
    methods: { GET: 'view_reconciliation', PUT: 'create_reconciliation', DELETE: 'create_reconciliation' },
  },
  {
    pattern: /^reconciliation-sheets$/,
    methods: { GET: 'view_reconciliation', POST: 'create_reconciliation' },
  },
  {
    pattern: /^reconciliation/,
    methods: { GET: 'view_reconciliation' },
  },

  // ============================================
  // COMPLAINTS
  // ============================================
  {
    pattern: /^complaints\/stats/,
    methods: { GET: 'view_complaints' },
  },
  {
    pattern: /^complaints\/[^/]+$/,
    methods: { GET: 'view_complaints', PUT: 'edit_complaints', DELETE: 'resolve_complaints' },
  },
  {
    pattern: /^complaints$/,
    methods: { GET: 'view_complaints', POST: 'create_complaints' },
  },
  {
    pattern: /^complaint-types/,
    methods: { GET: 'view_complaints', POST: 'resolve_complaints', PUT: 'resolve_complaints', DELETE: 'resolve_complaints' },
  },

  // ============================================
  // WARRANTIES
  // ============================================
  {
    pattern: /^warranties\/stats/,
    methods: { GET: 'view_warranty' },
  },
  {
    pattern: /^warranties\/[^/]+\/(complete|cancel)$/,
    methods: { POST: 'edit_warranty' },
  },
  {
    pattern: /^warranties\/[^/]+$/,
    methods: { GET: 'view_warranty', PUT: 'edit_warranty', PATCH: 'edit_warranty', DELETE: 'delete_warranty' },
  },
  {
    pattern: /^warranties$/,
    methods: { GET: 'view_warranty', POST: 'create_warranty' },
  },

  // ============================================
  // SHIPMENTS & SHIPPING
  // ============================================
  {
    pattern: /^shipments\/(stats|carriers)/,
    methods: { GET: 'view_shipments' },
  },
  {
    pattern: /^shipments\/[^/]+$/,
    methods: { GET: 'view_shipments', PUT: 'edit_shipments', DELETE: 'delete_shipments' },
  },
  {
    pattern: /^shipments$/,
    methods: { GET: 'view_shipments', POST: 'create_shipments' },
  },
  {
    pattern: /^shipping-config/,
    methods: { GET: 'view_settings', POST: 'edit_settings' },
  },
  {
    pattern: /^shipping\/ghtk\/(create-order|submit-order|cancel-order)/,
    methods: { POST: 'create_shipments' },
  },
  {
    pattern: /^shipping\/ghtk\/test-connection/,
    methods: { GET: 'view_settings' },
  },
  {
    pattern: /^shipping\/ghtk\//,
    methods: { GET: 'view_shipments', POST: 'view_shipments' },
  },

  // ============================================
  // PROMOTIONS
  // ============================================
  {
    pattern: /^promotions\/validate$/,
    methods: {}, // Auth-only, no specific permission needed
  },
  {
    pattern: /^promotions\/[^/]+$/,
    methods: { GET: 'view_settings', PATCH: 'edit_settings', DELETE: 'edit_settings' },
  },
  {
    pattern: /^promotions$/,
    methods: { GET: 'view_settings', POST: 'edit_settings' },
  },

  // ============================================
  // AUDIT & ACTIVITY LOGS
  // ============================================
  {
    pattern: /^audit-logs/,
    methods: { GET: 'view_audit_log', POST: 'export_audit_log' },
  },
  {
    pattern: /^activity-logs/,
    methods: { GET: 'view_audit_log', POST: 'export_audit_log' },
  },

  // ============================================
  // DASHBOARD & STATS
  // ============================================
  {
    pattern: /^dashboard/,
    methods: { GET: 'view_dashboard' },
  },
  {
    pattern: /^stats\/counts/,
    methods: { GET: 'view_dashboard' },
  },

  // ============================================
  // COMMENTS / WIKI / WORKFLOWS
  // ============================================
  {
    pattern: /^comments/,
    methods: { GET: 'view_tasks', POST: 'edit_tasks', PUT: 'edit_tasks', DELETE: 'edit_tasks' },
  },

  // ============================================
  // TASKS (explicit entries — không skip)
  // ============================================
  // Stats / notifications-process: chỉ đọc, view_tasks là đủ
  {
    pattern: /^tasks\/(stats|dashboard-stats|notifications\/process)/,
    methods: { GET: 'view_tasks', POST: 'view_tasks' },
  },
  // Boards
  {
    pattern: /^tasks\/boards\/[^/]+$/,
    methods: { GET: 'view_tasks', PUT: 'edit_tasks', DELETE: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/boards$/,
    methods: { GET: 'view_tasks', POST: 'create_tasks' },
  },
  // Templates
  {
    pattern: /^tasks\/templates\/[^/]+\/use/,
    methods: { POST: 'create_tasks' },
  },
  {
    pattern: /^tasks\/templates\/[^/]+$/,
    methods: { GET: 'view_tasks', PUT: 'edit_tasks', DELETE: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/templates$/,
    methods: { GET: 'view_tasks', POST: 'create_tasks' },
  },
  // Recurring tasks
  {
    pattern: /^tasks\/recurring\/process/,
    methods: { POST: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/recurring\/[^/]+\/toggle-pause/,
    methods: { POST: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/recurring\/[^/]+$/,
    methods: { GET: 'view_tasks', PUT: 'edit_tasks', DELETE: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/recurring$/,
    methods: { GET: 'view_tasks', POST: 'create_tasks' },
  },
  // Dependencies + evidence
  {
    pattern: /^tasks\/dependencies/,
    methods: { POST: 'edit_tasks' },
  },
  {
    pattern: /^tasks\/[^/]+\/evidence/,
    methods: { GET: 'view_tasks', POST: 'edit_tasks' },
  },
  // Generic task routes
  {
    pattern: /^tasks\/[^/]+$/,
    methods: { GET: 'view_tasks', PUT: 'edit_tasks', PATCH: 'edit_tasks', DELETE: 'edit_tasks' },
  },
  {
    pattern: /^tasks$/,
    methods: { GET: 'view_tasks', POST: 'create_tasks' },
  },

  // ============================================
  // UPLOAD (auth-only; tất cả user đăng nhập đều có thể upload avatar/file công việc)
  // ============================================
  {
    pattern: /^upload\/cleanup/,
    methods: { POST: 'manage_roles' },
  },
  {
    pattern: /^upload(\/|$)/,
    methods: {}, // Auth-only — không yêu cầu permission cụ thể
  },

  // ============================================
  // ADMINISTRATIVE UNITS (reference data: GET auth-only, writes admin)
  // ============================================
  {
    pattern: /^administrative-units/,
    methods: { POST: 'manage_roles', PUT: 'manage_roles', DELETE: 'manage_roles' },
  },
  {
    pattern: /^wiki\/[^/]+$/,
    methods: { GET: 'view_wiki', PUT: 'edit_wiki', DELETE: 'delete_wiki' },
  },
  {
    pattern: /^wiki$/,
    methods: { GET: 'view_wiki', POST: 'create_wiki' },
  },
  {
    pattern: /^workflow-templates/,
    methods: { GET: 'view_tasks', POST: 'edit_tasks' },
  },

  // ============================================
  // SEARCH
  // ============================================
  {
    pattern: /^search\/customers/,
    methods: { GET: 'view_customers' },
  },
  {
    pattern: /^search\/orders/,
    methods: { GET: 'view_orders' },
  },
  {
    pattern: /^search\/products/,
    methods: { GET: 'view_products' },
  },
  {
    pattern: /^search\/health/,
    methods: { GET: 'view_dashboard' },
  },

  // ============================================
  // IMPORT / EXPORT
  // ============================================
  {
    pattern: /^import-jobs/,
    methods: { GET: 'manage_roles', POST: 'manage_roles', DELETE: 'manage_roles' },
  },
  {
    pattern: /^import-export-logs/,
    methods: { GET: 'view_settings', POST: 'manage_roles', DELETE: 'manage_roles' },
  },

  // ============================================
  // BRANCHES
  // ============================================
  {
    pattern: /^branches\/[^/]+$/,
    methods: { GET: 'view_branches', PUT: 'edit_branches', DELETE: 'delete_branches' },
  },
  {
    pattern: /^branches$/,
    methods: { GET: 'view_branches', POST: 'create_branches' },
  },
  {
    pattern: /^branding\/[^/]+$/,
    methods: { GET: 'view_settings', DELETE: 'manage_roles' },
  },

  // ============================================
  // USERS & ROLES (Admin-only)
  // ============================================
  {
    pattern: /^users/,
    methods: { GET: 'manage_roles', POST: 'manage_roles', PUT: 'manage_roles', DELETE: 'manage_roles' },
  },
  {
    pattern: /^roles\/[^/]+$/,
    methods: { GET: 'view_settings', PUT: 'manage_roles', DELETE: 'manage_roles' },
  },
  {
    pattern: /^roles$/,
    methods: { GET: 'view_settings', POST: 'manage_roles' },
  },

  // ============================================
  // SETTINGS (catch-all for all sub-routes)
  // ============================================
  // Role settings: GET is public (all users need their own permissions), writes require manage_roles
  {
    pattern: /^settings\/roles$/,
    methods: { PUT: 'manage_roles' },
  },
  // Reference data: GET is auth-only (no specific permission), writes require edit_settings
  // These are used across all pages (products, orders, etc.) by Sales/Warehouse roles
  {
    pattern: /^settings\/(pricing-policies|taxes|shipping-partners|sales-channels|receipt-types|payment-methods|payment-types)(\/|$)/,
    methods: { POST: 'edit_settings', PUT: 'edit_settings', PATCH: 'edit_settings', DELETE: 'manage_roles' },
  },
  {
    pattern: /^settings\/(global|trendtech)/,
    methods: { GET: 'view_settings', PUT: 'manage_roles' },
  },
  {
    pattern: /^settings\/store-info\/reset/,
    methods: { POST: 'manage_roles' },
  },
  {
    pattern: /^settings\/pkgx$/,
    methods: { GET: 'view_settings', PUT: 'manage_roles' },
  },
  // Settings catch-all: GET→view, writes→edit, DELETE→manage_roles
  {
    pattern: /^settings\//,
    methods: { GET: 'view_settings', POST: 'edit_settings', PUT: 'edit_settings', PATCH: 'edit_settings', DELETE: 'manage_roles' },
  },
  {
    pattern: /^settings$/,
    methods: { GET: 'view_settings', POST: 'edit_settings', PUT: 'edit_settings' },
  },

  // ============================================
  // PKGX / TRENDTECH / WEBSITE (top-level)
  // ============================================
  {
    pattern: /^pkgx\//,
    methods: { GET: 'view_settings', PUT: 'manage_roles', PATCH: 'edit_settings' },
  },
  {
    pattern: /^trendtech\//,
    methods: { GET: 'view_settings', PATCH: 'edit_settings' },
  },
  {
    pattern: /^website-settings/,
    methods: { GET: 'view_settings', POST: 'edit_settings' },
  },
]

/**
 * Routes that SKIP permission checks (public, system, user-scoped).
 *
 * ⚠️ Chỉ thêm route vào đây nếu:
 * - Endpoint công khai (no auth), HOẶC
 * - Endpoint user-scoped (mọi user đăng nhập đều có thể gọi), HOẶC
 * - Endpoint hệ thống/cron (có cơ chế xác thực riêng như cron secret).
 */
export const SKIP_PERMISSION_ROUTES: RegExp[] = [
  /^auth\//,
  /^public\//,
  /^health$/,
  /^debug\//,
  /^branding$/, // Public logo/favicon
  /^cron\//, // Cron secret check trong handler
  /^shipping\/ghtk\/webhook/, // External webhook
  /^user-preferences/, // User-scoped (per-user preferences)
  /^active-timer/, // User-scoped attendance timer
  /^id\/generate/, // Internal ID generation utility
  /^notifications(\/|$)/, // User-scoped notifications
]

/**
 * Look up the required permission for a given API path and HTTP method.
 *
 * Return values:
 * - `Permission` (string) → route có permission rõ ràng, middleware enforce.
 * - `null` → route không yêu cầu permission (skip list HOẶC match route có method
 *   trống như auth-only). Middleware chỉ check đăng nhập.
 *
 * Dev mode: log warning khi route không nằm skip list mà cũng không match
 * bất kỳ pattern nào → đây là dấu hiệu route mới chưa được khai báo RBAC.
 */
export function getRequiredPermission(
  apiPath: string,
  method: string
): Permission | null {
  for (const skipPattern of SKIP_PERMISSION_ROUTES) {
    if (skipPattern.test(apiPath)) return null
  }

  const httpMethod = method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  for (const route of API_PERMISSION_MAP) {
    if (route.pattern.test(apiPath)) {
      return route.methods[httpMethod] ?? null
    }
  }

  // Dev-mode coverage warning: dễ phát hiện route mới chưa khai báo permission.
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[RBAC] Unmapped API route: ${method} /api/${apiPath} — thêm vào API_PERMISSION_MAP hoặc SKIP_PERMISSION_ROUTES`,
    )
  }

  return null
}
