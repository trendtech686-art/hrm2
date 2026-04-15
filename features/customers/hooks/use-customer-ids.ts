/**
 * useCustomerIds - Lightweight hook that fetches only customer business IDs
 * Used for uniqueness validation in forms (instead of fetching all customer data)
 */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomerIds } from '../api/customers-api';
import { customerKeys } from './use-customers';

const EMPTY_IDS: string[] = [];

export function useCustomerIds() {
  const query = useQuery({
    queryKey: [...customerKeys.all, 'ids'],
    queryFn: fetchCustomerIds,
    staleTime: 10 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });

  const data = React.useMemo(() => query.data || EMPTY_IDS, [query.data]);

  return {
    data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
