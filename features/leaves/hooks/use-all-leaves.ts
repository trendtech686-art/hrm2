/**
 * useAllLeaves - Convenience hook for components needing all leaves
 * 
 * Use case: Related data tables, employee detail views
 */

import { useCallback } from 'react';
import { useLeaves } from './use-leaves';
import type { LeaveRequest } from '@/lib/types/prisma-extended';

/**
 * Returns all leaves as a flat array
 * Compatible with legacy store pattern: { data: leaves }
 */
export function useAllLeaves() {
  const query = useLeaves({ limit: 30 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for filtering leaves by employee
 */
export function useLeavesByEmployee(employeeSystemId: string | undefined) {
  const { data, isLoading, isError, error } = useAllLeaves();
  
  const filteredData = employeeSystemId 
    ? data.filter(l => l.employeeSystemId === employeeSystemId)
    : [];
  
  return {
    data: filteredData,
    isLoading,
    isError,
    error,
  };
}

/**
 * Hook for finding leave by systemId
 */
export function useLeaveFinder() {
  const { data } = useAllLeaves();
  
  const findById = useCallback((systemId: string): LeaveRequest | undefined => {
    return data.find(l => l.systemId === systemId);
  }, [data]);
  
  return { findById };
}
