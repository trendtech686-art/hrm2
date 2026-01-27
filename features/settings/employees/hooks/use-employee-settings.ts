/**
 * Employee Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/employee-settings-api';
import type { WorkShift, LeaveType, SalaryComponent } from '@/lib/types/prisma-extended';

// Re-export default settings for fallback usage
export { DEFAULT_EMPLOYEE_SETTINGS } from '../employee-settings-service';

export const employeeSettingsKeys = {
  all: ['employee-settings'] as const,
  main: () => [...employeeSettingsKeys.all, 'main'] as const,
  workShifts: () => [...employeeSettingsKeys.all, 'work-shifts'] as const,
  leaveTypes: () => [...employeeSettingsKeys.all, 'leave-types'] as const,
  salaryComponents: () => [...employeeSettingsKeys.all, 'salary-components'] as const,
  insuranceRates: () => [...employeeSettingsKeys.all, 'insurance-rates'] as const,
};

// ========================================
// Main Employee Settings Hook (all-in-one)
// ========================================
export function useEmployeeSettings() {
  return useQuery({
    queryKey: employeeSettingsKeys.main(),
    queryFn: api.fetchEmployeeSettings,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useEmployeeSettingsMutation(opts?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.saveEmployeeSettings,
    onSuccess: (data) => {
      // Update cache với data mới
      qc.setQueryData(employeeSettingsKeys.main(), data);
      opts?.onSuccess?.();
    },
    onError: (error: Error) => {
      opts?.onError?.(error);
    },
  });
}

// Work Shifts
export function useWorkShifts() {
  return useQuery({ queryKey: employeeSettingsKeys.workShifts(), queryFn: api.fetchWorkShifts, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useWorkShiftMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: employeeSettingsKeys.workShifts() });
  return {
    create: useMutation({ mutationFn: api.createWorkShift, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<WorkShift> }) => api.updateWorkShift(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteWorkShift, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Leave Types
export function useLeaveTypes() {
  return useQuery({ queryKey: employeeSettingsKeys.leaveTypes(), queryFn: api.fetchLeaveTypes, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useLeaveTypeMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: employeeSettingsKeys.leaveTypes() });
  return {
    create: useMutation({ mutationFn: api.createLeaveType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<LeaveType> }) => api.updateLeaveType(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteLeaveType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Salary Components
export function useSalaryComponents() {
  return useQuery({ queryKey: employeeSettingsKeys.salaryComponents(), queryFn: api.fetchSalaryComponents, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

/**
 * Hook to get salary components as flat array
 */
export function useAllSalaryComponents() {
  const { data } = useSalaryComponents();
  return data ?? [];
}

export function useSalaryComponentMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: employeeSettingsKeys.salaryComponents() });
  return {
    create: useMutation({ mutationFn: api.createSalaryComponent, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<SalaryComponent> }) => api.updateSalaryComponent(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteSalaryComponent, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Insurance Rates
export function useInsuranceRates() {
  return useQuery({ queryKey: employeeSettingsKeys.insuranceRates(), queryFn: api.fetchInsuranceRates, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useInsuranceRatesMutation(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.updateInsuranceRates,
    onSuccess: () => { qc.invalidateQueries({ queryKey: employeeSettingsKeys.insuranceRates() }); opts?.onSuccess?.(); },
  });
}
