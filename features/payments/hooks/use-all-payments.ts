/**
 * useAllPayments - Convenience hook for components needing all payments as flat array
 */

import * as React from 'react';
import { usePayments } from './use-payments';
import type { Payment } from '@/lib/types/prisma-extended';

// Stable empty array to prevent re-renders
const EMPTY_PAYMENTS: Payment[] = [];

export function useAllPayments() {
  const query = usePayments({});
  
  // Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => 
    query.data?.data || EMPTY_PAYMENTS,
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
 * Finder hook for looking up payments by systemId
 */
export function usePaymentFinder() {
  const { data: payments = [] } = useAllPayments();
  
  const findById = React.useCallback((systemId: string): Payment | undefined => {
    return payments.find(p => p.systemId === systemId);
  }, [payments]);
  
  return { findById };
}
