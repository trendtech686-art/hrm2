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
  parentId?: string;
  dueFrom?: string;
  dueTo?: string;
  createdFrom?: string;
  createdTo?: string;
  boardId?: string;
  includeDeleted?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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
  assignerName?: string;
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
  subtasks?: unknown[]; // Allow subtasks updates
  comments?: unknown[]; // Allow comments updates
  activities?: unknown[]; // Allow activities updates
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  completionEvidence?: unknown; // Allow completion evidence updates
  requiresEvidence?: boolean;
  assignees?: Array<{ employeeSystemId: string; role: string }>;
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
  if (filters.parentId) params.set('parentId', filters.parentId);
  if (filters.dueFrom) params.set('dueFrom', filters.dueFrom);
  if (filters.dueTo) params.set('dueTo', filters.dueTo);
  if (filters.createdFrom) params.set('createdFrom', filters.createdFrom);
  if (filters.createdTo) params.set('createdTo', filters.createdTo);
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
 * Get subtasks for a task
 */
export async function fetchSubtasks(
  parentSystemId: string
): Promise<Task[]> {
  const response = await fetchTasks({ parentId: parentSystemId });
  return response.data;
}

/**
 * Dashboard stats response — server-side aggregation
 */
export interface TaskDashboardStats {
  total: number;
  byStatus: {
    notStarted: number;
    inProgress: number;
    review: number;
    completed: number;
    cancelled: number;
  };
  overdue: number;
  highPriority: number;
  onTimeRate: number;
  avgCompletionDays: number;
  completionRate: number;
  byAssignee: Array<{
    assigneeId: string;
    name: string;
    total: number;
    inProgress: number;
    completed: number;
    overdue: number;
  }>;
}

/**
 * Fetch dashboard stats — server-side aggregated metrics
 */
export async function fetchTaskDashboardStats(
  params: { createdFrom?: string } = {}
): Promise<TaskDashboardStats> {
  const searchParams = new URLSearchParams();
  if (params.createdFrom) searchParams.set('createdFrom', params.createdFrom);

  const url = searchParams.toString()
    ? `/api/tasks/dashboard-stats?${searchParams}`
    : '/api/tasks/dashboard-stats';
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch task dashboard stats');
  return response.json();
}
