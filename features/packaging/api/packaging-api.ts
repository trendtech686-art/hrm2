/**
 * Packaging API Layer
 */

import type { PackagingSlip } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/packaging';

export interface PackagingFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchSystemId?: string;
  startDate?: string;
  endDate?: string;
}

export type PaginatedPackagingResponse<T = PackagingSlip> = {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export async function fetchPackagingSlips(filters: PackagingFilters = {}): Promise<PaginatedPackagingResponse> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && params.set(k, String(v)));
  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Không thể tải danh sách đóng gói');
  return res.json();
}

// Detail response types
export interface PackagingLineItem {
  productSystemId: string;
  productId: string;
  productName: string;
  barcode: string;
  thumbnailImage: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  discountType: 'fixed' | 'percentage';
  tax: number;
  total: number;
  note?: string;
}

export interface PackagingOrderInfo {
  systemId: string;
  id: string;
  customerSystemId: string;
  customerName: string;
  branchSystemId: string;
  branchName: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
  paidAmount: number;
  lineItems: PackagingLineItem[];
  payments: Array<{
    systemId: string;
    id: string;
    date: string;
    method: string;
    amount: number;
    description?: string;
  }>;
}

export interface PackagingCustomerInfo {
  systemId: string;
  id: string;
  fullName: string;
  phone?: string;
  email?: string;
  shippingAddress: string;
  shippingAddress_street?: string;
  shippingAddress_ward?: string;
  shippingAddress_district?: string;
  shippingAddress_province?: string;
}

// Extended packaging info with employee IDs (from API detail response)
export interface PackagingDetailInfo {
  systemId: string;
  id: string;
  requestDate?: string;
  confirmDate?: string;
  cancelDate?: string;
  deliveredDate?: string;
  requestingEmployeeId?: string;
  requestingEmployeeName: string;
  confirmingEmployeeId?: string;
  confirmingEmployeeName?: string;
  cancelingEmployeeId?: string;
  cancelingEmployeeName?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  status: string;
  printStatus?: string;
  cancelReason?: string;
  notes?: string;
  deliveryMethod?: string;
  deliveryStatus?: string;
  carrier?: string;
  service?: string;
  trackingCode?: string;
  partnerStatus?: string;
  shippingFeeToPartner?: number;
  codAmount?: number;
  weight?: number;
  requestorName?: string;
  requestorPhone?: string;
  requestorId?: string;
  shipment?: unknown;
}

export interface PackagingDetailResponse {
  packaging: PackagingDetailInfo;
  order: PackagingOrderInfo;
  customer: PackagingCustomerInfo | null;
}

export async function fetchPackagingById(systemId: string): Promise<PackagingDetailResponse> {
  const res = await fetch(`${BASE_URL}/${systemId}`, {
    credentials: 'include', // Include cookies for auth
  });
  
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(`Không thể phân tích dữ liệu đóng gói: ${res.status}`);
  }
  
  if (!res.ok) {
    throw new Error(json?.error || `Không thể tải đóng gói: ${res.status}`);
  }
  
  // API returns the response object directly (not wrapped in { data: ... })
  // Check if response has required fields
  if (!json?.packaging || !json?.order) {
    throw new Error('Dữ liệu đóng gói không hợp lệ');
  }
  
  return json as PackagingDetailResponse;
}

export async function confirmPackaging(systemId: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/confirm`, { method: 'POST' });
  if (!res.ok) throw new Error('Không thể xác nhận đóng gói');
  return res.json();
}

export async function cancelPackaging(systemId: string, reason: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) });
  if (!res.ok) throw new Error('Không thể hủy đóng gói');
  return res.json();
}

export async function assignPackaging(systemId: string, employeeSystemId: string): Promise<PackagingSlip> {
  const res = await fetch(`${BASE_URL}/${systemId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ employeeSystemId }) });
  if (!res.ok) throw new Error('Không thể phân công đóng gói');
  return res.json();
}

export async function printPackaging(systemId: string): Promise<{ printUrl: string }> {
  const res = await fetch(`${BASE_URL}/${systemId}/print`, { method: 'POST' });
  if (!res.ok) throw new Error('Không thể in phiếu đóng gói');
  return res.json();
}
