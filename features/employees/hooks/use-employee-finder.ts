/**
 * useEmployeeFinder - Cache-only hook to find employee by ID
 * 
 * Uses useAllEmployees with enabled: false to subscribe to cache without triggering fetch.
 * If no other component has loaded employees, findById will return undefined.
 * 
 * @example
 * const { findById } = useEmployeeFinder();
 * const emp = findById(systemId);
 */

import * as React from 'react';
import { useAllEmployees } from './use-all-employees';
import type { Employee } from '@/lib/types/prisma-extended';
import type { SystemId } from '@/lib/id-types';

export function useEmployeeFinder() {
  // Cache-only: subscribe to query cache but never trigger a fetch
  const { data } = useAllEmployees({ enabled: false });

  const findById = React.useCallback(
    (systemId: SystemId | string | undefined): Employee | undefined => {
      if (!systemId) return undefined;
      return data.find((e: Employee) => e.systemId === systemId);
    },
    [data]
  );

  return { findById };
}
