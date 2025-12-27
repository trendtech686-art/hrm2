/**
 * useAllCustomers - Convenience hook for components needing all customers as flat array
 */

import * as React from 'react';
import { useCustomers } from './use-customers';
import type { SystemId } from '@/lib/id-types';

export function useAllCustomers() {
  const query = useCustomers({ limit: 30 });
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
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
