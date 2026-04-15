/**
 * Orders API - Additional functions for cancel, payment, etc.
 */

import type { Order } from '@/lib/types/prisma-extended';

const API_BASE = '/api/orders';

/**
 * Cancel an order
 */
export async function cancelOrder(
  systemId: string,
  data: { reason: string; restockItems: boolean }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel order');
  }
  return res.json();
}

/**
 * Add payment to order
 */
export async function addOrderPayment(
  systemId: string,
  data: {
    amount: number;
    paymentMethodId: string;
    note?: string;
  }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to add payment');
  }
  return res.json();
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  systemId: string,
  status: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update status');
  }
  return res.json();
}

/**
 * Create packaging for order
 */
export async function createPackaging(
  systemId: string,
  data: { assignedEmployeeId?: string }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create packaging');
  }
  return res.json();
}

/**
 * Confirm packaging
 */
export async function confirmPackaging(
  systemId: string,
  packagingId: string,
  data?: { confirmingEmployeeId?: string; confirmingEmployeeName?: string }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data || {}),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to confirm packaging');
  }
  return res.json();
}

/**
 * Create shipment for order (GHTK, etc.)
 */
export async function createShipment(
  systemId: string,
  data: {
    provider: string;
    serviceType?: string;
    packagingId?: string;
  }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/shipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create shipment');
  }
  return res.json();
}

/**
 * Sync shipment status from provider
 */
export async function syncShipmentStatus(systemId: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/shipment/sync`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to sync shipment');
  }
  return res.json();
}

/**
 * Cancel shipment
 */
export async function cancelShipment(systemId: string): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/shipment/cancel`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel shipment');
  }
  return res.json();
}

// ============================================
// PACKAGING & DELIVERY ACTIONS
// ============================================

/**
 * Cancel packaging request
 */
export async function cancelPackagingRequest(
  systemId: string,
  packagingId: string,
  data: { reason: string; cancelingEmployeeId?: string; cancelingEmployeeName?: string }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel packaging');
  }
  return res.json();
}

/**
 * Process in-store pickup (select delivery method)
 */
export async function processInStorePickup(
  systemId: string,
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/in-store-pickup`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to process in-store pickup');
  }
  return res.json();
}

/**
 * Confirm in-store pickup (dispatch stock and mark delivered)
 */
export async function confirmInStorePickup(
  systemId: string,
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/in-store-pickup/confirm`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to confirm in-store pickup');
  }
  return res.json();
}

/**
 * Dispatch from warehouse (move stock to transit)
 */
export async function dispatchFromWarehouse(
  systemId: string,
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/dispatch`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to dispatch from warehouse');
  }
  return res.json();
}

/**
 * Complete delivery (mark as delivered)
 */
export async function completeDelivery(
  systemId: string,
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/complete-delivery`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to complete delivery');
  }
  return res.json();
}

/**
 * Mark delivery as failed (return stock to transit)
 */
export async function failDelivery(
  systemId: string,
  packagingId: string,
  data: { reason: string }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/fail-delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to mark delivery as failed');
  }
  return res.json();
}

/**
 * Cancel delivery (return stock to warehouse)
 */
export async function cancelDelivery(
  systemId: string,
  packagingId: string,
  data: { reason: string; restockItems?: boolean }
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/cancel-delivery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel delivery');
  }
  return res.json();
}

// ============================================
// COD & RECONCILIATION
// ============================================

/**
 * Confirm COD reconciliation for multiple shipments
 */
export async function confirmCodReconciliation(
  data: {
    shipments: Array<{
      systemId: string;
      orderSystemId: string;
      codAmount: number;
    }>;
  }
): Promise<{ receiptsCreated: number; ordersUpdated: number }> {
  const res = await fetch(`${API_BASE}/cod-reconciliation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to confirm COD reconciliation');
  }
  return res.json();
}

// ============================================
// GHTK INTEGRATION
// ============================================

/**
 * Create GHTK shipment
 */
export async function createGHTKShipment(
  systemId: string,
  packagingId: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; message: string; trackingCode?: string }> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create GHTK shipment');
  }
  return res.json();
}

/**
 * Cancel GHTK shipment
 */
export async function cancelGHTKShipment(
  systemId: string,
  packagingId: string,
  trackingCode: string
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trackingCode }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to cancel GHTK shipment');
  }
  return res.json();
}

/**
 * Sync GHTK shipment status
 */
export async function syncGHTKShipment(
  systemId: string,
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/ghtk/sync`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to sync GHTK shipment');
  }
  return res.json();
}
