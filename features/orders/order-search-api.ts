/**
 * Order Search API
 * Server-side search for orders to handle large datasets
 */

import type { Order } from './types.ts';

export interface OrderSearchResult {
  value: string;      // systemId
  label: string;      // Display text (e.g., "DH000001 - Nguyễn Văn A")
  subtitle?: string;  // Additional info (e.g., "1,500,000 đ - 0901234567")
}

export interface OrderSearchParams {
  query: string;
  limit?: number;
  branchSystemId?: string;  // Filter by branch
  status?: string;          // Filter by status
}

/**
 * Search orders with server-side filtering
 * This simulates an API call but uses Zustand store for now
 * TODO: Replace with actual API endpoint when backend is ready
 */
export async function searchOrders(
  params: OrderSearchParams,
  ordersData: Order[]
): Promise<OrderSearchResult[]> {
  const { query, limit = 50, branchSystemId, status } = params;
  
  // Simulate API delay (remove in production)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const queryLower = query.toLowerCase().trim();
  
  let filtered = ordersData;
  
  // Filter by branch if specified
  if (branchSystemId) {
    filtered = filtered.filter(o => o.branchSystemId === branchSystemId);
  }
  
  // Filter by status if specified
  if (status) {
    filtered = filtered.filter(o => o.status === status);
  }
  
  // If no query, return most recent orders
  if (!queryLower) {
    return filtered
      .slice(-limit)
      .reverse()
      .map(orderToSearchResult);
  }
  
  // Search by ID, customer name, or shipping address
  const results = filtered.filter(order => 
    order.id.toLowerCase().includes(queryLower) ||
    order.customerName.toLowerCase().includes(queryLower) ||
    order.shippingAddress?.toLowerCase().includes(queryLower)
  );
  
  // Sort by relevance (exact match first, then partial)
  results.sort((a, b) => {
    const aExact = a.id.toLowerCase() === queryLower ? 1 : 0;
    const bExact = b.id.toLowerCase() === queryLower ? 1 : 0;
    return bExact - aExact;
  });
  
  return results
    .slice(0, limit)
    .map(orderToSearchResult);
}

/**
 * Convert Order to SearchResult format
 */
function orderToSearchResult(order: Order): OrderSearchResult {
  const amount = order.grandTotal || 0;
  
  return {
    value: order.systemId,
    label: `${order.id} - ${order.customerName}`,
    subtitle: `${amount.toLocaleString('vi-VN')} đ - ${order.orderDate}`
  };
}

/**
 * Get order by systemId
 */
export function getOrderById(systemId: string, ordersData: Order[]): Order | undefined {
  return ordersData.find(o => o.systemId === systemId);
}
