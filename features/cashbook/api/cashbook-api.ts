/**
 * Cashbook API Layer
 * Handles all cash account-related API calls
 * Note: Cashbook relates to cash-accounts API
 */

import type { CashAccount } from '@/lib/types/prisma-extended';

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

export interface CashAccountCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  type: 'cash' | 'bank';
  initialBalance?: number;
  bankAccountNumber?: string;
  bankBranch?: string;
  branchSystemId?: string;
  isActive?: boolean;
  isDefault?: boolean;
  bankName?: string;
  bankCode?: string;
  accountHolder?: string;
  minBalance?: number;
  maxBalance?: number;
  managedBy?: string;
}

export interface CashAccountUpdateInput extends Partial<CashAccountCreateInput> {}

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
 * Fetch single cash account by ID
 */
export async function fetchCashAccountById(
  systemId: string
): Promise<CashAccount> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch cash account');
  }
  
  return response.json();
}

/**
 * Create new cash account
 */
export async function createCashAccount(
  data: CashAccountCreateInput
): Promise<CashAccount> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create cash account');
  }
  
  return response.json();
}

/**
 * Update cash account
 */
export async function updateCashAccount(
  systemId: string,
  data: CashAccountUpdateInput
): Promise<CashAccount> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update cash account');
  }
  
  return response.json();
}

/**
 * Delete cash account
 */
export async function deleteCashAccount(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete cash account');
  }
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
 * Get account balance
 */
export async function fetchAccountBalance(
  systemId: string
): Promise<{
  systemId: string;
  currentBalance: number;
  lastUpdated: string;
}> {
  const response = await fetch(`${BASE_URL}/${systemId}/balance`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch account balance');
  }
  
  return response.json();
}

/**
 * Get all active cash accounts (for dropdown/selection)
 */
export async function fetchActiveCashAccounts(): Promise<CashAccount[]> {
  const response = await fetchCashAccounts({ 
    isActive: true, 
    limit: 100 
  });
  return response.data;
}
