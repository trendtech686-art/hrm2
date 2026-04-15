/**
 * useAllCustomers - Convenience hook for components needing all customers as flat array
 * 
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 * 
 * @param options.enabled - Set to false to disable fetching (lazy load)
 * 
 * @example
 * // Lazy load - only fetch when dialog opens
 * const { data: customers } = useAllCustomers({ enabled: isOpen });
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchCustomers } from '../api/customers-api';
import { customerKeys } from './use-customers';
import type { SystemId } from '@/lib/id-types';
import type { Customer } from '../types';

// Stable empty array to prevent re-renders
const EMPTY_CUSTOMERS: Customer[] = [];

interface UseAllCustomersOptions {
  /** Set to false to disable fetching until needed */
  enabled?: boolean;
  /** @deprecated Ignored — auto-pagination fetches all */
  limit?: number;
}

export function useAllCustomers(options: UseAllCustomersOptions = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...customerKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchCustomers(p)),
    enabled,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data || EMPTY_CUSTOMERS,
    [query.data]
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
 * Helper hook to find a customer by ID from cached data.
 * Cache-only: subscribes to the query cache but NEVER triggers a fetch.
 * Data is available if any other component has loaded all customers.
 * If cache is cold, findById returns undefined.
 */
export function useCustomerFinder() {
  const { data } = useAllCustomers({ enabled: false });
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(c => c.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
