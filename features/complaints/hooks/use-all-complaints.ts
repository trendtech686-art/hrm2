/**
 * useAllComplaints - Convenience hook for components needing all complaints as flat array
 */

import { useComplaints } from './use-complaints';

export function useAllComplaints() {
  const query = useComplaints({});
  
  return {
    data: query.data?.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
