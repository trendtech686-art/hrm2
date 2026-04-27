/**
 * Hook to fetch last purchase price for a product
 * Used by PriceSelector component in purchase orders
 */
import { useQuery } from '@tanstack/react-query';

interface PriceHistoryEntry {
  date: string;
  price: number;
  orderId: string;
  quantity: number;
}

interface LastPurchasePrice {
  lastPrice: number;
  lastOrderDate: string | null;
  lastSupplierId: string | null;
  lastSupplierName: string | null;
  priceHistory: PriceHistoryEntry[];
  averagePrice: number;
}

async function fetchProductPricing(
  productId: string,
  supplierId?: string
): Promise<LastPurchasePrice> {
  const params = new URLSearchParams();
  params.set('limit', '10'); // Get last 10 entries for history
  
  if (supplierId) {
    params.set('supplierId', supplierId);
  }
  
  const url = `/api/products/${productId}/price-history?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch price history');
  }
  
  const result = await response.json() as { data: Array<{
    date: string;
    price: number;
    purchaseOrderId: string;
    supplierName: string;
    note: string;
  }> };
  
  const entries = result.data || [];
  
  // Calculate last purchase price
  const lastEntry = entries[0];
  const lastPrice = lastEntry?.price || 0;
  const lastOrderDate = lastEntry?.date || null;
  const lastSupplierName = lastEntry?.supplierName || null;
  
  // Calculate average price from history
  const averagePrice = entries.length > 0
    ? entries.reduce((sum, e) => sum + e.price, 0) / entries.length
    : 0;
  
  // Transform to price history entries
  const priceHistory: PriceHistoryEntry[] = entries.slice(0, 5).map((entry) => ({
    date: entry.date,
    price: entry.price,
    orderId: entry.purchaseOrderId || '',
    quantity: 1, // Not available from price-history API
  }));
  
  return {
    lastPrice,
    lastOrderDate,
    lastSupplierId: null, // Not directly available
    lastSupplierName,
    priceHistory,
    averagePrice: Math.round(averagePrice),
  };
}

export function useProductLastPurchasePrice(
  productId: string | null | undefined,
  lastPurchasePriceFromProduct?: number | null,
  supplierId?: string
) {
  return useQuery({
    queryKey: ['product', 'lastPurchasePrice', productId, supplierId],
    queryFn: async () => {
      if (!productId) {
        return null;
      }
      
      // Use lastPurchasePrice from product if available
      if (lastPurchasePriceFromProduct && lastPurchasePriceFromProduct > 0) {
        return {
          lastPrice: lastPurchasePriceFromProduct,
          lastOrderDate: null,
          lastSupplierId: null,
          lastSupplierName: null,
          priceHistory: [] as PriceHistoryEntry[],
          averagePrice: lastPurchasePriceFromProduct,
        };
      }
      
      // Fallback to API fetch for price history
      try {
        return await fetchProductPricing(productId, supplierId);
      } catch {
        return null;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
