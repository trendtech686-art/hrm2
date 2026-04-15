/**
 * Hooks for fetching customer-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific customer
 * using server-side filtering with limit=0 (fetch all in single request).
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/features/orders/api/orders-api';
import { fetchWarranties } from '@/features/warranty/api/warranties-api';
import { fetchComplaints } from '@/features/complaints/api/complaints-api';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { fetchPayments } from '@/features/payments/api/payments-api';
import { fetchSalesReturns } from '@/features/sales-returns/api/sales-returns-api';
import type { Order, Receipt, Payment, SalesReturn } from '@/lib/types/prisma-extended';
import type { WarrantyTicket as Warranty } from '@/lib/types/prisma-extended';
import type { Complaint } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_ORDERS: Order[] = [];
const EMPTY_WARRANTIES: Warranty[] = [];
const EMPTY_COMPLAINTS: Complaint[] = [];
const EMPTY_RECEIPTS: Receipt[] = [];
const EMPTY_PAYMENTS: Payment[] = [];
const EMPTY_SALES_RETURNS: SalesReturn[] = [];

/**
 * Fetch orders for a specific customer
 */
export function useCustomerOrders(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['orders', 'customer', customerId],
    queryFn: async () => {
      const res = await fetchOrders({ customerId: customerId!, limit: 0 });
      return res.data;
    },
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
export function useCustomerWarranties(customerId: string | undefined | null, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ['warranties', 'customer', customerId],
    queryFn: async () => {
      const res = await fetchWarranties({ customerId: customerId!, limit: 0 });
      return res.data;
    },
    enabled: !!customerId && (options?.enabled !== false),
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
export function useCustomerComplaints(customerId: string | undefined | null, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ['complaints', 'customer', customerId],
    queryFn: async () => {
      const res = await fetchComplaints({ customerId: customerId!, limit: 0 });
      return res.data;
    },
    enabled: !!customerId && (options?.enabled !== false),
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
    queryFn: async () => {
      const res = await fetchReceipts({ customerSystemId: customerSystemId!, limit: 0 });
      return res.data;
    },
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
    queryFn: async () => {
      const res = await fetchPayments({ customerSystemId: customerSystemId!, limit: 0 });
      return res.data;
    },
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

/**
 * Fetch sales returns for a specific customer
 */
export function useCustomerSalesReturns(customerId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['sales-returns', 'customer', customerId],
    queryFn: async () => {
      const res = await fetchSalesReturns({ customerId: customerId!, limit: 0 });
      return res.data;
    },
    enabled: !!customerId,
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
  };
}

/**
 * Fetch receipts for a specific customer with broad matching
 * Matches: customerSystemId OR payerSystemId OR (payerTypeName='Khách hàng' AND payerName=customerName)
 */
export function useCustomerReceiptsBroad(customerSystemId: string | undefined | null, customerName: string | undefined | null, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ['receipts', 'customer-broad', customerSystemId, customerName],
    queryFn: async () => {
      const res = await fetchReceipts({
        customerSystemId: customerSystemId!,
        customerMatchBroad: true,
        customerName: customerName || undefined,
        limit: 0,
      });
      return res.data;
    },
    // Wait for customerName to be loaded to avoid double-fetch
    enabled: !!customerSystemId && customerName !== undefined && (options?.enabled !== false),
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
 * Fetch payments for a specific customer with broad matching
 * Matches: customerSystemId OR recipientSystemId OR (recipientTypeName='Khách hàng' AND recipientName=customerName)
 */
export function useCustomerPaymentsBroad(customerSystemId: string | undefined | null, customerName: string | undefined | null, options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ['payments', 'customer-broad', customerSystemId, customerName],
    queryFn: async () => {
      const res = await fetchPayments({
        customerSystemId: customerSystemId!,
        customerMatchBroad: true,
        customerName: customerName || undefined,
        limit: 0,
      });
      return res.data;
    },
    // Wait for customerName to be loaded to avoid double-fetch
    enabled: !!customerSystemId && customerName !== undefined && (options?.enabled !== false),
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

// ============================================================================
// PAGINATED HOOKS - Server-side pagination for customer detail tabs
// ============================================================================

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationState;
  isLoading: boolean;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

/**
 * Fetch paginated orders for a specific customer
 */
export function useCustomerOrdersPaginated(
  customerId: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<Order> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['orders', 'customer-paginated', customerId, page, pageSize],
    queryFn: async () => {
      const res = await fetchOrders({ customerId: customerId!, page, limit: pageSize });
      return res;
    },
    enabled: !!customerId && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_ORDERS, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
  };
}

/**
 * Fetch paginated sales returns for a specific customer
 */
export function useCustomerSalesReturnsPaginated(
  customerId: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<SalesReturn> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['sales-returns', 'customer-paginated', customerId, page, pageSize],
    queryFn: async () => {
      const res = await fetchSalesReturns({ customerId: customerId!, page, limit: pageSize });
      return res;
    },
    enabled: !!customerId && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_SALES_RETURNS, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
  };
}

/**
 * Fetch paginated warranties for a specific customer
 */
export function useCustomerWarrantiesPaginated(
  customerId: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<Warranty> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['warranties', 'customer-paginated', customerId, page, pageSize],
    queryFn: async () => {
      const res = await fetchWarranties({ customerId: customerId!, page, limit: pageSize });
      return res;
    },
    enabled: !!customerId && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_WARRANTIES, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
  };
}

/**
 * Fetch paginated complaints for a specific customer
 */
export function useCustomerComplaintsPaginated(
  customerId: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<Complaint> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['complaints', 'customer-paginated', customerId, page, pageSize],
    queryFn: async () => {
      const res = await fetchComplaints({ customerId: customerId!, page, limit: pageSize });
      return res;
    },
    enabled: !!customerId && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_COMPLAINTS, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
  };
}

