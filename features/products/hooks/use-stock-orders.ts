import * as React from 'react';
import { useAllOrders } from '../../orders/hooks/use-all-orders';
import { useAllWarranties } from '../../warranty/hooks/use-all-warranties';
import { useProductFinder } from './use-all-products';
import type { StockOrderItem, StockOrderType } from '../components/stock-orders-dialog';
import type { SystemId } from '@/lib/id-types';

interface UseStockOrdersOptions {
  productSystemId: SystemId;
  branchSystemId: string;
  type: StockOrderType;
  enabled?: boolean;
}

/**
 * Get friendly status for committed orders based on stockOutStatus
 */
function getCommittedStatus(stockOutStatus?: string | null): string {
  if (!stockOutStatus || stockOutStatus === 'NOT_STOCKED_OUT') {
    return 'Chờ xuất kho';
  }
  if (stockOutStatus === 'PARTIALLY_STOCKED_OUT') {
    return 'Đã xuất một phần';
  }
  // FULLY_STOCKED_OUT orders are filtered out - shouldn't reach here
  return 'Chờ xuất kho';
}

/**
 * Get friendly status for in-delivery orders based on order.status
 */
function getDeliveryStatus(status?: string | null): string {
  if (status === 'SHIPPING' || status === 'Đang giao') {
    return 'Đang giao';
  }
  if (status === 'PROCESSING' || status === 'Đang giao dịch') {
    return 'Đang vận chuyển';
  }
  return status || 'Đang vận chuyển';
}

/**
 * Hook to fetch stock orders (committed, in-transit, in-delivery) for a product at a branch
 */
export function useStockOrders({
  productSystemId,
  branchSystemId,
  type,
  enabled = true,
}: UseStockOrdersOptions) {
  const { data: allOrders, isLoading: ordersLoading } = useAllOrders({ enabled });
  const { data: allWarranties, isLoading: warrantiesLoading } = useAllWarranties();
  const { findById: findProductById } = useProductFinder();

  const product = React.useMemo(
    () => findProductById(productSystemId),
    [productSystemId, findProductById]
  );

  const items = React.useMemo((): StockOrderItem[] => {
    const productSku = product?.id;
    const results: StockOrderItem[] = [];

    // Helper to check if order contains this product
    const orderHasProduct = (order: typeof allOrders[0]) => {
      return order.lineItems?.some(
        (item: { productSystemId?: string; productId?: string; productSku?: string }) =>
          item.productSystemId === productSystemId ||
          item.productId === productSystemId ||
          (productSku && item.productId === productSku) ||
          (productSku && item.productSku === productSku)
      );
    };

    // Helper to get line item for this product
    const getLineItem = (order: typeof allOrders[0]) => {
      return order.lineItems?.find(
        (item: { productSystemId?: string; productId?: string; productSku?: string }) =>
          item.productSystemId === productSystemId ||
          item.productId === productSystemId ||
          (productSku && item.productId === productSku) ||
          (productSku && item.productSku === productSku)
      );
    };

    // Helper to get order branch
    const getOrderBranch = (order: typeof allOrders[0]) => {
      return (order as { branchSystemId?: string; branchId?: string }).branchSystemId || 
             (order as { branchId?: string }).branchId;
    };

    // Filter orders based on type
    for (const order of allOrders) {
      const orderBranchId = getOrderBranch(order);
      if (orderBranchId !== branchSystemId) continue;
      if (!orderHasProduct(order)) continue;

      const lineItem = getLineItem(order);
      if (!lineItem) continue;

      // Type-specific filtering
      if (type === 'committed') {
        // Committed: Not cancelled, not completed, not fully dispatched
        const cancelledStatuses = ['CANCELLED', 'Đã hủy'];
        const completedStatuses = ['COMPLETED', 'DELIVERED', 'Hoàn thành', 'Đã giao hàng'];
        const dispatchedStatuses = ['FULLY_STOCKED_OUT', 'Xuất kho toàn bộ'];

        if (cancelledStatuses.includes(order.status)) continue;
        if (completedStatuses.includes(order.status)) continue;
        if (dispatchedStatuses.includes(order.stockOutStatus || '')) continue;

        // Show friendly status for committed orders
        const friendlyStatus = getCommittedStatus(order.stockOutStatus);
        
        results.push({
          id: order.id,
          systemId: order.systemId,
          type: 'order',
          date: order.orderDate || (order as { createdAt?: string }).createdAt,
          customerName: order.customerName,
          quantity: (lineItem as { quantity: number }).quantity,
          status: friendlyStatus,
          statusVariant: 'warning',
        });
      } else if (type === 'in-delivery') {
        // In-delivery: Dispatched but not yet delivered/completed
        const dispatchedStatuses = ['FULLY_STOCKED_OUT', 'Xuất kho toàn bộ'];
        const completedStatuses = ['COMPLETED', 'DELIVERED', 'Hoàn thành', 'Đã giao hàng', 'CANCELLED', 'Đã hủy'];

        if (!dispatchedStatuses.includes(order.stockOutStatus || '')) continue;
        if (completedStatuses.includes(order.status)) continue;

        // Get friendly status for in-delivery orders
        const deliveryStatus = getDeliveryStatus(order.status);
        
        results.push({
          id: order.id,
          systemId: order.systemId,
          type: 'order',
          date: order.orderDate,
          dispatchDate: (order as { dispatchedDate?: string }).dispatchedDate,
          customerName: order.customerName,
          shippingCarrier: (order as { shippingCarrier?: string }).shippingCarrier,
          trackingCode: (order as { trackingCode?: string }).trackingCode,
          quantity: (lineItem as { quantity: number }).quantity,
          status: deliveryStatus,
          statusVariant: 'secondary',
        });
      } else if (type === 'sold') {
        // Sold: Completed/Delivered orders
        const completedStatuses = ['COMPLETED', 'DELIVERED', 'Hoàn thành', 'Đã giao hàng'];
        
        if (!completedStatuses.includes(order.status)) continue;

        results.push({
          id: order.id,
          systemId: order.systemId,
          type: 'order',
          date: (order as { dispatchedDate?: string }).dispatchedDate || order.orderDate,
          customerName: order.customerName,
          quantity: (lineItem as { quantity: number }).quantity,
          status: order.status,
          statusVariant: 'success',
        });
      }
    }

    // Add warranties for committed type
    if (type === 'committed' && product) {
      for (const warranty of allWarranties) {
        if (!warranty.products || !Array.isArray(warranty.products)) continue;
        if (!warranty.branchSystemId || warranty.branchSystemId !== branchSystemId) continue;
        if (warranty.status === 'COMPLETED' || warranty.status === 'RETURNED' || warranty.status === 'CANCELLED') continue;

        const replacementItem = warranty.products.find(
          (item: { sku?: string; resolution?: string }) =>
            item.sku === product.id && item.resolution === 'replace'
        );
        if (!replacementItem) continue;

        results.push({
          id: warranty.id,
          systemId: warranty.systemId,
          type: 'warranty',
          date: warranty.createdAt,
          customerName: warranty.customerName,
          quantity: (replacementItem as { quantity?: number }).quantity || 1,
          status: warranty.status === 'PROCESSING' ? 'Chờ xử lý' : 'Đang xử lý',
          statusVariant: 'warning',
        });
      }
    }

    // Sort by date descending
    return results.sort((a, b) => {
      const dateA = new Date(a.dispatchDate || a.date || 0).getTime();
      const dateB = new Date(b.dispatchDate || b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [allOrders, allWarranties, product, productSystemId, branchSystemId, type]);

  return {
    items,
    isLoading: ordersLoading || warrantiesLoading,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}
