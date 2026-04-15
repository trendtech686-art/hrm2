/**
 * Task Boards API Layer
 */

export interface TaskBoard {
  systemId: string;
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
}

const BASE_URL = '/api/tasks/boards';

export async function fetchTaskBoards(): Promise<TaskBoard[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error('Failed to fetch task boards');
  return response.json();
}

export async function fetchTaskBoardById(systemId: string): Promise<TaskBoard> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  if (!response.ok) throw new Error('Failed to fetch task board');
  return response.json();
}

export async function createTaskBoard(data: Partial<TaskBoard>): Promise<TaskBoard> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create task board');
  }
  return response.json();
}

export async function updateTaskBoard(systemId: string, data: Partial<TaskBoard>): Promise<TaskBoard> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update task board');
  }
  return response.json();
}

export async function deleteTaskBoard(systemId: string): Promise<TaskBoard> {
  const response = await fetch(`${BASE_URL}/${systemId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete task board');
  return response.json();
}
