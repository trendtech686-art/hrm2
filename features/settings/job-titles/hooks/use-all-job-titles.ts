/**
 * useAllJobTitles - Convenience hook for components needing all job titles
 */

import { useCallback } from 'react';
import { useJobTitles } from './use-job-titles';
import type { JobTitle } from '../api/job-titles-api';

/**
 * Returns all job titles as a flat array
 */
export function useAllJobTitles() {
  const query = useJobTitles({ limit: 500 });
  
  return {
    data: query.data?.data || [],
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
