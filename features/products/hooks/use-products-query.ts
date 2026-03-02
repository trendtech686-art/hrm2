import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { fetchProductsPage, type ProductQueryParams, type ProductQueryResult } from '../product-service';

export function useProductsQuery(params: ProductQueryParams): UseQueryResult<ProductQueryResult, Error> {
  return useQuery<ProductQueryResult, Error>({
    queryKey: ['products', params],
    queryFn: () => fetchProductsPage(params),
    staleTime: 60_000, // 1 minute - longer cache for better performance
    gcTime: 5 * 60_000, // 5 minutes garbage collection
    placeholderData: keepPreviousData, // Keep previous data while fetching new data (no skeleton)
    refetchOnWindowFocus: false, // Don't refetch on window focus for better performance
  });
}
