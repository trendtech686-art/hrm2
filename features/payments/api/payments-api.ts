/**
 * Payments (Phiếu Chi) API functions
 * 
 * ⚠️ Direct import: import { fetchPayments } from '@/features/payments/api/payments-api'
 */

import type { SystemId } from '@/lib/id-types';
import type { Payment, PaymentStatus, PaymentCategory } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/payments';

export interface PaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  category?: PaymentCategory;
  recipientTypeSystemId?: string;
  recipientSystemId?: string;
  branchId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // ✅ New filters for order detail page performance
  linkedOrderSystemId?: string;
  linkedSalesReturnSystemId?: string;
  customerSystemId?: string;
  // ✅ Filter for purchase order detail page
  purchaseOrderSystemId?: string;
  // ✅ Filter for warranty detail page
  linkedWarrantySystemId?: string;
  enabled?: boolean;
}

export interface PaymentsResponse {
  data: Payment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function fetchPayments(params: PaymentsParams = {}): Promise<PaymentsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category) searchParams.set('category', params.category);
  if (params.recipientTypeSystemId) searchParams.set('recipientTypeSystemId', params.recipientTypeSystemId);
  if (params.recipientSystemId) searchParams.set('recipientSystemId', params.recipientSystemId);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.accountId) searchParams.set('accountId', params.accountId);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  // ✅ New filters for order detail page
  if (params.linkedOrderSystemId) searchParams.set('linkedOrderSystemId', params.linkedOrderSystemId);
  if (params.linkedSalesReturnSystemId) searchParams.set('linkedSalesReturnSystemId', params.linkedSalesReturnSystemId);
  if (params.customerSystemId) searchParams.set('customerSystemId', params.customerSystemId);
  // ✅ Filter for purchase order detail page
  if (params.purchaseOrderSystemId) searchParams.set('purchaseOrderSystemId', params.purchaseOrderSystemId);
  // ✅ Filter for warranty detail page
  if (params.linkedWarrantySystemId) searchParams.set('linkedWarrantySystemId', params.linkedWarrantySystemId);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payments: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchPayment(systemId: SystemId): Promise<Payment> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payment: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createPayment(data: Omit<Payment, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create payment');
  }
  
  return response.json();
}

export async function updatePayment(systemId: SystemId, data: Partial<Payment>): Promise<Payment> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update payment');
  }
  
  return response.json();
}

export async function deletePayment(systemId: SystemId): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete payment: ${response.statusText}`);
  }
}

export async function cancelPayment(systemId: SystemId, reason?: string): Promise<Payment> {
  const response = await fetch(`${BASE_URL}/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel payment');
  }
  
  return response.json();
}

export async function fetchPaymentStats(): Promise<{
  total: number;
  completed: number;
  cancelled: number;
  totalAmount: number;
}> {
  const response = await fetch(`${BASE_URL}/stats`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch payment stats: ${response.statusText}`);
  }
  
  return response.json();
}
