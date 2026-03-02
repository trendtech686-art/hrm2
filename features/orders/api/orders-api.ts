/**
 * Orders API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */

import type { Order } from '@/lib/types/prisma-extended';
import { convertOrderForApi } from '@/lib/constants/order-enums';

const API_BASE = '/api/orders';

export interface OrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  stockOutStatus?: string;
  enabled?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateOrderInput {
  // Required fields
  customerSystemId: string;
  customerName: string;
  branchSystemId: string;
  branchName: string;
  salespersonSystemId: string;
  salesperson: string;
  lineItems: Array<{
    productSystemId: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    discountType?: 'percentage' | 'fixed';
    tax?: number;
    note?: string;
  }>;
  orderDate: string;
  
  // Optional fields
  shippingAddress?: string | Record<string, unknown>;
  billingAddress?: string | Record<string, unknown>;
  notes?: string;
  tags?: string[];
  status?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  stockOutStatus?: string;
  returnStatus?: string;
  deliveryMethod?: string;
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  grandTotal?: number;
  paidAmount?: number;
  codAmount?: number;
  packagings?: unknown[];
  payments?: unknown[];
  completedDate?: string | null;
  createdAt?: string;
}

export interface UpdateOrderInput {
  id: string;
  // Allow partial update of any Order field
  [key: string]: unknown;
}

/**
 * Fetch paginated orders list
 */
export async function fetchOrders(params: OrdersParams = {}): Promise<PaginatedResponse<Order>> {
  const { page = 1, limit = 50, ...rest } = params;
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  
  // Add optional params
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}?${searchParams}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch single order by ID
 */
export async function fetchOrder(id: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch order ${id}: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Create new order
 */
export async function createOrder(data: CreateOrderInput): Promise<Order> {
  // Convert Vietnamese status strings to Prisma enum values
  const convertedData = convertOrderForApi(data as unknown as Record<string, unknown>);
  
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(convertedData),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create order: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update existing order
 */
export async function updateOrder({ id, ...data }: UpdateOrderInput): Promise<Order> {
  // Convert Vietnamese status strings to Prisma enum values
  const convertedData = convertOrderForApi(data as Record<string, unknown>);
  
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(convertedData),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update order: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete order
 */
export async function deleteOrder(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete order: ${res.statusText}`);
  }
}

/**
 * Fetch order stats (for dashboard)
 */
export async function fetchOrderStats(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
}> {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) {
    throw new Error(`Failed to fetch order stats: ${res.statusText}`);
  }
  return res.json();
}

// ========================================
// CURSOR-BASED PAGINATION (for large datasets)
// ========================================

export interface CursorOrdersParams {
  limit?: number;
  cursor?: string;  // systemId of last item
  direction?: 'next' | 'prev';
  search?: string;
  status?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  customerId?: string;
  branchId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CursorPaginatedResponse<T> {
  data: T[];
  pagination: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    previousCursor: string | null;
    limit: number;
  };
}

/**
 * Fetch orders with cursor-based pagination
 * RECOMMENDED for large datasets (1000+ records)
 * 
 * @example
 * // First page
 * const { data, pagination } = await fetchOrdersCursor({ limit: 20 });
 * 
 * // Next page
 * const nextPage = await fetchOrdersCursor({ 
 *   limit: 20, 
 *   cursor: pagination.nextCursor 
 * });
 */
export async function fetchOrdersCursor(
  params: CursorOrdersParams = {}
): Promise<CursorPaginatedResponse<Order>> {
  const { limit = 20, cursor, direction = 'next', ...rest } = params;
  
  const searchParams = new URLSearchParams({
    limit: String(Math.min(limit, 100)), // Max 100
  });
  
  if (cursor) {
    searchParams.set('cursor', cursor);
  }
  if (direction !== 'next') {
    searchParams.set('direction', direction);
  }
  
  // Add optional filter params
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '' && value !== 'all') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}/cursor?${searchParams}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch orders: ${res.statusText}`);
  }
  
  return res.json();
}

// ========================================
// ORDER ACTIONS
// ========================================

/**
 * Duplicate (copy) an order
 * Creates a new order with same line items, reset to PENDING status
 * 
 * @example
 * const newOrder = await duplicateOrder('ORDER000001');
 * console.log(newOrder.id); // 'DH000123' (new order)
 */
export async function duplicateOrder(
  systemId: string, 
  options?: { notes?: string; preserveNotes?: boolean }
): Promise<Order & { duplicatedFrom: string }> {
  const res = await fetch(`${API_BASE}/${systemId}/duplicate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options || {}),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Sao chép đơn hàng thất bại');
  }
  
  return res.json();
}
