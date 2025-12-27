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
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
