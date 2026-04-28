/**
 * Order Search API
 * Server-side search for orders to handle large datasets
 */

import type { Order } from '@/lib/types/prisma-extended';
import { formatOrderAddress } from './address-utils';
import { logError } from '@/lib/logger'

export interface OrderSearchResult {
  value: string;      // systemId
  label: string;      // Display text (e.g., "DH000001 - Nguyễn Văn A")
  subtitle?: string;  // Additional info (e.g., "1,500,000 đ - 0901234567")
}

export interface OrderSearchParams {
  query: string;
  limit?: number | undefined;
  page?: number | undefined;             // Page number for pagination (1-indexed)
  branchSystemId?: string | undefined;  // Filter by branch
  status?: string | undefined;          // Filter by status
  statusNotIn?: string | undefined;    // Comma-separated statuses to exclude
  customerSystemId?: string | undefined; // Filter by customer
  stockOutStatusNot?: string | undefined; // Exclude stock out status
  stockOutStatus?: string | undefined;   // Exact match stock out status
  paymentStatusNot?: string | undefined;  // Exclude payment status
}

/**
 * Search orders with real API call
 * ⚡ OPTIMIZED: Uses server-side search instead of client-side filtering
 */
export async function searchOrders(
  params: OrderSearchParams
): Promise<OrderSearchResult[]> {
  const { query, limit = 50, page, branchSystemId, status, statusNotIn, customerSystemId, stockOutStatusNot, stockOutStatus, paymentStatusNot } = params;
  
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('search', query);
  if (limit) searchParams.set('limit', String(limit));
  if (page && page > 1) searchParams.set('page', String(page));
  if (branchSystemId) searchParams.set('branchSystemId', branchSystemId);
  if (status) searchParams.set('status', status);
  if (statusNotIn) searchParams.set('statusNotIn', statusNotIn);
  if (customerSystemId) searchParams.set('customerSystemId', customerSystemId);
  if (stockOutStatusNot) searchParams.set('stockOutStatusNot', stockOutStatusNot);
  if (stockOutStatus) searchParams.set('stockOutStatus', stockOutStatus);
  if (paymentStatusNot) searchParams.set('paymentStatusNot', paymentStatusNot);
  
  try {
    const response = await fetch(`/api/orders?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const orders: Order[] = data.data || [];
    
    return orders.map(orderToSearchResult);
  } catch (error) {
    logError('Failed to search orders', error);
    return [];
  }
}

/**
 * @deprecated Use searchOrders() without ordersData parameter
 * Legacy function kept for backward compatibility
 */
export async function searchOrdersLegacy(
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
  const results = filtered.filter(order => {
    const shippingAddressText = formatOrderAddress(order.shippingAddress);
    return (
      order.id.toLowerCase().includes(queryLower) ||
      order.customerName.toLowerCase().includes(queryLower) ||
      (shippingAddressText && shippingAddressText.toLowerCase().includes(queryLower))
    );
  });
  
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
  
  // Format date to dd/MM/yyyy HH:mm
  let formattedDate = '';
  try {
    const d = new Date(order.orderDate);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    } else {
      formattedDate = String(order.orderDate);
    }
  } catch {
    formattedDate = String(order.orderDate);
  }
  
  return {
    value: order.systemId,
    label: `${order.id} - ${order.customerName}`,
    subtitle: `${amount.toLocaleString('vi-VN')} đ - ${formattedDate}`
  };
}

export interface PaginatedOrderSearchResult {
  results: OrderSearchResult[];
  total: number;
  hasMore: boolean;
}

/**
 * Search orders with pagination support (for infinite scroll)
 */
export async function searchOrdersPaginated(
  params: OrderSearchParams & { page?: number }
): Promise<PaginatedOrderSearchResult> {
  const { query, limit = 30, branchSystemId, status, statusNotIn, customerSystemId, stockOutStatusNot, stockOutStatus, page = 1 } = params;
  
  const searchParams = new URLSearchParams();
  if (query) searchParams.set('search', query);
  searchParams.set('limit', String(limit));
  searchParams.set('page', String(page));
  if (branchSystemId) searchParams.set('branchSystemId', branchSystemId);
  if (status) searchParams.set('status', status);
  if (statusNotIn) searchParams.set('statusNotIn', statusNotIn);
  if (customerSystemId) searchParams.set('customerSystemId', customerSystemId);
  if (stockOutStatusNot) searchParams.set('stockOutStatusNot', stockOutStatusNot);
  if (stockOutStatus) searchParams.set('stockOutStatus', stockOutStatus);
  
  try {
    const response = await fetch(`/api/orders?${searchParams}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const orders: Order[] = data.data || [];
    const total: number = data.pagination?.total ?? orders.length;
    
    return {
      results: orders.map(orderToSearchResult),
      total,
      hasMore: page * limit < total,
    };
  } catch (error) {
    logError('Failed to search orders (paginated)', error);
    return { results: [], total: 0, hasMore: false };
  }
}

/**
 * Get order by systemId
 */
export function getOrderById(systemId: string, ordersData: Order[]): Order | undefined {
  return ordersData.find(o => o.systemId === systemId);
}
