/**
 * useAllPayments - Convenience hook for components needing all payments as flat array
 */

import * as React from 'react';
import { usePayments } from './use-payments';
import type { Payment } from '@/lib/types/prisma-extended';

export function useAllPayments() {
  const query = usePayments({});
  
  return {
    data: query.data?.data || [],
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
