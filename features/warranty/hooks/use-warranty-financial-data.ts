/**
 * Hooks for fetching warranty-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific warranty,
 * instead of loading ALL data and filtering client-side.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import type { Receipt, Payment } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];

/**
 * Fetch receipts linked to a specific warranty
 */
export function useWarrantyReceipts(warrantySystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'warranty', warrantySystemId],
    queryFn: () => fetchAllPages((p) => fetchReceipts({ 
      ...p,
      linkedWarrantySystemId: warrantySystemId!,
    })),
    enabled: !!warrantySystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_RECEIPTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Fetch payments linked to a specific warranty
 */
export function useWarrantyPayments(warrantySystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'warranty', warrantySystemId],
    queryFn: () => fetchAllPages((p) => fetchPayments({ 
      ...p,
      linkedWarrantySystemId: warrantySystemId!,
    })),
    enabled: !!warrantySystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_PAYMENTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Combined hook for warranty financial data
 */
export function useWarrantyFinancialData(warrantySystemId: string | undefined | null) {
  const { data: receipts, isLoading: receiptsLoading, refetch: refetchReceipts } = useWarrantyReceipts(warrantySystemId);
  const { data: payments, isLoading: paymentsLoading, refetch: refetchPayments } = useWarrantyPayments(warrantySystemId);

  return {
    receipts,
    payments,
    isLoading: receiptsLoading || paymentsLoading,
    refetch: () => {
      refetchReceipts();
      refetchPayments();
    },
  };
}
