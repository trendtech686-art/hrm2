/**
 * Sales Management Settings API Layer
 * Handles all sales management settings API calls
 */

import type { SalesManagementSettingsValues } from '../sales-management-service';

const BASE_URL = '/api/settings/sales-management';

/**
 * Fetch sales management settings
 */
export async function fetchSalesSettings(): Promise<SalesManagementSettingsValues> {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sales settings');
  }
  
  const result = await response.json();
  return result.data ?? result;
}

/**
 * Update sales management settings
 */
export async function updateSalesSettings(
  data: Partial<SalesManagementSettingsValues>
): Promise<SalesManagementSettingsValues> {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update sales settings');
  }
  
  const result = await response.json();
  return result.data ?? result;
}

/**
 * Reset sales settings to defaults
 */
export async function resetSalesSettings(): Promise<SalesManagementSettingsValues> {
  const response = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to reset sales settings');
  }
  
  const result = await response.json();
  return result.data ?? result;
}
