/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 */

import * as React from 'react';
import { useComplaints } from './use-complaints';
import type { Complaint } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useAllComplaints() {
  const query = useComplaints({});
  
  return {
    data: query.data?.data || [],
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
  const { data } = useAllComplaints();
  
  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Complaint | undefined => {
      if (!systemId) return undefined;
      return data.find(c => c.systemId === systemId);
    },
    [data]
  );
  
  // Alias for backward compatibility with getComplaintById
  const getComplaintById = findById;
  
  return { findById, getComplaintById };
}
