/**
 * Task Templates API Layer
 * Handles all task template API calls
 */

import type { TaskTemplate } from '../template-types';

const BASE_URL = '/api/tasks/templates';

export interface TaskTemplatesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}

/**
 * Fetch task templates with filters and pagination
 */
export async function fetchTaskTemplates(params: TaskTemplatesParams = {}): Promise<{
  data: TaskTemplate[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.category) searchParams.set('category', params.category);

  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch task templates');
  }

  return response.json();
}

/**
 * Fetch all task templates (legacy - for backward compatibility)
 * @deprecated Use fetchTaskTemplates with params instead
 */
export async function fetchAllTaskTemplates(): Promise<TaskTemplate[]> {
  const response = await fetch(BASE_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch task templates');
  }

  const data = await response.json();
  // Handle both paginated and non-paginated responses
  return Array.isArray(data) ? data : data.data || [];
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
