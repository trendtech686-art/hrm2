/**
 * Penalties API Layer
 */

import type { Penalty, PenaltyType } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/penalties';

export interface PenaltyFilters {
  page?: number;
  limit?: number;
  employeeSystemId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface PenaltyResponse {
  data: Penalty[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export async function fetchPenalties(filters: PenaltyFilters = {}): Promise<PenaltyResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchPenaltyById(systemId: string): Promise<Penalty> {
  const res = await fetch(`${BASE_URL}/${systemId}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createPenalty(data: Partial<Penalty>): Promise<Penalty> {
  const res = await fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updatePenalty(systemId: string, data: Partial<Penalty>): Promise<Penalty> {
  const res = await fetch(`${BASE_URL}/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deletePenalty(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Penalty Types
export async function fetchPenaltyTypes(): Promise<PenaltyType[]> {
  const res = await fetch(`${BASE_URL}/types`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createPenaltyType(data: Partial<PenaltyType>): Promise<PenaltyType> {
  const res = await fetch(`${BASE_URL}/types`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updatePenaltyType(systemId: string, data: Partial<PenaltyType>): Promise<PenaltyType> {
  const res = await fetch(`${BASE_URL}/types/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deletePenaltyType(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/types/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}
