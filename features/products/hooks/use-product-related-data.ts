/**
 * Hooks for fetching product-specific related data
 * 
 * ⚡ PERFORMANCE: These hooks fetch only data related to a specific product,
 * instead of loading ALL data and filtering client-side.
 * 
 * ✅ Uses proper API functions with server-side filtering via:
 * - Orders: lineItems.productId = productSystemId
 * - Warranties: productId (FK to Product.systemId) = productSystemId
 * - Stock Transfers: items.productId = productSystemId
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../../orders/api/orders-api';
import { fetchWarranties } from '../../warranty/api/warranties-api';
import { fetchStockTransfers } from '../../stock-transfers/api/stock-transfers-api';

// ═══════════════════════════════════════════════════════════════
// ORDERS for a specific product (via lineItems server-side filter)
// ═══════════════════════════════════════════════════════════════

export function useProductOrders(productSystemId: string | undefined | null) {
  return useQuery({
    queryKey: ['orders', 'byProduct', productSystemId],
    queryFn: async () => {
      const res = await fetchOrders({ productSystemId: productSystemId! });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productSystemId,
  });
}

// ═══════════════════════════════════════════════════════════════
// WARRANTIES for a specific product (via productId FK server-side)
// ═══════════════════════════════════════════════════════════════

export function useProductWarranties(productSystemId: string | undefined | null) {
  return useQuery({
    queryKey: ['warranties', 'byProduct', productSystemId],
    queryFn: async () => {
      const res = await fetchWarranties({ productId: productSystemId! });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productSystemId,
  });
}

// ═══════════════════════════════════════════════════════════════
// STOCK TRANSFERS for a specific product (via items server-side)
// ═══════════════════════════════════════════════════════════════

export function useProductStockTransfers(productSystemId: string | undefined | null) {
  return useQuery({
    queryKey: ['stockTransfers', 'byProduct', productSystemId],
    queryFn: async () => {
      const res = await fetchStockTransfers({ productSystemId: productSystemId! });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productSystemId,
  });
}
