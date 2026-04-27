/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import { useQuery } from '@tanstack/react-query';
import { fetchComplaints } from '../api/complaints-api';
import { complaintKeys } from './use-complaints';
import type { SystemId } from '@/lib/id-types';
import type { Complaint } from '@/lib/types/prisma-extended';

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

/**
 * useComplaintFinder - Cache-only finder for complaint by ID
 * 
 * Uses useAllComplaints with enabled: false to subscribe to cache without triggering fetch.
 * If no other component has loaded complaints, getComplaintById will return null.
 */
export function useComplaintFinder() {
  // Cache-only: subscribe to query cache but never trigger a fetch
  const { data } = useAllComplaints({ enabled: false });
  
  const getComplaintById = (systemId: SystemId): Complaint | null =>
    data.find((c) => c.systemId === systemId) ?? null;
  
  return { getComplaintById };
}
