/**
 * Audit Log React Query Hooks
 * Provides data fetching for audit logs
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAuditLogs,
  fetchEntityAuditLogs,
  createAuditLog,
  fetchUserActivity,
  type AuditLogFilters,
  type AuditLogCreateInput,
} from '../api/audit-log-api';

// Query keys factory
export const auditLogKeys = {
  all: ['audit-logs'] as const,
  lists: () => [...auditLogKeys.all, 'list'] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.lists(), filters] as const,
  entity: (entityId: string, entityType?: string) => 
    [...auditLogKeys.all, 'entity', entityId, entityType] as const,
  userActivity: (userId: string) => [...auditLogKeys.all, 'user', userId] as const,
};

/**
 * Hook to fetch audit logs with filters
 */
export function useAuditLogs(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => fetchAuditLogs(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch audit logs for a specific entity
 */
export function useEntityAuditLogs(
  entityId: string | undefined,
  entityType?: string
) {
  return useQuery({
    queryKey: auditLogKeys.entity(entityId!, entityType),
    queryFn: () => fetchEntityAuditLogs(entityId!, entityType),
    enabled: !!entityId,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to fetch user activity summary
 */
export function useUserActivity(
  userId: string | undefined,
  period?: { fromDate: string; toDate: string }
) {
  return useQuery({
    queryKey: auditLogKeys.userActivity(userId!),
    queryFn: () => fetchUserActivity(userId!, period),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing audit log mutations
 */
export function useAuditLogMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateLogs = () => {
    queryClient.invalidateQueries({ queryKey: auditLogKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: AuditLogCreateInput) => createAuditLog(data),
    onSuccess: () => {
      invalidateLogs();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    isLoading: create.isPending,
  };
}

/**
 * Hook to fetch recent audit logs
 */
export function useRecentAuditLogs(limit = 20) {
  return useAuditLogs({ limit });
}

/**
 * Hook to fetch audit logs by action type
 */
export function useAuditLogsByAction(action: string) {
  return useAuditLogs({ action, limit: 50 });
}
