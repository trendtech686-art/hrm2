/**
 * useAllPenalties - Convenience hook for components needing all penalties
 */

import { useCallback } from 'react';
import { usePenalties, usePenaltyTypes } from './use-penalties';
import type { Penalty, PenaltyType } from '@/lib/types/prisma-extended';

/**
 * Returns all penalties as a flat array
 */
export function useAllPenalties() {
  const query = usePenalties({ limit: 50 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns all penalty types as a flat array
 */
export function useAllPenaltyTypes() {
  const query = usePenaltyTypes();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for filtering penalties by employee
 */
export function usePenaltiesByEmployee(employeeSystemId: string | undefined) {
  const { data, isLoading, isError, error } = useAllPenalties();
  
  const filteredData = employeeSystemId 
    ? data.filter(p => p.employeeSystemId === employeeSystemId)
    : [];
  
  return {
    data: filteredData,
    isLoading,
    isError,
    error,
  };
}

/**
 * Hook for finding penalty by systemId
 */
export function usePenaltyFinder() {
  const { data } = useAllPenalties();
  
  const findById = useCallback((systemId: string): Penalty | undefined => {
    return data.find(p => p.systemId === systemId);
  }, [data]);
  
  return { findById };
}
