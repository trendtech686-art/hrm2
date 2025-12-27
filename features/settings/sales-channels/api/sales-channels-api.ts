/**
 * Sales Channels API Layer
 * Handles all sales channel-related API calls
 */

import type { SalesChannel } from '@/lib/types/prisma-extended';

export interface SalesChannelFilters {
  page?: number;
  limit?: number;
  isApplied?: boolean;
}

export interface SalesChannelResponse {
  data: SalesChannel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SalesChannelCreateInput {
  systemId?: string;
  id?: string;
  name: string;
  isApplied?: boolean;
  isDefault?: boolean;
}

export interface SalesChannelUpdateInput extends Partial<SalesChannelCreateInput> {}

const BASE_URL = '/api/settings/sales-channels';

export async function fetchSalesChannels(
  filters: SalesChannelFilters = {}
): Promise<SalesChannelResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isApplied !== undefined) params.set('isApplied', String(filters.isApplied));

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch sales channels');
  return response.json();
}

export async function fetchSalesChannelById(systemId: string): Promise<SalesChannel> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch sales channel');
  return response.json();
}

export async function createSalesChannel(data: SalesChannelCreateInput): Promise<SalesChannel> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create sales channel');
  return response.json();
}

export async function updateSalesChannel(
  systemId: string,
  data: SalesChannelUpdateInput
): Promise<SalesChannel> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update sales channel');
  return response.json();
}

export async function deleteSalesChannel(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete sales channel');
}

export async function setDefaultSalesChannel(systemId: string): Promise<SalesChannel> {
  const response = await fetch(`${BASE_URL}/${systemId}/set-default`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to set default');
  return response.json();
}

export async function fetchAppliedSalesChannels(): Promise<SalesChannel[]> {
  const response = await fetchSalesChannels({ isApplied: true, limit: 100 });
  return response.data;
}
