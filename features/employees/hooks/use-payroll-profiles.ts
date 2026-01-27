/**
 * React Query hooks for employee payroll profiles
 * Replaces useEmployeeCompStore with server-backed data
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import {
  fetchPayrollProfiles,
  fetchPayrollProfile,
  upsertPayrollProfile,
  updatePayrollProfile,
  deletePayrollProfile,
} from '../api/payroll-profiles-api';
import type { SystemId } from '@/lib/id-types';
import type { EmployeePayrollProfileInput, ResolvedPayrollProfile } from '../employee-comp-store';
import { getEmployeeSettingsSync } from '@/features/settings/employees/employee-settings-service';

// Query keys factory
export const payrollProfileKeys = {
  all: ['payroll-profiles'] as const,
  lists: () => [...payrollProfileKeys.all, 'list'] as const,
  list: () => [...payrollProfileKeys.lists()] as const,
  details: () => [...payrollProfileKeys.all, 'detail'] as const,
  detail: (employeeSystemId: SystemId) => [...payrollProfileKeys.details(), employeeSystemId] as const,
};

/**
 * Hook to fetch all payroll profiles
 */
export function usePayrollProfiles() {
  return useQuery({
    queryKey: payrollProfileKeys.list(),
    queryFn: fetchPayrollProfiles,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch a single payroll profile
 */
export function usePayrollProfile(employeeSystemId: SystemId | undefined) {
  return useQuery({
    queryKey: payrollProfileKeys.detail(employeeSystemId!),
    queryFn: () => fetchPayrollProfile(employeeSystemId!),
    enabled: !!employeeSystemId,
    staleTime: 1000 * 60 * 5,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Helper to get resolved payroll profile with defaults
 * This replicates the getPayrollProfile logic from the store
 */
export function useResolvedPayrollProfile(employeeSystemId: SystemId | undefined): {
  profile: ResolvedPayrollProfile | null;
  isLoading: boolean;
} {
  const { data: profile, isLoading } = usePayrollProfile(employeeSystemId);

  if (!employeeSystemId) {
    return { profile: null, isLoading: false };
  }

  if (isLoading) {
    return { profile: null, isLoading: true };
  }

  // If no profile exists, return default
  if (!profile) {
    const defaultComponentIds = getEmployeeSettingsSync().salaryComponents.map((c) => c.systemId);
    return {
      profile: {
        employeeSystemId,
        workShiftSystemId: undefined,
        salaryComponentSystemIds: defaultComponentIds,
        payrollBankAccount: undefined,
        paymentMethod: 'bank_transfer',
        createdAt: '',
        updatedAt: '',
        usesDefaultComponents: true,
      },
      isLoading: false,
    };
  }

  // Return existing profile
  return {
    profile: {
      ...profile,
      usesDefaultComponents: false,
    },
    isLoading: false,
  };
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing payroll profile mutations
 */
export function usePayrollProfileMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateProfiles = () => {
    queryClient.invalidateQueries({ queryKey: payrollProfileKeys.all });
  };

  const upsert = useMutation({
    mutationFn: ({ employeeSystemId, input }: { employeeSystemId: SystemId; input: EmployeePayrollProfileInput }) =>
      upsertPayrollProfile(employeeSystemId, input),
    onSuccess: () => {
      invalidateProfiles();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ employeeSystemId, input }: { employeeSystemId: SystemId; input: Partial<EmployeePayrollProfileInput> }) =>
      updatePayrollProfile(employeeSystemId, input),
    onSuccess: () => {
      invalidateProfiles();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (employeeSystemId: SystemId) => deletePayrollProfile(employeeSystemId),
    onSuccess: () => {
      invalidateProfiles();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    upsert,
    update,
    remove,
    isLoading: upsert.isPending || update.isPending || remove.isPending,
  };
}
