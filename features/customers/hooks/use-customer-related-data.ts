/**
 * Hooks for fetching customer-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific customer,
 * instead of loading ALL data and filtering client-side.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchOrders } from '@/features/orders/api/orders-api';
import { fetchWarranties } from '@/features/warranty/api/warranties-api';
import { fetchComplaints } from '@/features/complaints/api/complaints-api';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import type { Order, Receipt, Payment } from '@/lib/types/prisma-extended';
import type { WarrantyTicket as Warranty } from '@/lib/types/prisma-extended';
import type { Complaint } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_ORDERS: Order[] = [];
const EMPTY_WARRANTIES: Warranty[] = [];
const EMPTY_COMPLAINTS: Complaint[] = [];
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];

/**
 * Fetch orders for a specific customer
 */
export function useCustomerOrders(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['orders', 'customer', customerId],
    queryFn: () => fetchAllPages((p) => fetchOrders({ 
      ...p,
      customerId: customerId!,
    })),
    enabled: !!customerId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_ORDERS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

/**
 * Fetch warranties for a specific customer (by customerId)
 */
export function useCustomerWarranties(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['warranties', 'customer', customerId],
    queryFn: () => fetchAllPages((p) => fetchWarranties({ 
      ...p,
      customerId: customerId!,
    })),
    enabled: !!customerId,
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
 * Fetch complaints for a specific customer (by customerId)
 */
export function useCustomerComplaints(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['complaints', 'customer', customerId],
    queryFn: () => fetchAllPages((p) => fetchComplaints({ 
      ...p,
      customerId: customerId!,
    })),
    enabled: !!customerId,
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

/**
 * Fetch receipts for a specific customer
 */
export function useCustomerReceiptsHook(customerSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'customer', customerSystemId],
    queryFn: () => fetchAllPages((p) => fetchReceipts({ 
      ...p,
      customerSystemId: customerSystemId!,
    })),
    enabled: !!customerSystemId,
    staleTime: 60_000,
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
 * Fetch payments for a specific customer
 */
export function useCustomerPaymentsHook(customerSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['payments', 'customer', customerSystemId],
    queryFn: () => fetchAllPages((p) => fetchPayments({ 
      ...p,
      customerSystemId: customerSystemId!,
    })),
    enabled: !!customerSystemId,
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
