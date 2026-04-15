/**
 * Import/Export Logs Hooks
 * React Query hooks for managing import/export audit logs
 * 
 * @module lib/import-export/hooks/use-import-export-logs
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import { toast } from 'sonner';
import type { ImportLogEntry, ExportLogEntry } from '../types';

export const importExportLogsKeys = {
  all: ['import-export-logs'] as const,
  lists: () => [...importExportLogsKeys.all, 'list'] as const,
  list: (params: ImportExportLogsParams) => [...importExportLogsKeys.lists(), params] as const,
  byEntity: (entityType: string) => [...importExportLogsKeys.all, 'entity', entityType] as const,
};

interface ImportExportLogsParams {
  entityType?: string;
  type?: 'import' | 'export';
  limit?: number;
}

interface ImportExportLogsData {
  importLogs: ImportLogEntry[];
  exportLogs: ExportLogEntry[];
}

// API functions
async function fetchImportExportLogs(params: ImportExportLogsParams = {}): Promise<ImportExportLogsData> {
  const query = new URLSearchParams();
  if (params.entityType) query.set('entityType', params.entityType);
  if (params.type) query.set('type', params.type);
  if (params.limit) query.set('limit', params.limit.toString());
  
  const response = await fetch(`/api/import-export-logs?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch import/export logs');
  }
  const result = await response.json();
  return result.data || { importLogs: [], exportLogs: [] };
}

async function addImportLog(log: Omit<ImportLogEntry, 'id'>): Promise<ImportLogEntry> {
  const response = await fetch('/api/import-export-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'import', ...log }),
  });
  if (!response.ok) {
    throw new Error('Failed to add import log');
  }
  const result = await response.json();
  return result.data;
}

async function addExportLog(log: Omit<ExportLogEntry, 'id'>): Promise<ExportLogEntry> {
  const response = await fetch('/api/import-export-logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'export', ...log }),
  });
  if (!response.ok) {
    throw new Error('Failed to add export log');
  }
  const result = await response.json();
  return result.data;
}

async function deleteLog(id: string, type: 'import' | 'export'): Promise<void> {
  const response = await fetch(`/api/import-export-logs/${id}?type=${type}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete log');
  }
}

async function clearLogs(entityType?: string): Promise<void> {
  const query = entityType ? `?entityType=${entityType}` : '';
  const response = await fetch(`/api/import-export-logs/clear${query}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to clear logs');
  }
}

/**
 * Hook to fetch import/export logs
 */
export function useImportExportLogs(params: ImportExportLogsParams = {}) {
  return useQuery({
    queryKey: importExportLogsKeys.list(params),
    queryFn: () => fetchImportExportLogs(params),
    staleTime: 30_000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch logs by entity type
 */
export function useImportExportLogsByEntity(entityType: string) {
  return useQuery({
    queryKey: importExportLogsKeys.byEntity(entityType),
    queryFn: () => fetchImportExportLogs({ entityType }),
    staleTime: 30_000,
  });
}

/**
 * Hook to fetch recent logs (combined import + export)
 */
export function useRecentImportExportLogs(limit = 50) {
  const { data, ...rest } = useImportExportLogs({ limit });
  
  const recentLogs = data
    ? [
        ...data.importLogs.map((l) => ({ ...l, _type: 'import' as const })),
        ...data.exportLogs.map((l) => ({ ...l, _type: 'export' as const })),
      ]
        .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
        .slice(0, limit)
    : [];

  return { data: recentLogs, ...rest };
}

/**
 * Hook for import/export logs mutations
 */
export function useImportExportLogsMutations() {
  const queryClient = useQueryClient();

  const addImport = useMutation({
    mutationFn: addImportLog,
    onSuccess: () => {
      invalidateRelated(queryClient, 'import-export-logs');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log import: ${error.message}`);
    },
  });

  const addExport = useMutation({
    mutationFn: addExportLog,
    onSuccess: () => {
      invalidateRelated(queryClient, 'import-export-logs');
    },
    onError: (error: Error) => {
      toast.error(`Failed to log export: ${error.message}`);
    },
  });

  const remove = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'import' | 'export' }) => deleteLog(id, type),
    onSuccess: () => {
      invalidateRelated(queryClient, 'import-export-logs');
      toast.success('Log đã xóa');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete log: ${error.message}`);
    },
  });

  const clear = useMutation({
    mutationFn: clearLogs,
    onSuccess: () => {
      invalidateRelated(queryClient, 'import-export-logs');
      toast.success('Đã xóa tất cả logs');
    },
    onError: (error: Error) => {
      toast.error(`Failed to clear logs: ${error.message}`);
    },
  });

  return { addImport, addExport, remove, clear };
}

/**
 * Get a specific import log by ID
 */
export function useImportLog(id: string | undefined) {
  const { data } = useImportExportLogs();
  return data?.importLogs.find((l) => l.id === id);
}

/**
 * Get a specific export log by ID
 */
export function useExportLog(id: string | undefined) {
  const { data } = useImportExportLogs();
  return data?.exportLogs.find((l) => l.id === id);
}
