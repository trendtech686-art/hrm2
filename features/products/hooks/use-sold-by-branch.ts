import * as React from 'react';
import { useAllOrders } from '../../orders/hooks/use-all-orders';
import { useProductFinder } from './use-all-products';
import type { SystemId } from '@/lib/id-types';

/**
 * Hook to calculate sold quantity per branch for a product
 */
export function useSoldByBranch(productSystemId: SystemId | undefined) {
  const { data: allOrders, isLoading } = useAllOrders();
  const { findById: findProductById } = useProductFinder();

  const product = React.useMemo(
    () => productSystemId ? findProductById(productSystemId) : undefined,
    [productSystemId, findProductById]
  );

  const soldByBranch = React.useMemo((): Record<string, number> => {
    if (!product || !productSystemId) return {};
    
    const productSku = product.id;
    const result: Record<string, number> = {};
    const completedStatuses = ['COMPLETED', 'DELIVERED', 'Hoàn thành', 'Đã giao hàng'];

    for (const order of allOrders) {
      // Only count completed orders
      if (!completedStatuses.includes(order.status)) continue;

      // Get branch
      const branchId = (order as { branchSystemId?: string; branchId?: string }).branchSystemId || 
                       (order as { branchId?: string }).branchId;
      if (!branchId) continue;

      // Check if order has this product
      const lineItem = order.lineItems?.find(
        (item: { productSystemId?: string; productId?: string; productSku?: string }) =>
          item.productSystemId === productSystemId ||
          item.productId === productSystemId ||
          (productSku && item.productId === productSku) ||
          (productSku && item.productSku === productSku)
      );

      if (lineItem) {
        const qty = (lineItem as { quantity: number }).quantity;
        result[branchId] = (result[branchId] || 0) + qty;
      }
    }

    return result;
  }, [allOrders, product, productSystemId]);

  return { soldByBranch, isLoading };
}
