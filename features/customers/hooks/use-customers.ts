/**
 * useCustomers - React Query hooks for customers
 * 
 * ⚠️ IMPORTANT: Direct import pattern
 * - Import this file directly: import { useCustomers } from '@/features/customers/hooks/use-customers'
 * - NEVER import from '@/features/customers' or '@/features/customers/store'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import {
  fetchCustomers,
  fetchCustomer,
  searchCustomers,
  fetchCustomerDebt,
  fetchCustomerOrders,
  type CustomersParams,
  type PaginatedResponse,
} from '../api/customers-api';
import {
  createCustomerAction,
  updateCustomerAction,
  deleteCustomerAction,
  restoreCustomerAction,
  type CreateCustomerInput,
  type UpdateCustomerInput,
} from '@/app/actions/customers';
import type { Customer } from '@/lib/types/prisma-extended';

// Re-export types for backwards compatibility
export type { CreateCustomerInput, UpdateCustomerInput };

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
  stats: () => [...customerKeys.all, 'stats'] as const,
  groups: () => [...customerKeys.all, 'groups'] as const,
};

// Types for initial data from Server Components
export interface CustomerStats {
  totalCustomers: number;
  customersWithDebt: number;
  totalDebtAmount: number;
  newCustomersThisMonth: number;
  deletedCount?: number;
}

export interface CustomerGroup {
  systemId: string;
  id: string;
  name: string;
  color: string | null;
}

/**
 * Hook for customer statistics with optional initial data from Server Component
 */
export function useCustomerStats(initialData?: CustomerStats) {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: async () => {
      const res = await fetch('/api/customers/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json() as Promise<CustomerStats>;
    },
    initialData,
    staleTime: initialData ? 60_000 : 0, // Fresh for 1 min if we have initial data
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for customer groups with optional initial data from Server Component
 */
export function useCustomerGroups(initialData?: CustomerGroup[]) {
  return useQuery({
    queryKey: customerKeys.groups(),
    queryFn: async () => {
      const res = await fetch('/api/customers/groups');
      if (!res.ok) throw new Error('Failed to fetch groups');
      return res.json() as Promise<CustomerGroup[]>;
    },
    initialData,
    staleTime: initialData ? 10 * 60_000 : 0, // Fresh for 10 min if we have initial data
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook for fetching paginated customers list
 * Supports initialData from Server Component for instant hydration
 * 
 * @example
 * ```tsx
 * function CustomersPage({ initialData }) {
 *   const [page, setPage] = useState(1);
 *   const { data, isLoading } = useCustomers({ page, limit: 50 }, initialData);
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
export function useCustomers(
  params: CustomersParams = {},
  initialData?: PaginatedResponse<Customer>
) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    initialData,
    staleTime: initialData ? 60_000 : 0, // Fresh for 1 min if we have initial data
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook for infinite scroll customers list
 * Loads 30 customers per page, automatically fetches more when scrolling
 */
export function useInfiniteCustomers(params: Omit<CustomersParams, 'page'> = {}) {
  const limit = params.limit || 30;
  
  return useInfiniteQuery({
    queryKey: [...customerKeys.lists(), 'infinite', params],
    queryFn: ({ pageParam = 1 }) => fetchCustomers({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    staleTime: 60_000,
    gcTime: 10 * 60 * 1000,
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
export function useCustomerSearch(query: string, limit = 50) {
  return useQuery({
    queryKey: customerKeys.search(query),
    queryFn: () => searchCustomers(query, limit),
    enabled: query.length >= 2,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000, // 5 minutes
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
    gcTime: 5 * 60 * 1000, // 5 minutes
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
    mutationFn: async (data: CreateCustomerInput) => {
      const result = await createCustomerAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to create customer');
      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (data: UpdateCustomerInput) => {
      const result = await updateCustomerAction(data);
      if (!result.success) throw new Error(result.error || 'Failed to update customer');
      return result.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteCustomerAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete customer');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
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

// ============ TRASH HOOKS ============

import {
  fetchDeletedCustomers,
  permanentDeleteCustomer,
  bulkDeleteCustomers,
  bulkRestoreCustomers,
  bulkUpdateCustomerStatus,
} from '../api/customers-api';

/**
 * Hook for fetching deleted customers (trash)
 */
export function useDeletedCustomers() {
  return useQuery({
    queryKey: [...customerKeys.all, 'deleted'],
    queryFn: fetchDeletedCustomers,
    staleTime: 30_000,
  });
}

/**
 * Hook for trash mutations (restore, permanent delete)
 */
export function useTrashMutations() {
  const queryClient = useQueryClient();
  
  const restore = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await restoreCustomerAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to restore customer');
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
  
  const permanentDelete = useMutation({
    mutationFn: permanentDeleteCustomer,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: [...customerKeys.all, 'deleted'] });
      const previousDeleted = queryClient.getQueryData([...customerKeys.all, 'deleted']);
      queryClient.setQueryData(
        [...customerKeys.all, 'deleted'],
        (old: Array<{ systemId: string }> | undefined) => 
          old?.filter(item => item.systemId !== systemId) || []
      );
      return { previousDeleted };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousDeleted) {
        queryClient.setQueryData([...customerKeys.all, 'deleted'], context.previousDeleted);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
  
  return {
    restore,
    permanentDelete,
    isRestoring: restore.isPending,
    isDeleting: permanentDelete.isPending,
  };
}

/**
 * Hook for bulk operations (delete, restore, status update)
 */
interface UseBulkMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useBulkCustomerMutations(options: UseBulkMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const bulkDelete = useMutation({
    mutationFn: bulkDeleteCustomers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
  
  const bulkRestore = useMutation({
    mutationFn: bulkRestoreCustomers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
  
  const bulkUpdateStatus = useMutation({
    mutationFn: ({ systemIds, status }: { systemIds: string[]; status: string }) => 
      bulkUpdateCustomerStatus(systemIds, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      options.onSuccess?.();
    },
    onError: options.onError,
  });
  
  return {
    bulkDelete,
    bulkRestore,
    bulkUpdateStatus,
    isDeleting: bulkDelete.isPending,
    isRestoring: bulkRestore.isPending,
    isUpdatingStatus: bulkUpdateStatus.isPending,
    isMutating: bulkDelete.isPending || bulkRestore.isPending || bulkUpdateStatus.isPending,
  };
}
