/**
 * Task Templates API Layer
 * Handles all task template API calls
 */

import type { TaskTemplate } from '../template-types';

const BASE_URL = '/api/tasks/templates';

/**
 * Fetch all task templates
 */
export async function fetchTaskTemplates(): Promise<TaskTemplate[]> {
  const response = await fetch(BASE_URL);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task templates');
  }
  
  return response.json();
}

/**
 * Fetch single template by ID
 */
export async function fetchTaskTemplateById(systemId: string): Promise<TaskTemplate> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task template');
  }
  
  return response.json();
}

/**
 * Create new task template
 */
export async function createTaskTemplate(
  data: Omit<TaskTemplate, 'systemId' | 'createdAt' | 'updatedAt' | 'usageCount'>
): Promise<TaskTemplate> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task template');
  }
  
  return response.json();
}

/**
 * Update task template
 */
export async function updateTaskTemplate(
  systemId: string,
  data: Partial<TaskTemplate>
): Promise<TaskTemplate> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task template');
  }
  
  return response.json();
}

/**
 * Delete task template
 */
export async function deleteTaskTemplate(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete task template');
  }
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}/use`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to increment usage');
  }
}
