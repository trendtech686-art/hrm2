/**
 * Reconciliation API Layer
 */

const BASE_URL = '/api/reconciliation';

export interface ReconciliationFilters {
  page?: number;
  limit?: number;
  type?: 'cash' | 'bank' | 'inventory';
  status?: 'pending' | 'matched' | 'unmatched';
  branchSystemId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReconciliationItem {
  systemId: string;
  id: string;
  type: 'cash' | 'bank' | 'inventory';
  date: string;
  expectedAmount: number;
  actualAmount: number;
  difference: number;
  status: 'pending' | 'matched' | 'unmatched';
  notes?: string;
  reconciledBy?: string;
  reconciledAt?: string;
}

export interface ReconciliationResponse {
  data: ReconciliationItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
  summary: { totalExpected: number; totalActual: number; totalDifference: number };
}

export async function fetchReconciliations(filters: ReconciliationFilters = {}): Promise<ReconciliationResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchReconciliationById(systemId: string): Promise<ReconciliationItem> {
  const res = await fetch(`${BASE_URL}/${systemId}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function markAsReconciled(systemId: string, notes?: string): Promise<ReconciliationItem> {
  const res = await fetch(`${BASE_URL}/${systemId}/reconcile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notes }) });
  if (!res.ok) throw new Error('Failed to reconcile');
  return res.json();
}

export async function updateActualAmount(systemId: string, actualAmount: number): Promise<ReconciliationItem> {
  const res = await fetch(`${BASE_URL}/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ actualAmount }) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}
