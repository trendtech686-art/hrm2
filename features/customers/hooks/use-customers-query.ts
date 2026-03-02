import { useQuery, keepPreviousData, type UseQueryResult } from '@tanstack/react-query';
import { fetchCustomersPage, type CustomerQueryParams, type CustomerQueryResult } from '../customer-service';
import { useAllCustomers } from './use-all-customers';

export function useCustomersQuery(params: CustomerQueryParams): UseQueryResult<CustomerQueryResult, Error> {
  // Subscribe to store data changes to trigger re-fetch
  const { data: allCustomers } = useAllCustomers();
  
  return useQuery<CustomerQueryResult, Error>({
    queryKey: ['customers', params, allCustomers.length, allCustomers.filter(c => c.isDeleted).length],
    queryFn: () => fetchCustomersPage(params, allCustomers),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}
