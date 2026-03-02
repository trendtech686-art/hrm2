/**
 * Hooks for fetching product-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific product,
 * instead of loading ALL data and filtering client-side.
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import type { Order, WarrantyTicket, PurchaseOrder, InventoryReceipt, InventoryCheck, StockTransfer } from '@/lib/types/prisma-extended';

// Stable empty arrays
const EMPTY_ORDERS: Order[] = [];
const EMPTY_WARRANTIES: WarrantyTicket[] = [];
const EMPTY_PURCHASE_ORDERS: PurchaseOrder[] = [];
const EMPTY_INVENTORY_RECEIPTS: InventoryReceipt[] = [];
const EMPTY_INVENTORY_CHECKS: InventoryCheck[] = [];
const EMPTY_STOCK_TRANSFERS: StockTransfer[] = [];

/**
 * Fetch orders that contain a specific product
 */
export function useProductOrders(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['orders', 'product', productSystemId],
    queryFn: () => fetchAllPages<Order>(async (p) => {
      const response = await fetch(`/api/orders?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }),
    enabled: !!productSystemId,
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
    refetch: query.refetch,
  };
}

/**
 * Fetch warranties that contain a specific product
 */
export function useProductWarranties(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['warranties', 'product', productSystemId],
    queryFn: () => fetchAllPages<WarrantyTicket>(async (p) => {
      const response = await fetch(`/api/warranty?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch warranties');
      return response.json();
    }),
    enabled: !!productSystemId,
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
    refetch: query.refetch,
  };
}

/**
 * Fetch purchase orders that contain a specific product
 */
export function useProductPurchaseOrders(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['purchaseOrders', 'product', productSystemId],
    queryFn: () => fetchAllPages<PurchaseOrder>(async (p) => {
      const response = await fetch(`/api/purchase-orders?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch purchase orders');
      return response.json();
    }),
    enabled: !!productSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_PURCHASE_ORDERS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Fetch inventory receipts that contain a specific product
 */
export function useProductInventoryReceipts(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['inventoryReceipts', 'product', productSystemId],
    queryFn: () => fetchAllPages<InventoryReceipt>(async (p) => {
      const response = await fetch(`/api/inventory-receipts?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch inventory receipts');
      return response.json();
    }),
    enabled: !!productSystemId,
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
 * Fetch inventory checks that contain a specific product
 */
export function useProductInventoryChecks(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['inventoryChecks', 'product', productSystemId],
    queryFn: () => fetchAllPages<InventoryCheck>(async (p) => {
      const response = await fetch(`/api/inventory-checks?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch inventory checks');
      return response.json();
    }),
    enabled: !!productSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_INVENTORY_CHECKS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

/**
 * Fetch stock transfers that contain a specific product
 */
export function useProductStockTransfers(productSystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['stockTransfers', 'product', productSystemId],
    queryFn: () => fetchAllPages<StockTransfer>(async (p) => {
      const response = await fetch(`/api/stock-transfers?productSystemId=${productSystemId}&page=${p.page}&limit=${p.limit}`);
      if (!response.ok) throw new Error('Failed to fetch stock transfers');
      return response.json();
    }),
    enabled: !!productSystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() => 
    query.data || EMPTY_STOCK_TRANSFERS,
    [query.data]
  );

  return {
    data,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
