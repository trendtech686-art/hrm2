/**
 * Hooks for fetching purchase-order-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific PO,
 * instead of loading ALL data and filtering client-side.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import type { Receipt, Payment, InventoryReceipt } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];
const EMPTY_INVENTORY_RECEIPTS: InventoryReceipt[] = [];

/**
 * Fetch financial receipts linked to a specific purchase order
 */
export function usePurchaseOrderReceipts(poSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'purchase-order', poSystemId],
    queryFn: () => fetchAllPages((p) => fetchReceipts(p)),
    enabled: !!poSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  // Filter client-side for now since API doesn't support this filter yet
  const data = React.useMemo(() => {
    if (!poSystemId || !query.data) return EMPTY_RECEIPTS;
    return query.data.filter(r => 
      (r as unknown as { purchaseOrderSystemId?: string }).purchaseOrderSystemId === poSystemId
    );
  }, [query.data, poSystemId]);

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Fetch payments linked to a specific purchase order
 */
export function usePurchaseOrderPayments(poSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'purchase-order', poSystemId],
    queryFn: () => fetchAllPages((p) => fetchPayments({ 
      ...p,
      purchaseOrderSystemId: poSystemId!,
    })),
    enabled: !!poSystemId,
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
 * Fetch inventory receipts linked to a specific purchase order
 */
export function usePurchaseOrderInventoryReceipts(poSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['inventory-receipts', 'purchase-order', poSystemId],
    queryFn: async () => {
      return fetchAllPages<InventoryReceipt>(async (p) => {
        const response = await fetch(`/api/inventory-receipts?purchaseOrderSystemId=${poSystemId}&page=${p.page}&limit=${p.limit}`);
        if (!response.ok) throw new Error('Failed to fetch inventory receipts');
        return response.json();
      });
    },
    enabled: !!poSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_INVENTORY_RECEIPTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Combined hook for all PO financial data
 */
export function usePurchaseOrderFinancialData(poSystemId: string | undefined | null) {
  const { data: payments, isLoading: paymentsLoading } = usePurchaseOrderPayments(poSystemId);
  const { data: receipts, isLoading: receiptsLoading } = usePurchaseOrderReceipts(poSystemId);
  const { data: inventoryReceipts, isLoading: inventoryReceiptsLoading } = usePurchaseOrderInventoryReceipts(poSystemId);

  const allTransactions = React.useMemo(
    () => [...payments, ...receipts],
    [payments, receipts]
  );

  return {
    payments,
    receipts,
    inventoryReceipts,
    allTransactions,
    isLoading: paymentsLoading || receiptsLoading || inventoryReceiptsLoading,
  };
}
