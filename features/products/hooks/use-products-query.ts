import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { fetchProductsPage, getInitialProductsPage, type ProductQueryParams, type ProductQueryResult } from '../product-service';

export function useProductsQuery(params: ProductQueryParams): UseQueryResult<ProductQueryResult, Error> {
  return useQuery<ProductQueryResult, Error>({
    queryKey: ['products', params],
    queryFn: () => fetchProductsPage(params),
    staleTime: 30_000,
    placeholderData: keepPreviousData, // Keep previous data while fetching new data (no skeleton)
    initialData: () => getInitialProductsPage(params), // Sync data from store on first render (no loading)
  });
}
