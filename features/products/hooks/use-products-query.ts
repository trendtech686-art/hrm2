import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { fetchProductsPage, type ProductQueryParams, type ProductQueryResult } from '../product-service';
import { productKeys } from './use-products';

export function useProductsQuery(params: ProductQueryParams): UseQueryResult<ProductQueryResult, Error> {
  return useQuery<ProductQueryResult, Error>({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProductsPage(params),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    placeholderData: keepPreviousData,
  });
}
