/**
 * useComplaints - React Query hooks (Khiếu nại)
 * 
 * ⚠️ Direct import: import { useComplaints } from '@/features/complaints/hooks/use-complaints'
 * 
 * Updated to use Server Actions for mutations (Phase 2 migration)
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchComplaints,
  fetchComplaint,
  fetchComplaintStats,
  type ComplaintsParams,
} from '../api/complaints-api';
import {
  createComplaintAction,
  updateComplaintAction,
  deleteComplaintAction,
  resolveComplaintAction,
  closeComplaintAction,
  type CreateComplaintInput,
  type UpdateComplaintInput,
} from '@/app/actions/complaints';
import type { Complaint } from '@/lib/types/prisma-extended';
import { invalidateRelated } from '@/lib/query-invalidation-map';

// Re-export types for backwards compatibility
export type { CreateComplaintInput, UpdateComplaintInput };

// Legacy format support
type LegacyUpdateInput = { systemId: string; data: Partial<Complaint> };

function toUpdateComplaintInput(input: UpdateComplaintInput | LegacyUpdateInput): UpdateComplaintInput {
  const i = input as Record<string, unknown>;
  if (i.data && typeof i.data === 'object') {
    const legacy = input as LegacyUpdateInput;
    const d = legacy.data as Record<string, unknown>;
    return {
      systemId: legacy.systemId,
      description: d.description as string | undefined,
      title: d.title as string | undefined,
      status: d.status as string | undefined,
      priority: d.priority as string | undefined,
      type: d.type as string | undefined,
      assigneeId: d.assigneeId as string | undefined,
      assigneeSystemId: d.assigneeSystemId as string | undefined,
      assigneeName: d.assigneeName as string | undefined,
      dueDate: d.dueDate as string | undefined,
      resolution: d.resolution as string | undefined,
      // ⭐ NEW: Include image and product fields
      images: d.images as UpdateComplaintInput['images'],
      employeeImages: d.employeeImages as UpdateComplaintInput['employeeImages'],
      affectedProducts: d.affectedProducts as UpdateComplaintInput['affectedProducts'],
      orderCode: d.orderCode as string | undefined,
      orderValue: d.orderValue as number | undefined,
      // ⭐ FIX: Include verification fields - THESE WERE MISSING!
      verification: d.verification as string | undefined,
      isVerifiedCorrect: d.isVerifiedCorrect as boolean | undefined,
      timeline: d.timeline as unknown[] | undefined,
    };
  }
  return input as UpdateComplaintInput;
}

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

// Types for initial data from Server Components
export interface ComplaintStats {
  pending: number;
  inProgress: number;
  resolved: number;
  total: number;
}

/**
 * Hook for complaint statistics with optional initial data from Server Component
 */
export function useComplaintStats(initialData?: ComplaintStats) {
  return useQuery({
    queryKey: complaintKeys.stats(),
    queryFn: fetchComplaintStats,
    initialData,
    staleTime: initialData ? 60_000 : 0,
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

interface UseComplaintMutationsOptions {
  onSuccess?: () => void;
  onCreateSuccess?: (complaint: Complaint) => void;
  onUpdateSuccess?: (complaint: Complaint) => void;
  onDeleteSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useComplaintMutations(options: UseComplaintMutationsOptions = {}) {
  const queryClient = useQueryClient();
  
  const create = useMutation({
    mutationFn: async (data: CreateComplaintInput | Partial<Complaint>) => {
      const input = data as CreateComplaintInput;
      const result = await createComplaintAction(input);
      if (!result.success) {
        throw new Error(result.error || 'Failed to create complaint');
      }
      return result.data as unknown as Complaint;
    },
    onSuccess: (data) => {
      invalidateRelated(queryClient, 'complaints');
      options.onCreateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const update = useMutation({
    mutationFn: async (input: UpdateComplaintInput | LegacyUpdateInput) => {
      const converted = toUpdateComplaintInput(input);
      const result = await updateComplaintAction(converted);
      if (!result.success) {
        throw new Error(result.error || 'Failed to update complaint');
      }
      return result.data as unknown as Complaint;
    },
    onSuccess: async (data, variables) => {
      const systemId = 'data' in variables ? variables.systemId : variables.systemId;
      // ✅ Use refetchQueries to wait for fresh data before updating UI
      await queryClient.refetchQueries({ queryKey: complaintKeys.detail(systemId) });
      await queryClient.refetchQueries({ queryKey: complaintKeys.lists() });
      invalidateRelated(queryClient, 'complaints');
      options.onUpdateSuccess?.(data);
    },
    onError: options.onError,
  });
  
  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteComplaintAction(systemId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete complaint');
      }
      return result.data;
    },
    // Optimistic delete - UI cập nhật ngay lập tức
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: complaintKeys.lists() });
      
      const previousLists = queryClient.getQueriesData({ queryKey: complaintKeys.lists() });
      
      queryClient.setQueriesData(
        { queryKey: complaintKeys.lists() },
        (old: { data?: Array<{ systemId: string }>, pagination?: unknown } | undefined) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter(item => item.systemId !== systemId),
          };
        }
      );
      
      return { previousLists };
    },
    onError: (_err, _systemId, context) => {
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      options.onError?.(_err as Error);
    },
    onSuccess: () => {
      options.onDeleteSuccess?.();
    },
    onSettled: () => {
      invalidateRelated(queryClient, 'complaints');
    },
  });

  const resolve = useMutation({
    mutationFn: async (input: { systemId: string; resolution: string; resolvedBy?: string }) => {
      const result = await resolveComplaintAction(input.systemId, input.resolution, input.resolvedBy);
      if (!result.success) {
        throw new Error(result.error || 'Failed to resolve complaint');
      }
      return result.data as unknown as Complaint;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'complaints');
    },
    onError: options.onError,
  });

  const close = useMutation({
    mutationFn: async (input: { systemId: string; closedBy?: string }) => {
      const result = await closeComplaintAction(input.systemId, input.closedBy);
      if (!result.success) {
        throw new Error(result.error || 'Failed to close complaint');
      }
      return result.data as unknown as Complaint;
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'complaints');
    },
    onError: options.onError,
  });
  
  return { create, update, remove, resolve, close };
}

export function usePendingComplaints() {
  return useComplaints({ status: 'pending' });
}

export function useComplaintsByCustomer(customerId: string | null | undefined) {
  return useComplaints({ customerId: customerId || undefined });
}

export function useComplaintsByOrder(orderId: string | null | undefined) {
  return useComplaints({ orderId: orderId || undefined });
}
