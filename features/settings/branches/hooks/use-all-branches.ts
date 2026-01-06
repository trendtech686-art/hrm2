/**
 * useAllBranches - Convenience hook for components needing all branches as flat array
 * 
 * Use case: Dropdowns, selects that need branch options
 * 
 * ⚠️ For paginated views, use useBranches() instead
 */

import * as React from 'react';
import { useBranches } from './use-branches';
import type { Branch } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// ✅ Stable empty array to prevent re-renders
const EMPTY_BRANCHES: Branch[] = [];

/**
 * Returns all branches as a flat array
 * Compatible with legacy store pattern: { data: branches }
 * 
 * Note: API returns string systemIds, but we cast to Branch[] for internal use
 */
export function useAllBranches(): {
  data: Branch[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const query = useBranches({ limit: 100 });
  
  // ✅ Memoize data to prevent unnecessary re-renders
  const data = React.useMemo(() => {
    return (query.data?.data || EMPTY_BRANCHES) as unknown as Branch[];
  }, [query.data?.data]);
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns branches formatted as options for Select/Combobox
 */
export function useBranchOptions() {
  const { data, isLoading } = useAllBranches();
  
  const options = data.map(b => ({
    value: b.systemId,
    label: b.name,
  }));
  
  return { options, isLoading };
}

/**
 * Returns the default branch
 */
export function useDefaultBranch() {
  const { data, isLoading } = useAllBranches();
  const defaultBranch = data.find(b => b.isDefault) || data[0];
  
  return { defaultBranch, isLoading };
}

/**
 * Helper hook to find a branch by ID from cached data
 * Replaces legacy findById() method
 */
export function useBranchFinder() {
  const { data } = useAllBranches();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(b => b.systemId === systemId);
    },
    [data]
  );
  
  return { findById };
}
