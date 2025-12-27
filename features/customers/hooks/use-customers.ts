/**
 * useCustomers - React Query hooks for customers
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useCustomers } from '@/features/customers/hooks/use-customers'
 * - NEVER import from '@/features/customers' or '@/features/customers/store'
 * 
 * This hook is ISOLATED - it only depends on:
 * - @tanstack/react-query
 * - Local API functions
 * - Local types
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchCustomers,
  fetchCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  fetchCustomerDebt,
  fetchCustomerOrders,
  type CustomersParams,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from '../api/customers-api';

// Query keys - exported for invalidation
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params: CustomersParams) => [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  search: (query: string) => [...customerKeys.all, 'search', query] as const,
  debt: (id: string) => [...customerKeys.all, 'debt', id] as const,
  orders: (id: string, params?: { page?: number; limit?: number }) => [...customerKeys.all, 'orders', id, params] as const,
};

/**
 * Hook for fetching paginated customers list
 * 
 * @example
 * ```tsx
 * function CustomersPage() {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useCustomers({ page, limit: 50 });
 *   
 *   return (
 *     <DataTable 
 *       data={data?.data || []} 
 *       pagination={data?.pagination}
 *       onPageChange={setPage}
 *     />
 *   );
 * }
 * ```
 */
export function useCustomers(params: CustomersParams = {}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    staleTime: 60_000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for fetching single customer by ID
 */
export function useCustomer(id: string | null | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id!),
    queryFn: () => fetchCustomer(id!),
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for searching customers (autocomplete)
 */
export function useCustomerSearch(query: string, limit = 20) {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => searchCustomers(query, limit),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });
}

/**
 * Hook for fetching customer debt info
 */
export function useCustomerDebt(customerId: string | null | undefined) {
  return useQuery({
    queryKey: customerKeys.debt(customerId!),
    queryFn: () => fetchCustomerDebt(customerId!),
    enabled: !!customerId,
    staleTime: 30_000,
  });
}

/**
 * Hook for fetching customer order history
 */
export function useCustomerOrders(customerId: string | null | undefined, params: { page?: number; limit?: number } = {}) {
  return useQuery({
    queryKey: customerKeys.orders(customerId!, params),
    queryFn: () => fetchCustomerOrders(customerId!, params),
    enabled: !!customerId,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for customer mutations (create/update/delete)
 */
interface UseCustomerMutationsOptions {
  onCreateSuccess?: (customer: unknown) => void;
  onUpdateSuccess?: (customer: unknown) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useCustomerMutations(options: UseCustomerMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createCustomer,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: updateCustomer,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return {
    create,
    update,
    remove,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
    isMutating: create.isPending || update.isPending || remove.isPending,
  };
}

/**
 * Hook for getting customers with debt
 */
export function useCustomersWithDebt(params: Omit<CustomersParams, 'hasDebt'> = {}) {
  return useCustomers({ ...params, hasDebt: true });
}

/**
 * Hook for getting VIP customers
 */
export function useVIPCustomers(params: Omit<CustomersParams, 'lifecycleStage'> = {}) {
  return useCustomers({ ...params, lifecycleStage: 'Khách VIP' });
}

/**
 * Hook for getting active customers
 */
export function useActiveCustomers(params: Omit<CustomersParams, 'status'> = {}) {
  return useCustomers({ ...params, status: 'active' });
}
