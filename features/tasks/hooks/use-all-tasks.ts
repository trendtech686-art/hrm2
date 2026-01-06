/**
 * useAllTasks - Convenience hook for components needing all tasks
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useTasks } from './use-tasks';
import type { Task } from '@/lib/types/prisma-extended';

// Stable empty array to prevent re-renders
const EMPTY_TASKS: Task[] = [];

/**
 * Returns all tasks as a flat array
 */
export function useAllTasks() {
  const query = useTasks({ limit: 30 });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data?.data || EMPTY_TASKS,
    [query.data?.data]
  );
  
  return {
    data,
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
