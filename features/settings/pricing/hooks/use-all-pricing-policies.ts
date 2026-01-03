/**
 * useAllPricingPolicies - Convenience hook for components needing all policies as flat array
 */

import * as React from 'react';
import { usePricingPolicies as usePricingPoliciesQuery } from './use-pricing';

// Re-export for backward compatibility
export { usePricingPolicies } from './use-pricing';

export function useAllPricingPolicies() {
  const query = usePricingPoliciesQuery({});
  
  return {
    data: query.data?.data || [],
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
