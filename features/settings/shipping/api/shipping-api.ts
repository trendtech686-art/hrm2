/**
 * Shipping Partners API Layer
 * Handles all shipping partner-related API calls
 */

import type { ShippingPartner, ShippingPartnerStatus } from '@/lib/types/prisma-extended';

export interface ShippingPartnerFilters {
  page?: number;
  limit?: number;
  status?: ShippingPartnerStatus;
  isConnected?: boolean;
}

export interface ShippingPartnerResponse {
  data: ShippingPartner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ShippingPartnerCreateInput {
  systemId?: string;
  id: string;
  name: string;
  logoUrl?: string;
  description?: string;
  phone?: string;
  address?: string;
  contactPerson?: string;
  status?: ShippingPartnerStatus;
}

export interface ShippingPartnerUpdateInput extends Partial<ShippingPartnerCreateInput> {
  credentials?: Record<string, any>;
  configuration?: Record<string, any>;
}

const BASE_URL = '/api/settings/shipping-partners';

export async function fetchShippingPartners(
  filters: ShippingPartnerFilters = {}
): Promise<ShippingPartnerResponse> {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.status) params.set('status', filters.status);
  if (filters.isConnected !== undefined) params.set('isConnected', String(filters.isConnected));

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) throw new Error('Failed to fetch shipping partners');
  return response.json();
}

export async function fetchShippingPartnerById(systemId: string): Promise<ShippingPartner> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch shipping partner');
  return response.json();
}

export async function createShippingPartner(data: ShippingPartnerCreateInput): Promise<ShippingPartner> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create shipping partner');
  return response.json();
}

export async function updateShippingPartner(
  systemId: string,
  data: ShippingPartnerUpdateInput
): Promise<ShippingPartner> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update shipping partner');
  return response.json();
}

export async function deleteShippingPartner(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete shipping partner');
}

export async function connectShippingPartner(
  systemId: string,
  credentials: Record<string, any>
): Promise<ShippingPartner> {
  const response = await fetch(`${BASE_URL}/${systemId}/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credentials }),
  });
  if (!response.ok) throw new Error('Failed to connect shipping partner');
  return response.json();
}

export async function disconnectShippingPartner(systemId: string): Promise<ShippingPartner> {
  const response = await fetch(`${BASE_URL}/${systemId}/disconnect`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to disconnect shipping partner');
  return response.json();
}

export async function fetchActiveShippingPartners(): Promise<ShippingPartner[]> {
  const response = await fetchShippingPartners({ status: 'Đang hợp tác', limit: 100 });
  return response.data;
}

export async function fetchConnectedShippingPartners(): Promise<ShippingPartner[]> {
  const response = await fetchShippingPartners({ isConnected: true, limit: 100 });
  return response.data;
}
