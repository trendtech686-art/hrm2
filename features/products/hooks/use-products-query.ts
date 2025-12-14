import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchProductsPage, type ProductQueryParams, type ProductQueryResult } from '../product-service';

export function useProductsQuery(params: ProductQueryParams): UseQueryResult<ProductQueryResult, Error> {
  return useQuery<ProductQueryResult, Error>({
    queryKey: ['products', params],
    queryFn: () => fetchProductsPage(params),
    staleTime: 30_000,
  });
}
