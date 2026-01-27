/**
 * Shipping Settings API Functions
 */

import type { ShippingSettings } from '../types';

const API_ENDPOINT = '/api/settings/shipping';

export async function fetchShippingSettings(): Promise<ShippingSettings | null> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch shipping settings: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data ?? null;
}

export async function saveShippingSettings(settings: ShippingSettings): Promise<ShippingSettings> {
  const response = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!response.ok) {
    throw new Error(`Failed to save shipping settings: ${response.statusText}`);
  }
  const result = await response.json();
  return result.data;
}
