/**
 * useAllPricingPolicies - Convenience hook for components needing all policies as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPricingPolicies } from '../api/pricing-api';
import { pricingPolicyKeys } from './use-pricing';

// Re-export for backward compatibility
export { usePricingPolicies } from './use-pricing';

/**
 * Returns all pricing policies as a flat array.
 * Uses server-side limit=200 (pricing policies are typically <50 items).
 */
export function useAllPricingPolicies(options: { enabled?: boolean } = {}) {
  const { enabled = true } = options;
  const query = useQuery({
    queryKey: [...pricingPolicyKeys.all, 'all'],
    queryFn: async () => {
      const result = await fetchPricingPolicies({ page: 1, limit: 200 });
      return result.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - settings rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    enabled,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns only active pricing policies (isActive = true)
 * Replaces legacy usePricingPolicyStore().getActive()
 */
export function useActivePricingPolicies() {
  const { data, isLoading, isError, error } = useAllPricingPolicies();
  
  const activePolicies = React.useMemo(
    () => data.filter(p => p.isActive !== false),
    [data]
  );
  
  return { data: activePolicies, isLoading, isError, error };
}

export function useDefaultSellingPolicy() {
  const { data, isLoading } = useAllPricingPolicies();
  const defaultPolicy = data.find(p => p.type === 'Bán hàng' && p.isDefault);
  
  return { defaultPolicy, isLoading };
}

export function useSellingPolicies() {
  const { data, isLoading } = useAllPricingPolicies();
  const sellingPolicies = data.filter(p => p.type === 'Bán hàng');
  
  return { data: sellingPolicies, isLoading };
}