// Types for customer products
export interface CustomerProduct {
  systemId: string;
  productSystemId: string;
  productId: string;
  name: string;
  quantity: number;
  orderId: string;
  orderSystemId: string;
  orderDate: string;
  warrantyMonths: number;
  warrantyExpiry: string;
}

interface CustomerProductsResponse {
  data: CustomerProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Fetch paginated products for a specific customer
 * Uses dedicated API endpoint that flattens order line items
 */
export function useCustomerProductsPaginated(
  customerId: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<CustomerProduct> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['customer-products', customerId, page, pageSize],
    queryFn: async (): Promise<CustomerProductsResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      const res = await fetch(`/api/customers/${customerId}/products?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch customer products');
      return res.json();
    },
    enabled: !!customerId && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const emptyProducts: CustomerProduct[] = [];
  const data = React.useMemo(() => query.data?.data || emptyProducts, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
  };
}

// Types for customer debt transactions
export interface CustomerDebtTransaction {
  systemId: string;
  voucherId: string;
  originalSystemId: string;
  type: 'order' | 'receipt' | 'payment' | 'sales-return';
  creator: string;
  creatorId: string;
  date: string;
  createdAt: string;
  description: string;
  debitAmount: number;
  creditAmount: number;  change: number;  balance: number;
}

interface CustomerDebtResponse {
  data: CustomerDebtTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    currentDebt: number;
    totalDebit: number;
    totalCredit: number;
  };
}

/**
 * Fetch paginated debt transactions for a specific customer
 * Uses dedicated API endpoint that combines orders, receipts, payments
 */
export function useCustomerDebtPaginated(
  customerId: string | undefined | null,
  customerName: string | undefined | null,
  options?: { enabled?: boolean; initialPageSize?: number }
): PaginatedResult<CustomerDebtTransaction> & { summary: CustomerDebtResponse['summary'] } {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['customer-debt', customerId, customerName, page, pageSize],
    queryFn: async (): Promise<CustomerDebtResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });
      if (customerName) params.set('customerName', customerName);
      const res = await fetch(`/api/customers/${customerId}/debt?${params}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch customer debt');
      return res.json();
    },
    enabled: !!customerId && customerName !== undefined && (options?.enabled !== false),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const emptyDebt: CustomerDebtTransaction[] = [];
  const data = React.useMemo(() => query.data?.data || emptyDebt, [query.data]);
  const pagination = React.useMemo(() => ({
    page: query.data?.pagination?.page || 1,
    pageSize: query.data?.pagination?.limit || pageSize,
    total: query.data?.pagination?.total || 0,
    totalPages: query.data?.pagination?.totalPages || 0,
  }), [query.data, pageSize]);
  const summary = React.useMemo(() => query.data?.summary || { currentDebt: 0, totalDebit: 0, totalCredit: 0 }, [query.data]);

  return {
    data,
    pagination,
    isLoading: query.isLoading,
    setPage,
    setPageSize: (size: number) => { setPageSize(size); setPage(1); },
    summary,
  };
}
