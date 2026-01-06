/**
 * useAllCustomers - Convenience hook for components needing all customers as flat array
 */

import * as React from 'react';
import { useCustomers } from './use-customers';
import type { SystemId } from '@/lib/id-types';
import type { Customer } from '../types';

// Stable empty array to prevent re-renders
const EMPTY_CUSTOMERS: Customer[] = [];

export function useAllCustomers() {
  const query = useCustomers({ limit: 30 });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data?.data || EMPTY_CUSTOMERS,
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
 * Returns only active customers (not deleted, status active)
 * Replaces legacy useCustomerStore().getActive()
 */
export function useActiveCustomers() {
  const { data, isLoading, isError, error } = useAllCustomers();
  
  const activeCustomers = React.useMemo(
    () => data.filter(c => !c.isDeleted && c.status !== 'inactive'),
    [data]
  );
  
  return { data: activeCustomers, isLoading, isError, error };
}

/**
 * Returns customers formatted as options for Select/Combobox
 */
export function useCustomerOptions() {
  const { data, isLoading } = useActiveCustomers();
  
  const options = React.useMemo(
    () => data.map(c => ({
      value: c.systemId,
      label: c.name,
    })),
    [data]
  );
  
  return { options, isLoading };
}

/**
 * Helper hook to find a customer by ID from cached data
 * Replaces legacy findById() method
 */
export function useCustomerFinder() {
  const { data } = useAllCustomers();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(c => c.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
