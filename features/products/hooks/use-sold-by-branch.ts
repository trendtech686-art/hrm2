import { useQuery } from '@tanstack/react-query';
import type { SystemId } from '@/lib/id-types';

async function fetchSoldCount(productSystemId: string): Promise<Record<string, number>> {
  const res = await fetch(`/api/products/${encodeURIComponent(productSystemId)}/sold-count`);
  if (!res.ok) throw new Error('Failed to fetch sold count');
  const json = await res.json();
  return json.data ?? {};
}

/**
 * Hook to get sold quantity per branch for a product
 * ✅ OPTIMIZED: Uses server-side aggregation instead of fetching ALL orders
 */
export function useSoldByBranch(productSystemId: SystemId | undefined) {
  const { data: soldByBranch = {}, isLoading } = useQuery({
    queryKey: ['products', 'sold-count', productSystemId],
    queryFn: () => fetchSoldCount(productSystemId!),
    enabled: !!productSystemId,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return { soldByBranch, isLoading };
}
