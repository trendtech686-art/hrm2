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
  packagingId: string
): Promise<Order> {
  const res = await fetch(`${API_BASE}/${systemId}/packaging/${packagingId}/confirm`, {
    method: 'POST',
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
