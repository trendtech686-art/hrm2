/**
 * Hooks for fetching purchase-order-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific PO,
 * instead of loading ALL data and filtering client-side.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import type { Receipt, Payment, InventoryReceipt } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];
const EMPTY_INVENTORY_RECEIPTS: InventoryReceipt[] = [];

/**
 * Fetch financial receipts linked to a specific purchase order
 * ⚡ PERFORMANCE: Uses server-side purchaseOrderSystemId filter
 */
export function usePurchaseOrderReceipts(poSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'purchase-order', poSystemId],
    queryFn: async () => {
      const res = await fetchReceipts({ purchaseOrderSystemId: poSystemId! });
      return res.data;
    },
    enabled: !!poSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    data: query.data || EMPTY_RECEIPTS,
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
    queryFn: async () => {
      const res = await fetchPayments({ purchaseOrderSystemId: poSystemId! });
      return res.data;
    },
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
      const response = await fetch(`/api/inventory-receipts?purchaseOrderSystemId=${encodeURIComponent(poSystemId!)}`);
      if (!response.ok) throw new Error('Không thể tải danh sách phiếu nhập kho');
      const result = await response.json();
      return (result.data || result) as InventoryReceipt[];
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
