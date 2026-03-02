/**
 * useAllJobTitles - Convenience hook for components needing all job titles
 * Uses fetchAllPages auto-pagination to load ALL records
 */

import * as React from 'react';
import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { fetchJobTitles } from '../api/job-titles-api';
import type { JobTitle } from '../api/job-titles-api';
import { jobTitleKeys } from './use-job-titles';

// Stable empty array to prevent re-renders
const EMPTY_JOB_TITLES: JobTitle[] = [];

/**
 * Returns all job titles as a flat array
 */
export function useAllJobTitles() {
  const query = useQuery({
    queryKey: [...jobTitleKeys.all, 'all'],
    queryFn: () => fetchAllPages((p) => fetchJobTitles(p)),
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
  
  const data = React.useMemo(() => 
    query.data || EMPTY_JOB_TITLES,
    [query.data]
  );
  
  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns job titles formatted as options for Select/Combobox
 */
export function useJobTitleOptions() {
  const { data, isLoading } = useAllJobTitles();
  
  const options = data.map(j => ({
    value: j.systemId,
    label: j.name,
  }));
  
  return { options, isLoading };
}

/**
 * Hook for finding job title by systemId
 */
export function useJobTitleFinder() {
  const { data } = useAllJobTitles();
  
  const findById = useCallback((systemId: string): JobTitle | undefined => {
    return data.find(j => j.systemId === systemId);
  }, [data]);
  
  return { findById };
}
