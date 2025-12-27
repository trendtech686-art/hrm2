/**
 * useAllTasks - Convenience hook for components needing all tasks
 */

import { useCallback } from 'react';
import { useTasks } from './use-tasks';
import type { Task } from '@/lib/types/prisma-extended';

/**
 * Returns all tasks as a flat array
 */
export function useAllTasks() {
  const query = useTasks({ limit: 30 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for filtering tasks by employee (assignee)
 */
export function useTasksByEmployee(employeeSystemId: string | undefined) {
  const { data, isLoading, isError, error } = useAllTasks();
  
  const filteredData = employeeSystemId 
    ? data.filter(t => 
        t.assignees?.some(a => a.employeeSystemId === employeeSystemId) ||
        t.assigneeId === employeeSystemId
      )
    : [];
  
  return {
    data: filteredData,
    isLoading,
    isError,
    error,
  };
}

/**
 * Hook for finding task by systemId
 */
export function useTaskFinder() {
  const { data } = useAllTasks();
  
  const findById = useCallback((systemId: string): Task | undefined => {
    return data.find(t => t.systemId === systemId);
  }, [data]);
  
  return { findById };
}
