/**
 * Reports React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import * as api from '../api/reports-api';
import type { ReportFilters } from '../api/reports-api';

export const reportKeys = {
  all: ['reports'] as const,
  sales: (filters: ReportFilters) => [...reportKeys.all, 'sales', filters] as const,
  inventory: (filters: ReportFilters) => [...reportKeys.all, 'inventory', filters] as const,
  customerSla: (filters: ReportFilters) => [...reportKeys.all, 'customer-sla', filters] as const,
  productSla: (filters: ReportFilters) => [...reportKeys.all, 'product-sla', filters] as const,
  businessActivity: (filters: ReportFilters) => [...reportKeys.all, 'business-activity', filters] as const,
};

export function useSalesReport(filters: ReportFilters = {}) {
  return useQuery({ queryKey: reportKeys.sales(filters), queryFn: () => api.fetchSalesReport(filters), staleTime: 1000 * 60 * 5 });
}

export function useInventoryReport(filters: ReportFilters = {}) {
  return useQuery({ queryKey: reportKeys.inventory(filters), queryFn: () => api.fetchInventoryReport(filters), staleTime: 1000 * 60 * 5 });
}

export function useCustomerSlaReport(filters: ReportFilters = {}) {
  return useQuery({ queryKey: reportKeys.customerSla(filters), queryFn: () => api.fetchCustomerSlaReport(filters), staleTime: 1000 * 60 * 5 });
}

export function useProductSlaReport(filters: ReportFilters = {}) {
  return useQuery({ queryKey: reportKeys.productSla(filters), queryFn: () => api.fetchProductSlaReport(filters), staleTime: 1000 * 60 * 5 });
}

export function useBusinessActivityReport(filters: ReportFilters = {}) {
  return useQuery({ queryKey: reportKeys.businessActivity(filters), queryFn: () => api.fetchBusinessActivityReport(filters), staleTime: 1000 * 60 * 5 });
}
