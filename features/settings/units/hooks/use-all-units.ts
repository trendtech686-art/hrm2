/**
 * useAllUnits - Convenience hook for components needing all units as flat array
 * Auto-pagination: no hardcoded limit cap (MODULE-QUALITY-CRITERIA §1.3)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchUnits } from '../api/units-api';
import { unitKeys } from './use-units';

export function useAllUnits() {
  const query = useQuery({
    queryKey: [...unitKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchUnits(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useActiveUnits() {
  const { data, isLoading } = useAllUnits();
  const activeUnits = data.filter(unit => {
    const isDeleted = 'isDeleted' in unit && Boolean((unit as { isDeleted?: boolean }).isDeleted);
    return !isDeleted && unit.isActive !== false;
  });
  
  return { data: activeUnits, isLoading };
}

export function useUnitOptions() {
  const { data, isLoading } = useActiveUnits();
  const options = data.map(u => ({ value: u.name, label: u.name }));
  
  return { options, isLoading };
}

/**
 * Finder hook to lookup units by name
 * Replaces useUnitStore().data pattern
 */
export function useUnitFinder() {
  const { data } = useAllUnits();

  const findByName = (name: string | undefined) => {
    if (!name) return undefined;
    return data.find((u) => u.name === name);
  };

  return { findByName, data };
}
