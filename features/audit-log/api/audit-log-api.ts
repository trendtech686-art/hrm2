/**
 * Audit Log API Layer
 * Handles all audit log-related API calls
 */

import type { LogEntry, LogChange } from '@/lib/types/prisma-extended';

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AuditLogResponse {
  data: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuditLogCreateInput {
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  action: string;
  changes: LogChange[];
}

const BASE_URL = '/api/audit-logs';

/**
 * Fetch audit logs with filters
 */
export async function fetchAuditLogs(
  filters: AuditLogFilters = {}
): Promise<AuditLogResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.entityType) params.set('entityType', filters.entityType);
  if (filters.entityId) params.set('entityId', filters.entityId);
  if (filters.userId) params.set('userId', filters.userId);
  if (filters.action) params.set('action', filters.action);
  if (filters.fromDate) params.set('fromDate', filters.fromDate);
  if (filters.toDate) params.set('toDate', filters.toDate);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch audit logs');
  }
  
  return response.json();
}

/**
 * Fetch audit logs for a specific entity
 */
export async function fetchEntityAuditLogs(
  entityId: string,
  entityType?: string
): Promise<LogEntry[]> {
  const filters: AuditLogFilters = { entityId, limit: 100 };
  if (entityType) filters.entityType = entityType;
  
  const response = await fetchAuditLogs(filters);
  return response.data;
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  data: AuditLogCreateInput
): Promise<LogEntry> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create audit log');
  }
  
  return response.json();
}

/**
 * Get user activity summary
 */
export async function fetchUserActivity(
  userId: string,
  period?: { fromDate: string; toDate: string }
): Promise<{
  total: number;
  byAction: Record<string, number>;
  byEntityType: Record<string, number>;
}> {
  const params = new URLSearchParams({ userId });
  if (period?.fromDate) params.set('fromDate', period.fromDate);
  if (period?.toDate) params.set('toDate', period.toDate);
  
  const response = await fetch(`${BASE_URL}/user-summary?${params}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user activity');
  }
  
  return response.json();
}
