/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchComplaints } from '../api/complaints-api';
import { complaintKeys } from './use-complaints';
import type { Complaint } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllComplaints(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: [...complaintKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchComplaints(p)),
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
 * Helper hook to find a complaint by ID from cached data
 * Replaces legacy getComplaintById() method
 */
export function useComplaintFinder() {
  const { data, isLoading } = useAllComplaints();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Complaint | undefined => {
      if (!systemId) return undefined;
      return data.find(c => c.systemId === systemId);
    },
    [data]
  );
  
  // Alias for backward compatibility with getComplaintById
  const getComplaintById = findById;
  
  return { findById, getComplaintById, isLoading };
}
