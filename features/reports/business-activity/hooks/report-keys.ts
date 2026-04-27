/**
 * Centralized React Query keys for Business Activity Reports
 */

// Base key factory
const BASE_KEYS = ['reports'] as const;

// Sales report keys
const salesKeys = {
  all: ['reports', 'sales'] as const,
  lists: () => ['reports', 'sales', 'list'] as const,
  timeSeries: (params: {
    dateRange: { from: string; to: string };
    grouping?: string;
    branchIds?: string[];
    employeeIds?: string[];
    sourceIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'time-series',
      params.dateRange.from,
      params.dateRange.to,
      params.grouping,
      params.branchIds,
      params.employeeIds,
      params.sourceIds,
    ] as const,
  byProduct: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    categoryIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-product',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.categoryIds,
    ] as const,
  byEmployee: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-employee',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
    ] as const,
  byBranch: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'sales',
      'list',
      'by-branch',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
  bySource: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-source',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
    ] as const,
  byCustomer: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    customerGroupIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-customer',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.customerGroupIds,
    ] as const,
  byCustomerGroup: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    customerGroupIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-customer-group',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.customerGroupIds,
    ] as const,
  byOrder: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    employeeIds?: string[];
    sourceIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-order',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.employeeIds,
      params.sourceIds,
    ] as const,
  byTime: (params: {
    dateRange: { from: string; to: string };
    grouping?: string;
    branchIds?: string[];
    employeeIds?: string[];
    sourceIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-time',
      params.dateRange.from,
      params.dateRange.to,
      params.grouping,
      params.branchIds,
      params.employeeIds,
      params.sourceIds,
    ] as const,
  byTax: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
  }) =>
    [
      'reports',
      'sales',
      'list',
      'by-tax',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
    ] as const,
} as const;

// Payment report keys
const paymentKeys = {
  all: ['reports', 'payments'] as const,
  lists: () => ['reports', 'payments', 'list'] as const,
  timeSeries: (params: {
    dateRange: { from: string; to: string };
    grouping?: string;
  }) =>
    [
      'reports',
      'payments',
      'list',
      'time-series',
      params.dateRange.from,
      params.dateRange.to,
      params.grouping,
    ] as const,
  byMethod: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'payments',
      'list',
      'by-method',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
  byBranch: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'payments',
      'list',
      'by-branch',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
} as const;

// Inventory report keys
const inventoryKeys = {
  all: ['reports', 'inventory'] as const,
  lists: () => ['reports', 'inventory', 'list'] as const,
  product: (params?: {
    branchId?: string;
    categoryId?: string;
    stockStatus?: string;
  }) =>
    [
      'reports',
      'inventory',
      'list',
      'product',
      params?.branchId,
      params?.categoryId,
      params?.stockStatus,
    ] as const,
  branch: () => ['reports', 'inventory', 'list', 'branch'] as const,
  category: () => ['reports', 'inventory', 'list', 'category'] as const,
} as const;

// Delivery report keys
const deliveryKeys = {
  all: ['reports', 'delivery'] as const,
  lists: () => ['reports', 'delivery', 'list'] as const,
  timeSeries: (params: {
    dateRange: { from: string; to: string };
    grouping?: string;
    branchIds?: string[];
    carrierIds?: string[];
  }) =>
    [
      'reports',
      'delivery',
      'list',
      'time-series',
      params.dateRange.from,
      params.dateRange.to,
      params.grouping,
      params.branchIds,
      params.carrierIds,
    ] as const,
  byCarrier: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    carrierIds?: string[];
  }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-carrier',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.carrierIds,
    ] as const,
  byBranch: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-branch',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
  byChannel: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-channel',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
  byCustomer: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    carrierIds?: string[];
  }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-customer',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.carrierIds,
    ] as const,
  byEmployee: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    carrierIds?: string[];
  }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-employee',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.carrierIds,
    ] as const,
  bySource: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'delivery',
      'list',
      'by-source',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
  shipmentList: (params: {
    dateRange: { from: string; to: string };
    branchIds?: string[];
    carrierIds?: string[];
    page?: number;
    pageSize?: number;
  }) =>
    [
      'reports',
      'delivery',
      'list',
      'shipment-list',
      params.dateRange.from,
      params.dateRange.to,
      params.branchIds,
      params.carrierIds,
      params.page ?? 1,
      params.pageSize ?? 20,
    ] as const,
} as const;

// Return report keys
const returnKeys = {
  all: ['reports', 'returns'] as const,
  lists: () => ['reports', 'returns', 'list'] as const,
  byOrder: (params: {
    dateRange: { from: string; to: string };
    page?: number;
    pageSize?: number;
  }) =>
    [
      'reports',
      'returns',
      'list',
      'by-order',
      params.dateRange.from,
      params.dateRange.to,
      params.page ?? 1,
      params.pageSize ?? 500,
    ] as const,
  byProduct: (params: { dateRange: { from: string; to: string } }) =>
    [
      'reports',
      'returns',
      'list',
      'by-product',
      params.dateRange.from,
      params.dateRange.to,
    ] as const,
} as const;

// Export as named exports for tree-shaking
export const reportKeys = {
  all: BASE_KEYS,
  sales: salesKeys,
  payments: paymentKeys,
  inventory: inventoryKeys,
  delivery: deliveryKeys,
  returns: returnKeys,
} as const;
