/**
 * useAllEmployeeTypes - Convenience hook for components needing all employee types
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useEmployeeTypes } from './use-employee-types';
import type { EmployeeTypeSetting } from '../api/employee-types-api';

// Stable empty array to prevent re-renders
const EMPTY_EMPLOYEE_TYPES: EmployeeTypeSetting[] = [];

/**
 * Returns all employee types as a flat array
 */
export function useAllEmployeeTypes() {
  const query = useEmployeeTypes({ limit: 500 });
  
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
