/**
 * Custom Fields API Layer
 * Handles all custom field definition API calls
 */

import type { CustomFieldDefinition } from '../custom-fields-types';

const BASE_URL = '/api/tasks/custom-fields';

/**
 * Fetch all custom field definitions
 */
export async function fetchCustomFields(): Promise<CustomFieldDefinition[]> {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch custom fields');
  }
  
  return response.json();
}

/**
 * Fetch single custom field by ID
 */
export async function fetchCustomFieldById(systemId: string): Promise<CustomFieldDefinition> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch custom field');
  }
  
  return response.json();
}

/**
 * Create new custom field
 */
export async function createCustomField(
  data: Omit<CustomFieldDefinition, 'systemId' | 'createdAt' | 'updatedAt'>
): Promise<CustomFieldDefinition> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create custom field');
  }
  
  return response.json();
}

/**
 * Update custom field
 */
export async function updateCustomField(
  systemId: string,
  data: Partial<CustomFieldDefinition>
): Promise<CustomFieldDefinition> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update custom field');
  }
  
  return response.json();
}

/**
 * Delete custom field
 */
export async function deleteCustomField(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete custom field');
  }
}

/**
 * Reorder custom fields
 */
export async function reorderCustomFields(fieldIds: string[]): Promise<void> {
  const response = await fetch(`${BASE_URL}/reorder`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fieldIds }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reorder custom fields');
  }
}
