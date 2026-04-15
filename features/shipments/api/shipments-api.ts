/**
 * Shipments API Layer
 * Handles all shipment-related API calls
 */

import type { Shipment, ShipmentView } from '@/lib/types/prisma-extended';

export interface ShipmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  deliveryStatus?: string;
  orderId?: string;
  branchId?: string;
  carrier?: string;
  reconciliationStatus?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ShipmentResponse {
  data: ShipmentView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ShipmentCreateInput {
  systemId?: string;
  id?: string;
  packagingSystemId: string;
  orderSystemId: string;
  orderId: string;
  trackingCode?: string;
  carrier?: string;
  service?: string;
  deliveryStatus?: string;
  printStatus?: string;
  shippingFeeToPartner?: number;
  codAmount?: number;
  payer?: string;
}

export interface ShipmentUpdateInput extends Partial<ShipmentCreateInput> {
  reconciliationStatus?: string;
  partnerStatus?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
}

const BASE_URL = '/api/shipments';

/**
 * Fetch shipments with filters
 */
export async function fetchShipments(
  filters: ShipmentFilters = {}
): Promise<ShipmentResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  if (filters.deliveryStatus) params.set('deliveryStatus', filters.deliveryStatus);
  if (filters.orderId) params.set('orderId', filters.orderId);
  if (filters.branchId) params.set('branchId', filters.branchId);
  if (filters.carrier) params.set('carrier', filters.carrier);
  if (filters.reconciliationStatus) params.set('reconciliationStatus', filters.reconciliationStatus);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Không thể tải danh sách vận đơn');
  }
  
  return response.json();
}

/**
 * Fetch single shipment by ID
 */
export async function fetchShipmentById(
  systemId: string
): Promise<Shipment> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Không thể tải vận đơn');
  }
  
  return response.json();
}

/**
 * Update shipment
 */
export async function updateShipment(
  systemId: string,
  data: ShipmentUpdateInput
): Promise<Shipment> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Không thể cập nhật vận đơn');
  }
  
  return response.json();
}

/**
 * Update delivery status
 */
export async function updateDeliveryStatus(
  systemId: string,
  status: string,
  timestamp?: string
): Promise<Shipment> {
  return updateShipment(systemId, {
    deliveryStatus: status,
    ...(status === 'Đã giao hàng' && { deliveredAt: timestamp || new Date().toISOString() }),
    ...(status === 'Đang giao hàng' && { dispatchedAt: timestamp || new Date().toISOString() }),
  });
}

/**
 * Mark shipment as reconciled
 */
export async function reconcileShipment(
  systemId: string
): Promise<Shipment> {
  return updateShipment(systemId, {
    reconciliationStatus: 'Đã đối soát',
  });
}

/**
 * Bulk reconcile shipments
 */
export async function bulkReconcileShipments(
  systemIds: string[]
): Promise<{ success: number; failed: number }> {
  const response = await fetch(`${BASE_URL}/bulk-reconcile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemIds }),
  });
  
  if (!response.ok) {
    throw new Error('Không thể đối soát hàng loạt');
  }
  
  return response.json();
}

/**
 * Update tracking info from carrier
 */
export async function syncTrackingInfo(
  systemId: string
): Promise<Shipment> {
  const response = await fetch(`${BASE_URL}/${systemId}/sync-tracking`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Không thể đồng bộ thông tin vận chuyển');
  }
  
  return response.json();
}

/**
 * Print shipping label
 */
export async function printShippingLabel(
  systemIds: string[]
): Promise<{ url: string }> {
  const response = await fetch(`${BASE_URL}/print-labels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemIds }),
  });
  
  if (!response.ok) {
    throw new Error('Không thể tạo nhãn vận chuyển');
  }
  
  return response.json();
}
