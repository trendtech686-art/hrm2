/**
 * Hooks for fetching supplier-specific financial data
 * 
 * ⚡ PERFORMANCE: These hooks use server-side filtering and pagination
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPurchaseOrders } from '../../purchase-orders/api/purchase-orders-api';
import { fetchPurchaseReturns } from '../../purchase-returns/api/purchase-returns-api';
import { fetchSupplierWarranties } from '../../supplier-warranty/api/supplier-warranty-api';
import type { SupplierWarranty } from '../../supplier-warranty/types';
import type { PurchaseReturn, PurchaseOrder } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_PURCHASE_ORDERS: PurchaseOrder[] = [];
const EMPTY_PURCHASE_RETURNS: PurchaseReturn[] = [];

interface FinancialHookOptions {
  enabled?: boolean;
  initialPageSize?: number;
}

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
  search?: string;
  setSearch?: (search: string) => void;
}

/**
 * Hook to fetch paginated purchase orders for a specific supplier
 */
export function useSupplierPurchaseOrdersPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<PurchaseOrder> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['purchase-orders', 'supplier-paginated', supplierId, page, pageSize],
    queryFn: () => fetchPurchaseOrders({ supplierId: supplierId!, page, limit: pageSize }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_PURCHASE_ORDERS, [query.data]);
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
 * Hook to fetch paginated purchase returns for a specific supplier (for debt calculation)
 */
export function useSupplierPurchaseReturnsPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<PurchaseReturn> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['purchase-returns', 'supplier-paginated', supplierId, page, pageSize],
    queryFn: () => fetchPurchaseReturns({ supplierId: supplierId!, page, limit: pageSize }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_PURCHASE_RETURNS, [query.data]);
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

// ====================================
// DEBT TRANSACTIONS (Công nợ)
// ====================================

export interface DebtTransaction {
  systemId: string;
  documentId: string;
  type: 'po' | 'payment' | 'receipt' | 'return';
  creator: string;
  date: string;
  createdAt: string;
  description: string;
  change: number;
  balance: number;
}

interface DebtTransactionsResponse {
  data: DebtTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchSupplierDebtTransactions(params: {
  supplierId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<DebtTransactionsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  
  const url = `/api/suppliers/${params.supplierId}/debt-transactions?${searchParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch debt transactions: ${response.statusText}`);
  }
  
  return response.json();
}

const EMPTY_DEBT_TRANSACTIONS: DebtTransaction[] = [];

/**
 * Hook to fetch paginated debt transactions for a specific supplier
 * Includes PO, payments, receipts, and returns with server-calculated running balance
 */
export function useSupplierDebtTransactionsPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<DebtTransaction> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);

  const query = useQuery({
    queryKey: ['supplier-debt-transactions', supplierId, page, pageSize],
    queryFn: () => fetchSupplierDebtTransactions({ 
      supplierId: supplierId!, 
      page, 
      limit: pageSize 
    }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    // ✅ Always refetch on mount to ensure fresh data after mutations from other pages
    refetchOnMount: 'always',
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_DEBT_TRANSACTIONS, [query.data]);
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

// ====================================
// PRODUCTS ORDERED / RETURNED
// ====================================

export interface ProductOrdered {
  id: string;           // Unique row id
  systemId: string;     // System ID for RelatedDataTable compatibility
  orderId: string;      // PO business ID
  orderDate: string | null;
  productId: string;
  productSku: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface ProductReturned {
  id: string;           // Unique row id
  systemId: string;     // System ID for RelatedDataTable compatibility
  returnId: string;     // Return business ID
  returnDate: string | null;
  productId: string;
  productSku: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string | null;
}

interface ProductsOrderedResponse {
  data: ProductOrdered[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface ProductsReturnedResponse {
  data: ProductReturned[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchSupplierProductsOrdered(params: {
  supplierId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProductsOrderedResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  
  const url = `/api/suppliers/${params.supplierId}/products-ordered?${searchParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products ordered: ${response.statusText}`);
  }
  
  return response.json();
}

async function fetchSupplierProductsReturned(params: {
  supplierId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ProductsReturnedResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  
  const url = `/api/suppliers/${params.supplierId}/products-returned?${searchParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch products returned: ${response.statusText}`);
  }
  
  return response.json();
}

const EMPTY_PRODUCTS_ORDERED: ProductOrdered[] = [];
const EMPTY_PRODUCTS_RETURNED: ProductReturned[] = [];

/**
 * Hook to fetch paginated products ordered from a specific supplier
 */
export function useSupplierProductsOrderedPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<ProductOrdered> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);
  const [search, setSearchRaw] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = React.useCallback((value: string) => setSearchRaw(value), []);

  const query = useQuery({
    queryKey: ['supplier-products-ordered', supplierId, page, pageSize, debouncedSearch],
    queryFn: () => fetchSupplierProductsOrdered({ 
      supplierId: supplierId!, 
      page, 
      limit: pageSize,
      search: debouncedSearch || undefined,
    }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_PRODUCTS_ORDERED, [query.data]);
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
    search,
    setSearch,
  };
}

/**
 * Hook to fetch paginated products returned to a specific supplier
 */
export function useSupplierProductsReturnedPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<ProductReturned> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);
  const [search, setSearchRaw] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = React.useCallback((value: string) => setSearchRaw(value), []);

  const query = useQuery({
    queryKey: ['supplier-products-returned', supplierId, page, pageSize, debouncedSearch],
    queryFn: () => fetchSupplierProductsReturned({ 
      supplierId: supplierId!, 
      page, 
      limit: pageSize,
      search: debouncedSearch || undefined,
    }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_PRODUCTS_RETURNED, [query.data]);
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
    search,
    setSearch,
  };
}

// ====================================
// SUPPLIER WARRANTIES (Bảo hành NCC)
// ====================================

const EMPTY_WARRANTIES: SupplierWarranty[] = [];

/**
 * Hook to fetch paginated warranties for a specific supplier
 */
export function useSupplierWarrantiesPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<SupplierWarranty> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);
  const [search, setSearchRaw] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = React.useCallback((value: string) => setSearchRaw(value), []);

  const query = useQuery({
    queryKey: ['supplier-warranties', 'supplier-paginated', supplierId, page, pageSize, debouncedSearch],
    queryFn: () => fetchSupplierWarranties({ 
      supplierId: supplierId!, 
      page, 
      limit: pageSize,
      search: debouncedSearch || undefined,
    }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
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
    search,
    setSearch,
  };
}

// ====================================
// SUPPLIER WARRANTY PRODUCTS (SP đã bảo hành)
// ====================================

export interface WarrantyProduct {
  id: string;
  systemId: string;
  warrantyId: string;
  warrantyBusinessId: string;
  warrantyDate: string | null;
  warrantyStatus: string;
  productId: string;
  productSku: string;
  productName: string;
  productImage: string | null;
  sentQuantity: number;
  returnedQuantity: number;
  unitPrice: number;
  warrantyCost: number;
  warrantyResult: string | null;
}

interface WarrantyProductsResponse {
  data: WarrantyProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchSupplierWarrantyProducts(params: {
  supplierId: string;
  page?: number;
  limit?: number;
  search?: string;
}): Promise<WarrantyProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  
  const url = `/api/suppliers/${params.supplierId}/warranty-products?${searchParams}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch warranty products: ${response.statusText}`);
  }
  
  return response.json();
}

const EMPTY_WARRANTY_PRODUCTS: WarrantyProduct[] = [];

/**
 * Hook to fetch paginated warranty products for a specific supplier
 */
export function useSupplierWarrantyProductsPaginated(
  supplierId: string | undefined | null,
  options?: FinancialHookOptions
): PaginatedResult<WarrantyProduct> {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(options?.initialPageSize || 20);
  const [search, setSearchRaw] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const setSearch = React.useCallback((value: string) => setSearchRaw(value), []);

  const query = useQuery({
    queryKey: ['supplier-warranty-products', supplierId, page, pageSize, debouncedSearch],
    queryFn: () => fetchSupplierWarrantyProducts({ 
      supplierId: supplierId!, 
      page, 
      limit: pageSize,
      search: debouncedSearch || undefined,
    }),
    enabled: !!supplierId && options?.enabled !== false,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: 'always',
  });

  const data = React.useMemo(() => query.data?.data || EMPTY_WARRANTY_PRODUCTS, [query.data]);
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
    search,
    setSearch,
  };
}
