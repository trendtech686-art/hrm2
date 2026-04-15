/**
 * useCheckEmployeeId - Server-side employee business ID uniqueness check
 * 
 * ✅ Phase A6: Replaces loading ALL employees just for ID validation
 * Uses debounced query to avoid excessive API calls during typing
 */

import { useQuery } from '@tanstack/react-query';

async function checkEmployeeId(id: string, exclude?: string): Promise<boolean> {
  const params = new URLSearchParams({ id });
  if (exclude) params.set('exclude', exclude);
  
  const response = await fetch(`/api/employees/check-id?${params}`);
  if (!response.ok) return false;
  
  const result = await response.json();
  return result.data?.exists ?? false;
}

/**
 * Returns whether the given employee business ID already exists
 * Only runs when `id` is a non-empty string
 */
export function useCheckEmployeeId(id: string | undefined, exclude?: string) {
  const query = useQuery({
    queryKey: ['employees', 'check-id', id, exclude],
    queryFn: () => checkEmployeeId(id!, exclude),
    enabled: !!id && id.length >= 2,
    staleTime: 10_000, // Cache for 10s to avoid re-fetching on blur/focus
    gcTime: 30_000,
  });

  return {
    exists: query.data ?? false,
    isChecking: query.isLoading,
  };
}
