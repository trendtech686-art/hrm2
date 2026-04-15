/**
 * Supplier Warranty (BH Nhà cung cấp) API functions
 */
import type { SupplierWarranty, SupplierWarrantyParams, SupplierWarrantyListResponse } from '../types';

const BASE_URL = '/api/supplier-warranties';

export async function fetchSupplierWarranties(params: SupplierWarrantyParams = {}): Promise<SupplierWarrantyListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.status) searchParams.set('status', params.status);
  if (params.supplierId) searchParams.set('supplierId', params.supplierId);
  if (params.startDate) searchParams.set('startDate', params.startDate);
  if (params.endDate) searchParams.set('endDate', params.endDate);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tải danh sách BH NCC');
  }
  return response.json();
}

export async function fetchSupplierWarranty(systemId: string): Promise<SupplierWarranty> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tải phiếu BH NCC');
  }
  const json = await response.json();
  return json.data ?? json;
}
