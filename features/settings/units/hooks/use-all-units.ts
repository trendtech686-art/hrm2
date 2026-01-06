/**
 * useAllUnits - Convenience hook for components needing all units as flat array
 */

import { useUnits } from './use-units';

export function useAllUnits() {
  const query = useUnits({ limit: 50 });
  
  return {
    data: query.data?.data || [],
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
