/**
 * Convenience hooks for customer settings - flat array access
 */

import { useCallback } from 'react';
import { 
  useCustomerTypes, 
  useCustomerGroups, 
  useCustomerSources,
  usePaymentTerms,
  useCreditRatings,
  useLifecycleStages,
} from './use-customer-settings';
import type { CustomerType, CustomerGroup, CustomerSource, PaymentTerm, CreditRating, LifecycleStage } from '@/lib/types/prisma-extended';

/**
 * Returns all customer types as a flat array
 */
export function useAllCustomerTypes() {
  const query = useCustomerTypes();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns customer types formatted as options
 */
export function useCustomerTypeOptions() {
  const { data, isLoading } = useAllCustomerTypes();
  
  const options = data.map(t => ({
    value: t.systemId,
    label: t.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding customer type by systemId
 */
export function useCustomerTypeFinder() {
  const { data } = useAllCustomerTypes();
  
  const findById = useCallback((systemId: string): CustomerType | undefined => {
    return data.find(t => t.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all customer groups as a flat array
 */
export function useAllCustomerGroups() {
  const query = useCustomerGroups();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns customer groups formatted as options
 */
export function useCustomerGroupOptions() {
  const { data, isLoading } = useAllCustomerGroups();
  
  const options = data.map(g => ({
    value: g.systemId,
    label: g.name,
  }));
  
  return { options, isLoading };
}

/**
 * Returns all customer sources as a flat array
 */
export function useAllCustomerSources() {
  const query = useCustomerSources();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns customer sources formatted as options
 */
export function useCustomerSourceOptions() {
  const { data, isLoading } = useAllCustomerSources();
  
  const options = data.map(s => ({
    value: s.systemId,
    label: s.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding customer group by systemId
 */
export function useCustomerGroupFinder() {
  const { data } = useAllCustomerGroups();
  
  const findById = useCallback((systemId: string): CustomerGroup | undefined => {
    return data.find(g => g.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Hook for finding customer source by systemId
 */
export function useCustomerSourceFinder() {
  const { data } = useAllCustomerSources();
  
  const findById = useCallback((systemId: string): CustomerSource | undefined => {
    return data.find(s => s.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all payment terms as a flat array
 */
export function useAllPaymentTerms() {
  const query = usePaymentTerms();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for finding payment term by systemId
 */
export function usePaymentTermFinder() {
  const { data } = useAllPaymentTerms();
  
  const findById = useCallback((systemId: string): PaymentTerm | undefined => {
    return data.find(t => t.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all credit ratings as a flat array
 */
export function useAllCreditRatings() {
  const query = useCreditRatings();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for finding credit rating by systemId
 */
export function useCreditRatingFinder() {
  const { data } = useAllCreditRatings();
  
  const findById = useCallback((systemId: string): CreditRating | undefined => {
    return data.find(r => r.systemId === systemId);
  }, [data]);
  
  return { findById };
}

/**
 * Returns all lifecycle stages as a flat array
 */
export function useAllLifecycleStages() {
  const query = useLifecycleStages();
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Hook for finding lifecycle stage by systemId
 */
export function useLifecycleStageFinder() {
  const { data } = useAllLifecycleStages();
  
  const findById = useCallback((systemId: string): LifecycleStage | undefined => {
    return data.find(s => s.systemId === systemId);
  }, [data]);
  
  return { findById };
}
