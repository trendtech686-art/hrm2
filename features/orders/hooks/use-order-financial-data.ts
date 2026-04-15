/**
 * useOrderFinancialData - Optimized hooks for fetching receipts/payments related to an order
 * 
 * ⚠️ PERFORMANCE: These hooks fetch only data related to a specific order,
 * instead of loading ALL receipts/payments and filtering client-side.
 * 
 * This dramatically improves order detail page performance!
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import { fetchWarranties } from '@/features/warranty/api/warranties-api';
import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api';
import { fetchComplaints } from '@/features/complaints/api/complaints-api';
import type { Receipt, Payment, SalesReturn } from '@/lib/types/prisma-extended';
import type { WarrantyTicket as Warranty } from '@/lib/types/prisma-extended';
import type { Complaint } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];
const EMPTY_WARRANTIES: Warranty[] = [];
const EMPTY_SALES_RETURNS: SalesReturn[] = [];
const EMPTY_COMPLAINTS: Complaint[] = [];

/**
 * Fetch receipts linked to a specific order
 */
export function useOrderReceipts(orderSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'order', orderSystemId],
    queryFn: async () => {
      const res = await fetchReceipts({ linkedOrderSystemId: orderSystemId! });
      return res.data;
    },
    enabled: !!orderSystemId,
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_RECEIPTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

/**
 * Fetch payments linked to a specific order (refund payments)
 */
export function useOrderPayments(orderSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'order', orderSystemId],
    queryFn: async () => {
      const res = await fetchPayments({ linkedOrderSystemId: orderSystemId! });
      return res.data;
    },
    enabled: !!orderSystemId,
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
  };
}

/**
 * Fetch receipts linked to a sales return (for exchange orders)
 */
export function useSalesReturnReceipts(salesReturnSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'salesReturn', salesReturnSystemId],
    queryFn: async () => {
      const res = await fetchReceipts({ linkedSalesReturnSystemId: salesReturnSystemId! });
      return res.data;
    },
    enabled: !!salesReturnSystemId,
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
  };
}

/**
 * Fetch payments linked to a sales return (for exchange orders)
 */
export function useSalesReturnPayments(salesReturnSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'salesReturn', salesReturnSystemId],
    queryFn: async () => {
      const res = await fetchPayments({ linkedSalesReturnSystemId: salesReturnSystemId! });
      return res.data;
    },
    enabled: !!salesReturnSystemId,
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
  };
}

/**
 * Fetch receipts for a customer (for debt calculation)
 * Only used when customer debt needs to be calculated
 */
export function useCustomerReceipts(customerSystemId: string | undefined | null, enabled = true) {
  const query = useQuery({
    queryKey: ['receipts', 'customer', customerSystemId],
    queryFn: async () => {
      const res = await fetchReceipts({ customerSystemId: customerSystemId! });
      return res.data;
    },
    enabled: !!customerSystemId && enabled,
    staleTime: 60_000, // 1 minute - debt calculation doesn't need to be super fresh
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_RECEIPTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
  };
}

/**
 * Fetch payments for a customer (for debt calculation)
 */
export function useCustomerPayments(customerSystemId: string | undefined | null, enabled = true) {
  const query = useQuery({
    queryKey: ['payments', 'customer', customerSystemId],
    queryFn: async () => {
      const res = await fetchPayments({ customerSystemId: customerSystemId! });
      return res.data;
    },
    enabled: !!customerSystemId && enabled,
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_PAYMENTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
  };
}

/**
 * Combined hook for all order-related financial data
 * This reduces multiple API calls by batching them
 */
export function useOrderFinancialData(
  orderSystemId: string | undefined | null,
  linkedSalesReturnSystemId: string | undefined | null,
  customerSystemId: string | undefined | null,
  options: { calculateDebt?: boolean } = {}
) {
  const { calculateDebt = false } = options;

  // Receipts linked to this order
  const { data: orderReceipts, isLoading: orderReceiptsLoading } = useOrderReceipts(orderSystemId);
  
  // Receipts/Payments linked to sales return (for exchange orders)
  const { data: salesReturnReceipts, isLoading: srReceiptsLoading } = useSalesReturnReceipts(linkedSalesReturnSystemId);
  const { data: salesReturnPayments, isLoading: srPaymentsLoading } = useSalesReturnPayments(linkedSalesReturnSystemId);
  
  // Customer receipts/payments (only if debt calculation needed)
  const { data: customerReceipts, isLoading: custReceiptsLoading } = useCustomerReceipts(customerSystemId, calculateDebt);
  const { data: customerPayments, isLoading: custPaymentsLoading } = useCustomerPayments(customerSystemId, calculateDebt);

  const isLoading = orderReceiptsLoading || srReceiptsLoading || srPaymentsLoading || 
    (calculateDebt && (custReceiptsLoading || custPaymentsLoading));

  return {
    orderReceipts,
    salesReturnReceipts,
    salesReturnPayments,
    customerReceipts,
    customerPayments,
    isLoading,
  };
}

// =============================================================================
// ORDER-RELATED DATA HOOKS (Warranties, Sales Returns, Complaints)
// =============================================================================

/**
 * Fetch warranties linked to a specific order
 */
export function useOrderWarranties(orderSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['warranties', 'order', orderSystemId],
    queryFn: async () => {
      const res = await fetchWarranties({ orderSystemId: orderSystemId! });
      return res.data;
    },
    enabled: !!orderSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_WARRANTIES,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
  };
}

/**
 * Fetch sales returns linked to a specific order
 */
export function useOrderSalesReturns(orderId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['sales-returns', 'order', orderId],
    queryFn: async () => {
      const res = await fetchSalesReturns({ orderId: orderId! });
      return res.data;
    },
    enabled: !!orderId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_SALES_RETURNS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Fetch complaints linked to a specific order
 */
export function useOrderComplaints(orderSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['complaints', 'order', orderSystemId],
    queryFn: async () => {
      const res = await fetchComplaints({ orderSystemId: orderSystemId! });
      return res.data;
    },
    enabled: !!orderSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_COMPLAINTS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
  };
}
