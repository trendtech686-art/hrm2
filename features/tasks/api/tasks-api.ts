/**
 * Tasks API Layer
 * Handles all task-related API calls
 */

import type { Task, TaskStatus, TaskPriority, TaskActivity } from '@/lib/types/prisma-extended';

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  assignerId?: string;
  projectId?: string;
  parentId?: string;
  dueFrom?: string;
  dueTo?: string;
  includeDeleted?: boolean;
}

export interface TaskResponse {
  data: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TaskCreateInput {
  systemId?: string;
  id?: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  startDate?: string;
  assignerId?: string;
  assigneeId?: string;
  assigneeName?: string;
  parentId?: string;
  projectId?: string;
  estimatedHours?: number;
  tags?: string[];
}

export interface TaskUpdateInput extends Partial<TaskCreateInput> {
  progress?: number;
  actualHours?: number;
  completedAt?: string;
  completedDate?: string; // Alias for completedAt
  subtasks?: any[]; // Allow subtasks updates
  comments?: any[]; // Allow comments updates
  activities?: any[]; // Allow activities updates
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  completionEvidence?: any; // Allow completion evidence updates
}

const BASE_URL = '/api/tasks';

/**
 * Fetch tasks with filters
 */
export async function fetchTasks(
  filters: TaskFilters = {}
): Promise<TaskResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.assigneeId) params.set('assigneeId', filters.assigneeId);
  if (filters.assignerId) params.set('assignerId', filters.assignerId);
  if (filters.projectId) params.set('projectId', filters.projectId);
  if (filters.parentId) params.set('parentId', filters.parentId);
  if (filters.dueFrom) params.set('dueFrom', filters.dueFrom);
  if (filters.dueTo) params.set('dueTo', filters.dueTo);
  if (filters.includeDeleted) params.set('includeDeleted', 'true');

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  
  return response.json();
}

/**
 * Fetch single task by ID
 */
export async function fetchTaskById(
  systemId: string
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task');
  }
  
  return response.json();
}

/**
 * Create new task
 */
export async function createTask(
  data: TaskCreateInput
): Promise<Task> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create task');
  }
  
  return response.json();
}

/**
 * Update task
 */
export async function updateTask(
  systemId: string,
  data: TaskUpdateInput
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update task');
  }
  
  return response.json();
}

/**
 * Delete task (soft delete)
 */
export async function deleteTask(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

/**
 * Restore deleted task
 */
export async function restoreTask(systemId: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${systemId}/restore`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to restore task');
  }
  
  return response.json();
}

/**
 * Update task status
 */
export async function updateTaskStatus(
  systemId: string,
  status: TaskStatus
): Promise<Task> {
  return updateTask(systemId, { status });
}

/**
 * Complete task
 */
export async function completeTask(systemId: string): Promise<Task> {
  return updateTask(systemId, {
    status: 'Hoàn thành',
    completedAt: new Date().toISOString(),
    progress: 100,
  });
}

/**
 * Fetch task activities
 */
export async function fetchTaskActivities(
  taskSystemId: string
): Promise<TaskActivity[]> {
  const response = await fetch(`${BASE_URL}/${taskSystemId}/activities`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch task activities');
  }
  
  return response.json();
}

/**
 * Add task comment
 */
export async function addTaskComment(
  taskSystemId: string,
  content: string
): Promise<{ id: string; content: string; createdAt: string }> {
  const response = await fetch(`${BASE_URL}/${taskSystemId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add comment');
  }
  
  return response.json();
}

/**
 * Start/Stop task timer
 */
export async function toggleTaskTimer(
  systemId: string,
  action: 'start' | 'stop'
): Promise<Task> {
  const response = await fetch(`${BASE_URL}/${systemId}/timer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to ${action} timer`);
  }
  
  return response.json();
}

/**
 * Get subtasks for a task
 */
export async function fetchSubtasks(
  parentSystemId: string
): Promise<Task[]> {
  const response = await fetchTasks({ parentId: parentSystemId, limit: 100 });
  return response.data;
}
