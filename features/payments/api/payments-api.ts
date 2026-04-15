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
  category?: PaymentCategory | string; // Allow comma-separated categories for API filtering
  recipientTypeSystemId?: string;
  recipientSystemId?: string;
  supplierId?: string; // ✅ Filter for supplier detail page
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
  customerMatchBroad?: boolean;
  customerName?: string;
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
  
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.category) searchParams.set('category', params.category);
  if (params.recipientTypeSystemId) searchParams.set('recipientTypeSystemId', params.recipientTypeSystemId);
  if (params.recipientSystemId) searchParams.set('recipientSystemId', params.recipientSystemId);
  if (params.supplierId) searchParams.set('supplierId', params.supplierId);
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
  if (params.customerMatchBroad) searchParams.set('customerMatchBroad', 'true');
  if (params.customerName) searchParams.set('customerName', params.customerName);
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
