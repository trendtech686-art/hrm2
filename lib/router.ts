import * as React from 'react';

/**
 * Professional Router Configuration
 * Features:
 * - BrowserRouter instead of HashRouter
 * - Type-safe route definitions
 * - Lazy loading & code splitting
 * - Error boundaries
 * - Loading states
 * - Route metadata
 */

export interface RouteMetadata {
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  roles?: string[];
  breadcrumb?: (string | { label: string; href: string })[];
  preload?: boolean;
}

export interface AppRoute {
  path: string;
  element?: React.ComponentType;
  lazy?: () => Promise<{ Component: React.ComponentType }>;
  loader?: () => Promise<any>;
  action?: () => Promise<any>;
  errorElement?: React.ComponentType;
  children?: AppRoute[];
  meta?: RouteMetadata;
}

// Type-safe route paths
export const ROUTES = {
  // Core
  ROOT: '/',
  DASHBOARD: '/dashboard',
  
  // Auth
  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
    VERIFY_OTP: '/verify-otp',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  
  // HRM
  HRM: {
    EMPLOYEES: '/employees',
    EMPLOYEE_NEW: '/employees/new',
    EMPLOYEE_EDIT: '/employees/:systemId/edit',
    EMPLOYEE_VIEW: '/employees/:systemId',
    DEPARTMENTS: '/departments', 
    DEPARTMENT_NEW: '/departments/new',
    DEPARTMENT_EDIT: '/departments/:systemId/edit',
    ORGANIZATION_CHART: '/organization-chart',
    ATTENDANCE: '/attendance',
    LEAVES: '/leaves',
    LEAVE_VIEW: '/leaves/:systemId',
  },
  
  // Sales & CRM
  SALES: {
    CUSTOMERS: '/customers',
    CUSTOMER_NEW: '/customers/new', 
    CUSTOMER_EDIT: '/customers/:systemId/edit',
    CUSTOMER_VIEW: '/customers/:systemId',
    PRODUCTS: '/products',
    PRODUCTS_TRASH: '/products/trash',
    PRODUCT_NEW: '/products/new',
    PRODUCT_EDIT: '/products/:systemId/edit', 
    PRODUCT_VIEW: '/products/:systemId',
    ORDERS: '/orders',
    ORDER_NEW: '/orders/new',
    ORDER_EDIT: '/orders/:systemId/edit',
    ORDER_VIEW: '/orders/:systemId',
    ORDER_RETURN: '/orders/:systemId/return',
    RETURNS: '/returns',
    RETURN_VIEW: '/returns/:systemId',
  },
  
  // Procurement 
  PROCUREMENT: {
    SUPPLIERS: '/suppliers',
    SUPPLIER_NEW: '/suppliers/new',
    SUPPLIER_EDIT: '/suppliers/:systemId/edit',
    SUPPLIER_VIEW: '/suppliers/:systemId',
    SUPPLIERS_TRASH: '/suppliers/trash',
    PURCHASE_ORDERS: '/purchase-orders',
    PURCHASE_ORDER_NEW: '/purchase-orders/new',
    PURCHASE_ORDER_EDIT: '/purchase-orders/:systemId/edit',
    PURCHASE_ORDER_VIEW: '/purchase-orders/:systemId',
    PURCHASE_RETURN: '/purchase-orders/:systemId/return',
    PURCHASE_RETURNS: '/purchase-returns',
    PURCHASE_RETURN_NEW: '/purchase-returns/new',
    PURCHASE_RETURN_VIEW: '/purchase-returns/:systemId',
    INVENTORY_RECEIPTS: '/inventory-receipts',
    INVENTORY_RECEIPT_VIEW: '/inventory-receipts/:systemId',
  },
  
  // Finance
  FINANCE: {
    CASHBOOK: '/cashbook',
    CASHBOOK_REPORTS: '/cashbook/reports',
    VOUCHERS: '/vouchers',
    VOUCHER_VIEW: '/vouchers/:systemId',
    RECEIPTS: '/receipts',
    RECEIPT_NEW: '/receipts/new',
    RECEIPT_EDIT: '/receipts/:systemId/edit', 
    RECEIPT_VIEW: '/receipts/:systemId',
    PAYMENTS: '/payments',
    PAYMENT_NEW: '/payments/new',
    PAYMENT_EDIT: '/payments/:systemId/edit',
    PAYMENT_VIEW: '/payments/:systemId',
  },
  
  // Inventory
  INVENTORY: {
    STOCK_LOCATIONS: '/stock-locations',
    STOCK_HISTORY: '/stock-history',
    INVENTORY_CHECKS: '/inventory-checks',
    INVENTORY_CHECK_NEW: '/inventory-checks/new',
    INVENTORY_CHECK_EDIT: '/inventory-checks/:systemId/edit',
    INVENTORY_CHECK_VIEW: '/inventory-checks/:systemId',
  },
  
  // Internal Operations
  INTERNAL: {
    PACKAGING: '/packaging',
    PACKAGING_VIEW: '/packaging/:systemId',
    SHIPMENTS: '/shipments', 
    SHIPMENT_VIEW: '/shipments/:systemId',
    RECONCILIATION: '/reconciliation',
    WARRANTY: '/warranty',
    WARRANTY_NEW: '/warranty/new',
    WARRANTY_EDIT: '/warranty/:systemId/edit',
    WARRANTY_UPDATE: '/warranty/:systemId/update',
    WARRANTY_VIEW: '/warranty/:systemId',
    WARRANTY_RETURN: '/warranty/:systemId/return',
    WARRANTY_STATISTICS: '/warranty/statistics',
    WARRANTY_TRACKING: '/warranty-tracking/:trackingCode',
    INTERNAL_TASKS: '/internal-tasks',
    TASKS: '/tasks',
    TASKS_NEW: '/tasks/new',
    TASKS_EDIT: '/tasks/:systemId/edit',
    TASKS_VIEW: '/tasks/:systemId',
    TASKS_CALENDAR: '/tasks/calendar',
    COMPLAINTS: '/complaints',
    COMPLAINT_NEW: '/complaints/new',
    COMPLAINT_EDIT: '/complaints/:systemId/edit',
    COMPLAINT_VIEW: '/complaints/:systemId',
    PENALTIES: '/penalties',
    PENALTY_NEW: '/penalties/new',
    PENALTY_EDIT: '/penalties/:systemId/edit',
    PENALTY_VIEW: '/penalties/:systemId',
    DUTY_SCHEDULE: '/duty-schedule',
    WIKI: '/wiki',
    WIKI_NEW: '/wiki/new',
    WIKI_VIEW: '/wiki/:systemId',
    WIKI_EDIT: '/wiki/:systemId/edit',
  },
  
  // Reports
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
  },
  
  // Settings
  SETTINGS: {
    ROOT: '/settings',
    APPEARANCE: '/settings/appearance',
    STORE_INFO: '/settings/store-info',
    PROVINCES: '/settings/provinces',
    EMPLOYEES: '/settings/employees',
    EMPLOYEE_ROLES: '/settings/employee-roles', // Admin: Quản lý phân quyền và mật khẩu
    TAXES: '/settings/taxes',
    PRICING: '/settings/pricing',
    PAYMENTS: '/settings/payments',
    PRINT_TEMPLATES: '/settings/print-templates',
    INVENTORY: '/settings/inventory',
    STOCK_LOCATIONS: '/settings/inventory/stock-locations',
    SHIPPING: '/settings/shipping',
    OTHER: '/settings/other', 
    SALES_CONFIG: '/settings/sales-config',
    SYSTEM_LOGS: '/settings/system-logs',
    IMPORT_EXPORT_LOGS: '/settings/import-export-logs',
    WORKFLOW_TEMPLATES: '/settings/workflow-templates',
    ID_COUNTERS: '/settings/id-counters', // ✅ NEW: ID Management
  },
} as const;

// Helper function to generate route path with params
export function generatePath(path: string, params: Record<string, string | number>): string {
  let result = path;
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, String(value));
  });
  return result;
}

// Helper function to extract params from current path
export function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');
  
  if (patternParts.length !== pathParts.length) {
    return null;
  }
  
  const params: Record<string, string> = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];
    
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      return null;
    }
  }
  
  return params;
}

// Type for route parameters
export type RouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & RouteParams<Rest>
  : T extends `${string}:${infer Param}`
  ? { [K in Param]: string }
  : {};
