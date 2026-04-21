/**
 * Inventory Report Hooks — GET /api/reports/inventory-aggregate
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchInventoryBranchReport,
  fetchInventoryCategoryReport,
  fetchInventoryProductReport,
} from '@/features/reports/api/reports-api';
import type {
  InventoryBranchReportRow,
  InventoryCategoryReportRow,
  InventoryProductReportRow,
} from '../types';
import type { SystemId } from '@/lib/id-types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

export function useInventoryProductReport(filters?: {
  branchId?: SystemId;
  categoryId?: SystemId;
  stockStatus?: string;
}) {
  const query = useQuery({
    queryKey: ['reports', 'inventory-aggregate', 'product', filters?.branchId, filters?.categoryId, filters?.stockStatus],
    queryFn: () => fetchInventoryProductReport(filters),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as InventoryProductReportRow[],
    summary: query.data?.summary ?? {
      totalProducts: 0,
      totalOnHand: 0,
      totalCommitted: 0,
      totalAvailable: 0,
      totalInventoryValue: 0,
      outOfStockCount: 0,
      lowStockCount: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useInventoryBranchReport() {
  const query = useQuery({
    queryKey: ['reports', 'inventory-aggregate', 'branch'],
    queryFn: () => fetchInventoryBranchReport(),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as InventoryBranchReportRow[],
    summary: query.data?.summary ?? {
      totalBranches: 0,
      totalOnHand: 0,
      totalInventoryValue: 0,
      totalOutOfStock: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useInventoryCategoryReport() {
  const query = useQuery({
    queryKey: ['reports', 'inventory-aggregate', 'category'],
    queryFn: () => fetchInventoryCategoryReport(),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as InventoryCategoryReportRow[],
    summary: query.data?.summary ?? {
      totalCategories: 0,
      totalOnHand: 0,
      totalInventoryValue: 0,
      totalOutOfStock: 0,
    },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
