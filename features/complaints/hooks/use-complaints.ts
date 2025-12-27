/**
 * useComplaints - React Query hooks
 * 
 * ⚠️ Direct import: import { useComplaints } from '@/features/complaints/hooks/use-complaints'
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchComplaints,
  fetchComplaint,
  createComplaint,
  updateComplaint,
  deleteComplaint,
  fetchComplaintStats,
  type ComplaintsParams,
} from '../api/complaints-api';
import type { Complaint } from '@/lib/types/prisma-extended';

export const complaintKeys = {
  all: ['complaints'] as const,
  lists: () => [...complaintKeys.all, 'list'] as const,
  list: (params: ComplaintsParams) => [...complaintKeys.lists(), params] as const,
  details: () => [...complaintKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintKeys.details(), id] as const,
  stats: () => [...complaintKeys.all, 'stats'] as const,
};

export function useComplaints(params: ComplaintsParams = {}) {
  return useQuery({
    queryKey: complaintKeys.list(params),
    queryFn: () => fetchComplaints(params),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

export function useComplaint(id: string | null | undefined) {
  return useQuery({
    queryKey: complaintKeys.detail(id!),
    queryFn: () => fetchComplaint(id!),
    enabled: !!id,
    staleTime: 60_000,
  });
}

export function useComplaintStats() {
  return useQuery({
    queryKey: complaintKeys.stats(),
    queryFn: fetchComplaintStats,
    staleTime: 60_000,
  });
}

interface UseComplaintMutationsOptions {
  onCreateSuccess?: (complaint: Complaint) => void;
  onUpdateSuccess?: (complaint: Complaint) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useComplaintMutations(options: UseComplaintMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: createComplaint,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.lists() });
      queryClient.invalidateQueries({ queryKey: complaintKeys.stats() });
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<Complaint> }) => 
      updateComplaint(systemId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.detail(variables.systemId) });
      queryClient.invalidateQueries({ queryKey: complaintKeys.lists() });
      queryClient.invalidateQueries({ queryKey: complaintKeys.stats() });
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: deleteComplaint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all });
      options.onDeleteSuccess?.();
    },
    onError: options.onError,
  });
  
  return { create, update, remove };
}

export function usePendingComplaints() {
  return useComplaints({ status: 'pending' });
}

export function useComplaintsByCustomer(customerId: string | null | undefined) {
  return useComplaints({ customerId: customerId || undefined, limit: 50 });
}

export function useComplaintsByOrder(orderId: string | null | undefined) {
  return useComplaints({ orderId: orderId || undefined, limit: 20 });
}
