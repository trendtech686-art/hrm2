/**
 * useAllBranches - Convenience hook for components needing all branches as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 * 
 * Use case: Dropdowns, selects that need branch options
 * 
 * ⚠️ For paginated views, use useBranches() instead
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchBranches } from '../api/branches-api';
import { branchKeys } from './use-branches';
import type { Branch } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

// ✅ Re-export Branch type for consumers
export type { Branch } from '@/lib/types/prisma-extended';

// ✅ Stable empty array to prevent re-renders
const EMPTY_BRANCHES: Branch[] = [];

/**
 * Returns all branches as a flat array
 * Compatible with legacy store pattern: { data: branches }
 */
export function useAllBranches(options?: { enabled?: boolean }): {
  data: Branch[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} {
  const query = useQuery({
    queryKey: [...branchKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchBranches(p)),
    enabled: options?.enabled !== false,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  const data = React.useMemo(() => {
    return (query.data || EMPTY_BRANCHES) as unknown as Branch[];
  }, [query.data]);
  
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
 * 
 * @param options.enabled - Whether to fetch data (default: true)
 */
export function useBranchFinder(options?: { enabled?: boolean }) {
  const { data, isLoading } = useAllBranches(options);
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined) => {
      if (!systemId) return undefined;
      return data.find(b => b.systemId === systemId);
    },
    [data]
  );
  
  return { findById, isLoading };
}
