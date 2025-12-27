/**
 * Dashboard React Query Hooks
 */

import { useQuery } from '@tanstack/react-query';
import * as api from '../api/dashboard-api';
import type { DashboardFilters } from '../api/dashboard-api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: (filters: DashboardFilters) => [...dashboardKeys.all, 'data', filters] as const,
  summary: (filters: DashboardFilters) => [...dashboardKeys.all, 'summary', filters] as const,
  debtAlerts: () => [...dashboardKeys.all, 'debt-alerts'] as const,
};

export function useDashboardData(filters: DashboardFilters = {}) {
  return useQuery({ queryKey: dashboardKeys.data(filters), queryFn: () => api.fetchDashboardData(filters), staleTime: 1000 * 60 * 2, refetchInterval: 1000 * 60 * 5 });
}

export function useDashboardSummary(filters: DashboardFilters = {}) {
  return useQuery({ queryKey: dashboardKeys.summary(filters), queryFn: () => api.fetchDashboardSummary(filters), staleTime: 1000 * 60 * 2 });
}

export function useDebtAlerts() {
  return useQuery({ queryKey: dashboardKeys.debtAlerts(), queryFn: api.fetchDebtAlerts, staleTime: 1000 * 60 * 5 });
}
