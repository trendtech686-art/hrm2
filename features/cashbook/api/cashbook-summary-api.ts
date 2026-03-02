/**
 * Cashbook API types and fetch functions
 */

import type { SystemId } from '@/lib/id-types';

export interface CashbookParams {
  startDate?: string;
  endDate?: string;
  branchId?: string;
  accountId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CashbookTransaction {
  systemId: SystemId;
  id: string;
  date: Date | string;
  amount: number;
  description?: string | null;
  targetName?: string | null;
  accountSystemId: string;
  branchSystemId?: string | null;
  branchName?: string | null;
  status: string;
  paymentMethodName?: string | null;
  paymentReceiptTypeName?: string | null;
  originalDocumentId?: string | null;
  createdBy?: string | null;
  createdAt: Date | string;
  type: 'receipt' | 'payment';
}

export interface CashbookSummary {
  openingBalance: number;
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
}

export interface CashbookResponse {
  transactions: CashbookTransaction[];
  summary: CashbookSummary;
  pagination: {
    page: number;
    limit: number;
    totalReceipts: number;
    totalPayments: number;
    total: number;
  };
}

const BASE_URL = '/api/cashbook';

export async function fetchCashbook(params: CashbookParams = {}): Promise<CashbookResponse> {
  const searchParams = new URLSearchParams();

  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.accountId) searchParams.set('accountId', params.accountId);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));

  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch cashbook data');
  }

  return response.json();
}
