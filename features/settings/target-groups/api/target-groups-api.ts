/**
 * Target Groups API Layer
 */

import type { TargetGroup } from '@/lib/types/prisma-extended';

export interface TargetGroupFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface TargetGroupResponse {
  data: TargetGroup[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TargetGroupCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface TargetGroupUpdateInput extends Partial<TargetGroupCreateInput> {}

const BASE_URL = '/api/settings/target-groups';

export async function fetchTargetGroups(
  filters: TargetGroupFilters = {}
): Promise<TargetGroupResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch target groups');
  return response.json();
}

export async function fetchTargetGroupById(systemId: string): Promise<TargetGroup> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch target group');
  return response.json();
}

export async function createTargetGroup(data: TargetGroupCreateInput): Promise<TargetGroup> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create target group');
  return response.json();
}

export async function updateTargetGroup(
  systemId: string,
  data: TargetGroupUpdateInput
): Promise<TargetGroup> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update target group');
  return response.json();
}

export async function deleteTargetGroup(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete target group');
}

export async function setDefaultTargetGroup(systemId: string): Promise<TargetGroup> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to set default');
  return response.json();
}

export async function fetchActiveTargetGroups(): Promise<TargetGroup[]> {
  const response = await fetchTargetGroups({ isActive: true, limit: 100 });
  return response.data;
}
