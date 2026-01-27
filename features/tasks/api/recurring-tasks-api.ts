/**
 * Recurring Tasks API Layer
 * Handles all recurring task definition API calls
 */

import type { RecurringTask } from '../recurring-types';

const BASE_URL = '/api/tasks/recurring';

/**
 * Fetch all recurring tasks
 */
export async function fetchRecurringTasks(): Promise<RecurringTask[]> {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch recurring tasks');
  }
  
  return response.json();
}

/**
 * Fetch single recurring task by ID
 */
export async function fetchRecurringTaskById(systemId: string): Promise<RecurringTask> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch recurring task');
  }
  
  return response.json();
}

/**
 * Create new recurring task
 */
export async function createRecurringTask(
  data: Omit<RecurringTask, 'systemId' | 'createdAt' | 'updatedAt' | 'lastProcessedDate'>
): Promise<RecurringTask> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create recurring task');
  }
  
  return response.json();
}

/**
 * Update recurring task
 */
export async function updateRecurringTask(
  systemId: string,
  data: Partial<RecurringTask>
): Promise<RecurringTask> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update recurring task');
  }
  
  return response.json();
}

/**
 * Delete recurring task
 */
export async function deleteRecurringTask(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete recurring task');
  }
}

/**
 * Toggle pause status
 */
export async function toggleRecurringTaskPause(systemId: string): Promise<RecurringTask> {
  const response = await fetch(`${BASE_URL}/${systemId}/toggle-pause`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to toggle pause');
  }
  
  return response.json();
}

/**
 * Process recurring tasks (create new instances)
 */
export async function processRecurringTasks(): Promise<{ created: number }> {
  const response = await fetch(`${BASE_URL}/process`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to process recurring tasks');
  }
  
  return response.json();
}
