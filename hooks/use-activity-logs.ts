/**
 * Hook to fetch activity logs for an entity
 * 
 * @module hooks/use-activity-logs
 */

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { HistoryEntry } from '@/components/ActivityHistory';

export interface ActivityLog {
  systemId: string;
  entityType: string;
  entityId: string;
  action: string;
  actionType?: string;
  changes?: Record<string, { from?: unknown; to?: unknown }>;
  metadata?: Record<string, unknown>;
  note?: string;
  createdAt: string;
  createdBy?: string;
}

export interface PaginatedActivityLogsResponse {
  data: ActivityLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityLogFilters {
  entityType?: string;
  entityId?: string;
  action?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

interface UseActivityLogsOptions {
  entityType?: string;
  entityId?: string;
  enabled?: boolean;
  limit?: number;
}

interface UsePaginatedActivityLogsOptions {
  filters?: ActivityLogFilters;
  page?: number;
  limit?: number;
  enabled?: boolean;
}

/**
 * Fetch activity logs for a specific entity (legacy, single entity)
 */
export function useActivityLogs({ 
  entityType, 
  entityId, 
  enabled = true,
  limit = 50,
}: UseActivityLogsOptions) {
  return useQuery({
    queryKey: ['activity-logs', entityType, entityId],
    queryFn: async (): Promise<ActivityLog[]> => {
      const params = new URLSearchParams({
        entityType: entityType || '',
        entityId: entityId || '',
        limit: String(limit),
      });
      
      const response = await fetch(`/api/activity-logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      
      const result = await response.json();
      return result.data || [];
    },
    enabled: enabled && !!entityType && !!entityId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Fetch paginated activity logs with filters (new dashboard use case)
 */
export function usePaginatedActivityLogs({
  filters = {},
  page = 1,
  limit = 50,
  enabled = true,
}: UsePaginatedActivityLogsOptions = {}) {
  const filterParams = new URLSearchParams(
    Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== undefined && v !== ''))
  );
  
  return useQuery({
    queryKey: ['activity-logs', 'paginated', filters, page, limit],
    queryFn: async (): Promise<PaginatedActivityLogsResponse> => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      
      // Add filter params
      for (const [key, value] of filterParams) {
        if (value) params.set(key, value);
      }
      
      const response = await fetch(`/api/activity-logs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch activity logs');
      }
      
      return response.json();
    },
    enabled,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
  });
}

/**
 * Convert ActivityLog to HistoryEntry format for UI component
 */
export function mapActivityLogsToHistory(logs: ActivityLog[]): HistoryEntry[] {
  return logs.map(log => ({
    id: log.systemId,
    action: log.action as HistoryEntry['action'],
    description: log.note || `${log.action}`,
    timestamp: new Date(log.createdAt),
    user: log.createdBy ? {
      systemId: log.createdBy,
      name: (log.metadata?.userName as string) || log.createdBy,
    } : { systemId: '', name: 'Hệ thống' },
    metadata: log.changes ? {
      ...log.changes,
      ...log.metadata,
    } : log.metadata,
  }));
}

/**
 * Combined hook that returns formatted history entries
 */
export function useActivityHistory(entityType: string, entityId: string, enabled = true) {
  const { data: logs = [], isLoading, error } = useActivityLogs({
    entityType,
    entityId,
    enabled,
  });
  
  return {
    history: mapActivityLogsToHistory(logs),
    isLoading,
    error,
  };
}
