/**
 * Cashbook API Layer
 * Handles all cash account-related API calls
 * Note: Cashbook relates to cash-accounts API
 */

import type { CashAccount } from '@/lib/types/prisma-extended';
import { fetchAllPages } from '@/lib/fetch-all-pages';

export interface CashAccountFilters {
  page?: number;
  limit?: number;
  type?: 'cash' | 'bank';
  isActive?: boolean;
  branchSystemId?: string;
  search?: string;
}

export interface CashAccountResponse {
  data: CashAccount[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const BASE_URL = '/api/cash-accounts';

/**
 * Fetch cash accounts with filters
 */
export async function fetchCashAccounts(
  filters: CashAccountFilters = {}
): Promise<CashAccountResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.type) params.set('type', filters.type);
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));
  if (filters.branchSystemId) params.set('branchSystemId', filters.branchSystemId);
  if (filters.search) params.set('search', filters.search);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cash accounts');
  }
  
  return response.json();
}

/**
 * Set default cash account
 */
export async function setDefaultCashAccount(
  systemId: string
): Promise<CashAccount> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw new Error('Failed to set default cash account');
  }
  
  return response.json();
}

/**
 * Get all active cash accounts (for dropdown/selection)
 */
export async function fetchActiveCashAccounts(): Promise<CashAccount[]> {
  return fetchAllPages((p) => fetchCashAccounts({ ...p, isActive: true }));
}
