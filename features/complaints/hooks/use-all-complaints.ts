/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { fetchComplaints } from '../api/complaints-api';
import { complaintKeys } from './use-complaints';
import type { SystemId } from '@/lib/id-types';

export function useAllComplaints(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...complaintKeys.all, 'all'],
    queryFn: async () => {
      const res = await fetchComplaints();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    enabled: options?.enabled ?? true,
  });
  
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useComplaintFinder() {
  const { data } = useAllComplaints();
  const getComplaintById = (systemId: SystemId) =>
    data.find((c) => c.systemId === systemId) ?? null;
  return { getComplaintById };
}
