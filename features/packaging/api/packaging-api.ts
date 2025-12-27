/**
 * Packaging API Layer
 */

import type { PackagingSlip } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/packaging';

export interface PackagingFilters {
  page?: number;
  limit?: number;
  status?: string;
  branchSystemId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PackagingResponse {
  data: PackagingSlip[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchPackagingSlips(filters: PackagingFilters = {}): Promise<PackagingResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchPackagingById(systemId: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function confirmPackaging(systemId: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/confirm`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to confirm');
  return res.json();
}

export async function cancelPackaging(systemId: string, reason: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
  if (!res.ok) throw new Error('Failed to cancel');
  return res.json();
}

export async function assignPackaging(systemId: string, employeeSystemId: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeSystemId }) });
  if (!res.ok) throw new Error('Failed to assign');
  return res.json();
}

export async function printPackaging(systemId: string): Promise<{ printUrl: string }> {
  const res = await fetch(`${BASE_URL}/${systemId}/print`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to print');
  return res.json();
}
