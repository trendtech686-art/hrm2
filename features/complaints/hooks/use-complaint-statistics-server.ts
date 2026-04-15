/**
 * ⚡ PERFORMANCE: Server-side complaint statistics hook
 * Replaces useAllComplaints() + useComplaintStatistics(complaints)
 * 
 * Instead of loading ALL complaint records to the client for computation,
 * this hook fetches pre-computed statistics from the server API.
 */

import { useQuery } from '@tanstack/react-query';
import type { ComplaintStatistics } from './use-complaint-statistics';

async function fetchComplaintStatistics(): Promise<ComplaintStatistics> {
  const response = await fetch('/api/complaints/statistics');
  if (!response.ok) throw new Error('Không thể tải thống kê khiếu nại');
  return response.json();
}

/**
 * Fetch pre-computed complaint statistics from server
 * 
 * @example
 * ```tsx
 * const { data: stats, isLoading } = useComplaintStatisticsServer();
 * ```
 */
export function useComplaintStatisticsServer() {
  return useQuery({
    queryKey: ['complaint-statistics'],
    queryFn: fetchComplaintStatistics,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
