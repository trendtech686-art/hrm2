/**
 * Cash Accounts API functions
 * 
 * ⚠️ Direct import: import { fetchCashAccounts } from '@/features/settings/cash-accounts/api/cash-accounts-api'
 */

import type { CashAccountModel as CashAccount } from '@/generated/prisma/models/CashAccount';

const BASE_URL = '/api/cash-accounts';

export interface CashAccountsParams {
  page?: number;
  limit?: number;
  search?: string;
  branchId?: string;
  type?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CashAccountsResponse {
  data: CashAccount[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchCashAccounts(params: CashAccountsParams = {}): Promise<CashAccountsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.branchId) searchParams.set('branchId', params.branchId);
  if (params.type) searchParams.set('type', params.type);
  if (params.isActive !== undefined) searchParams.set('isActive', String(params.isActive));
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cash accounts: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCashAccount(systemId: string): Promise<CashAccount> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cash account: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createCashAccount(data: Omit<CashAccount, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<CashAccount> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create cash account');
  }
  
  return response.json();
}

export async function updateCashAccount(systemId: string, data: Partial<CashAccount>): Promise<CashAccount> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update cash account');
  }
  
  return response.json();
}

export async function deleteCashAccount(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete cash account: ${response.statusText}`);
  }
}

export type { CashAccount };
