/**
 * Store Info Settings API Layer
 * Handles all store information settings API calls
 */

import type { StoreGeneralInfo, StoreGeneralInfoInput } from '../store-info-store';

const BASE_URL = '/api/settings/store-info';

/**
 * Fetch store information
 */
export async function fetchStoreInfo(): Promise<StoreGeneralInfo> {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch store info');
  }
  
  return response.json();
}

/**
 * Update store information
 */
export async function updateStoreInfo(
  data: StoreGeneralInfoInput,
  metadata?: { updatedBySystemId?: string; updatedByName?: string }
): Promise<StoreGeneralInfo> {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, ...metadata }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update store info');
  }
  
  return response.json();
}

/**
 * Reset store info to defaults
 */
export async function resetStoreInfo(): Promise<StoreGeneralInfo> {
  const response = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to reset store info');
  }
  
  return response.json();
}

/**
 * Upload store logo
 */
export async function uploadStoreLogo(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append('logo', file);
  
  const response = await fetch(`${BASE_URL}/logo`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload logo');
  }
  
  return response.json();
}
