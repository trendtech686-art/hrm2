import * as React from 'react';
import { searchOrders, type OrderSearchResult } from '../../../../orders/order-search-api';
import type { Order } from '../../../../orders/types';

interface UseOrderSearchOptions {
  orders: Order[];
  initialOrderId?: string;
}

/**
 * Hook quản lý tìm kiếm và chọn đơn hàng
 */
export function useOrderSearch({ orders, initialOrderId }: UseOrderSearchOptions) {
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | undefined>(initialOrderId);

  // Server-side search for orders with debounce - ONLY SHOW ORDERS NOT SHIPPED YET
  React.useEffect(() => {
    const performSearch = async () => {
      setIsSearchingOrders(true);
      try {
        const results = await searchOrders(
          { query: orderSearchQuery, limit: 50 },
          orders
        );
        
        // Filter: Only show orders that:
        // 1. NOT been shipped yet (stockOutStatus === 'Chưa xuất kho')
        // 2. Still have remaining amount to deduct (grandTotal - paidAmount > 0)
        const unshippedResults = results.filter(result => {
          const order = orders.find(o => o.systemId === result.value);
          if (!order) return false;
          
          if (order.stockOutStatus !== 'Chưa xuất kho') return false;
          
          const paidAmount = order.paidAmount || 0;
          const remainingAmount = order.grandTotal - paidAmount;
          
          return remainingAmount > 0;
        });
        
        // Update subtitle to show remaining amount
        const resultsWithRemaining = unshippedResults.map(result => {
          const order = orders.find(o => o.systemId === result.value);
          if (!order) return result;
          
          const paidAmount = order.paidAmount || 0;
          const remainingAmount = order.grandTotal - paidAmount;
          
          return {
            ...result,
            subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`,
          };
        });
        
        setOrderSearchResults(resultsWithRemaining);
      } catch (error) {
        console.error('Order search error:', error);
        setOrderSearchResults([]);
      } finally {
        setIsSearchingOrders(false);
      }
    };

    performSearch();
  }, [orderSearchQuery, orders]);

  // Get selected order value for VirtualizedCombobox
  const selectedOrderValue = React.useMemo(() => {
    if (!selectedOrderId) return null;
    const order = orders.find(o => o.systemId === selectedOrderId);
    if (!order) return null;
    
    const paidAmount = order.paidAmount || 0;
    const remainingAmount = order.grandTotal - paidAmount;
    
    return {
      value: order.systemId,
      label: `${order.id} - ${order.customerName}`,
      subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`
    };
  }, [selectedOrderId, orders]);

  // Get selected order details
  const selectedOrder = React.useMemo(() => 
    orders.find(o => o.systemId === selectedOrderId),
    [orders, selectedOrderId]
  );

  // Get order remaining amount
  const orderRemainingAmount = React.useMemo(() => {
    if (!selectedOrder) return 0;
    const orderPaidAmount = selectedOrder.paidAmount || 0;
    return Math.max(selectedOrder.grandTotal - orderPaidAmount, 0);
  }, [selectedOrder]);

  return {
    orderSearchQuery,
    setOrderSearchQuery,
    orderSearchResults,
    isSearchingOrders,
    selectedOrderId,
    setSelectedOrderId,
    selectedOrderValue,
    selectedOrder,
    orderRemainingAmount,
  };
}
