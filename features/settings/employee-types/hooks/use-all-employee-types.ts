/**
 * useAllEmployeeTypes - Convenience hook for components needing all employee types
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllEmployeeTypes } from '../api/employee-types-api';
import type { EmployeeTypeSetting } from '../api/employee-types-api';
import { employeeTypeKeys } from './use-employee-types';

// Stable empty array to prevent re-renders
const EMPTY_EMPLOYEE_TYPES: EmployeeTypeSetting[] = [];

/**
 * Returns all employee types as a flat array — uses ?all=true to bypass pagination
 */
export function useAllEmployeeTypes() {
  const query = useQuery({
    queryKey: [...employeeTypeKeys.all, 'all'],
    queryFn: fetchAllEmployeeTypes,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data?.data || EMPTY_EMPLOYEE_TYPES,
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
 * Returns employee types formatted as options for Select/Combobox
 */
export function useEmployeeTypeOptions() {
  const { data, isLoading } = useAllEmployeeTypes();
  
  const options = data.map(t => ({
    value: t.systemId,
    label: t.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding employee type by systemId
 */
export function useEmployeeTypeFinder() {
  const { data } = useAllEmployeeTypes();
  
  const findById = useCallback((systemId: string): EmployeeTypeSetting | undefined => {
    return data.find(t => t.systemId === systemId);
  }, [data]);
  
  const findByName = useCallback((name: string): EmployeeTypeSetting | undefined => {
    return data.find(t => t.name === name);
  }, [data]);
  
  return { findById, findByName };
}
