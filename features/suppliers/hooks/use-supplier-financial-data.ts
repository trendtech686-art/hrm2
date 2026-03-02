/**
 * Hooks for fetching supplier-specific financial data
 * 
 * ⚡ PERFORMANCE: These hooks use server-side filtering instead of loading all data
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchPayments } from '../../payments/api/payments-api';
import { fetchReceipts } from '../../receipts/api/receipts-api';
import { fetchPurchaseOrders } from '../../purchase-orders/api/purchase-orders-api';
import { usePurchaseReturnsBySupplier } from '../../purchase-returns/hooks/use-purchase-returns';
import * as React from 'react';

/**
 * Hook to fetch payments for a specific supplier (phiếu chi - money going out to supplier)
 */
export function useSupplierPayments(supplierId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'supplier', supplierId],
    queryFn: () => fetchAllPages((p) => fetchPayments({ ...p, recipientSystemId: supplierId! })),
    enabled: !!supplierId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Hook to fetch receipts for a specific supplier (phiếu thu - refunds from supplier)
 */
export function useSupplierReceipts(supplierId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'supplier', supplierId],
    queryFn: () => fetchAllPages((p) => fetchReceipts({ ...p, supplierId: supplierId! })),
    enabled: !!supplierId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Hook to fetch purchase orders for a specific supplier
 */
export function useSupplierPurchaseOrders(supplierId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['purchase-orders', 'supplier', supplierId],
    queryFn: () => fetchAllPages((p) => fetchPurchaseOrders({ ...p, supplierId: supplierId! })),
    enabled: !!supplierId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Hook to fetch purchase returns for a specific supplier
 * 
 * ⚡ PERFORMANCE: Wraps existing hook with consistent return type
 */
export function useSupplierPurchaseReturns(supplierId: string | undefined | null) {
  const query = usePurchaseReturnsBySupplier(supplierId);

  const data = React.useMemo(
    () => query.data?.data || [],
    [query.data?.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
