import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchCustomersPage, type CustomerQueryParams, type CustomerQueryResult } from '../customer-service';
import { useCustomerStore } from '../store';
import { useCustomerSlaEngineStore } from '../sla/store';

export function useCustomersQuery(params: CustomerQueryParams): UseQueryResult<CustomerQueryResult, Error> {
  // Subscribe to store data changes to trigger re-fetch
  const storeData = useCustomerStore((state) => state.data);
  const slaLastEvaluated = useCustomerSlaEngineStore((state) => state.lastEvaluatedAt);
  
  return useQuery<CustomerQueryResult, Error>({
    queryKey: ['customers', params, storeData.length, storeData.filter(c => c.isDeleted).length, slaLastEvaluated],
    queryFn: () => fetchCustomersPage(params),
    staleTime: 30_000,
  });
}
