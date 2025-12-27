/**
 * Payroll React Query Hooks
 * Provides data fetching and mutations for payroll management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPayrolls,
  fetchPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
  lockPayroll,
  cancelPayroll,
  fetchPayslips,
  fetchPayslipById,
  createPayslip,
  updatePayslip,
  deletePayslip,
  fetchPayrollTemplates,
  fetchPayrollTemplateById,
  createPayrollTemplate,
  updatePayrollTemplate,
  deletePayrollTemplate,
  type PayrollFilters,
  type PayrollCreateInput,
  type PayrollUpdateInput,
  type PayslipFilters,
  type PayslipCreateInput,
  type PayslipUpdateInput,
  type PayrollTemplateFilters,
  type PayrollTemplate,
} from '../api/payroll-api';

// ============== Query Keys ==============

export const payrollKeys = {
  all: ['payroll'] as const,
  lists: () => [...payrollKeys.all, 'list'] as const,
  list: (filters: PayrollFilters) => [...payrollKeys.lists(), filters] as const,
  details: () => [...payrollKeys.all, 'detail'] as const,
  detail: (id: string) => [...payrollKeys.details(), id] as const,
};

export const payslipKeys = {
  all: ['payslips'] as const,
  lists: () => [...payslipKeys.all, 'list'] as const,
  list: (filters: PayslipFilters) => [...payslipKeys.lists(), filters] as const,
  details: () => [...payslipKeys.all, 'detail'] as const,
  detail: (id: string) => [...payslipKeys.details(), id] as const,
  byBatch: (batchId: string) => [...payslipKeys.all, 'batch', batchId] as const,
};

export const payrollTemplateKeys = {
  all: ['payroll-templates'] as const,
  lists: () => [...payrollTemplateKeys.all, 'list'] as const,
  list: (filters: PayrollTemplateFilters) => [...payrollTemplateKeys.lists(), filters] as const,
  details: () => [...payrollTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...payrollTemplateKeys.details(), id] as const,
};

// ============== Payroll Batch Hooks ==============

/**
 * Hook to fetch payroll batches with filters
 */
export function usePayrolls(filters: PayrollFilters = {}) {
  return useQuery({
    queryKey: payrollKeys.list(filters),
    queryFn: () => fetchPayrolls(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch single payroll batch
 */
export function usePayrollById(systemId: string | undefined) {
  return useQuery({
    queryKey: payrollKeys.detail(systemId!),
    queryFn: () => fetchPayrollById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
  });
}

interface MutationCallbacks {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook providing payroll batch mutations
 */
export function usePayrollMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidatePayroll = () => {
    queryClient.invalidateQueries({ queryKey: payrollKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: PayrollCreateInput) => createPayroll(data),
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PayrollUpdateInput }) =>
      updatePayroll(systemId, data),
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePayroll(systemId),
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const lock = useMutation({
    mutationFn: (systemId: string) => lockPayroll(systemId),
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: (systemId: string) => cancelPayroll(systemId),
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    lock,
    cancel,
    isLoading:
      create.isPending ||
      update.isPending ||
      remove.isPending ||
      lock.isPending ||
      cancel.isPending,
  };
}

// ============== Payslip Hooks ==============

/**
 * Hook to fetch payslips with filters
 */
export function usePayslips(filters: PayslipFilters = {}) {
  return useQuery({
    queryKey: payslipKeys.list(filters),
    queryFn: () => fetchPayslips(filters),
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to fetch payslips for a specific batch
 */
export function usePayslipsByBatch(batchId: string | undefined) {
  return useQuery({
    queryKey: payslipKeys.byBatch(batchId!),
    queryFn: () => fetchPayslips({ batchId: batchId!, limit: 200 }),
    enabled: !!batchId,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook to fetch single payslip
 */
export function usePayslipById(systemId: string | undefined) {
  return useQuery({
    queryKey: payslipKeys.detail(systemId!),
    queryFn: () => fetchPayslipById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60,
  });
}

/**
 * Hook providing payslip mutations
 */
export function usePayslipMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidatePayslips = () => {
    queryClient.invalidateQueries({ queryKey: payslipKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: PayslipCreateInput) => createPayslip(data),
    onSuccess: () => {
      invalidatePayslips();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: PayslipUpdateInput }) =>
      updatePayslip(systemId, data),
    onSuccess: () => {
      invalidatePayslips();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePayslip(systemId),
    onSuccess: () => {
      invalidatePayslips();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    isLoading: create.isPending || update.isPending || remove.isPending,
  };
}

// ============== Template Hooks ==============

/**
 * Hook to fetch payroll templates
 */
export function usePayrollTemplates(filters: PayrollTemplateFilters = {}) {
  return useQuery({
    queryKey: payrollTemplateKeys.list(filters),
    queryFn: () => fetchPayrollTemplates(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes - templates don't change often
  });
}

/**
 * Hook to fetch all templates as flat array
 */
export function useAllPayrollTemplates() {
  const { data } = usePayrollTemplates();
  return data?.data ?? [];
}

/**
 * Hook to fetch active templates only
 */
export function useActivePayrollTemplates() {
  return usePayrollTemplates({ isActive: true });
}

/**
 * Finder hook for payroll templates
 */
export function usePayrollTemplateFinder() {
  const templates = useAllPayrollTemplates();
  return {
    findById: (systemId: string | undefined) => systemId ? templates.find(t => t.systemId === systemId) : undefined,
    getDefault: () => templates.find(t => t.isDefault),
  };
}

/**
 * Hook to fetch single template
 */
export function usePayrollTemplateById(systemId: string | undefined) {
  return useQuery({
    queryKey: payrollTemplateKeys.detail(systemId!),
    queryFn: () => fetchPayrollTemplateById(systemId!),
    enabled: !!systemId,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Hook providing template mutations
 */
export function usePayrollTemplateMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTemplates = () => {
    queryClient.invalidateQueries({ queryKey: payrollTemplateKeys.all });
  };

  const create = useMutation({
    mutationFn: (data: Omit<PayrollTemplate, 'systemId' | 'createdAt' | 'updatedAt'>) =>
      createPayrollTemplate(data),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PayrollTemplate> }) =>
      updatePayrollTemplate(systemId, data),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: (systemId: string) => deletePayrollTemplate(systemId),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    create,
    update,
    remove,
    isLoading: create.isPending || update.isPending || remove.isPending,
  };
}

// ============== Utility Hooks ==============

/**
 * Hook to get current month/year payroll
 */
export function useCurrentMonthPayroll() {
  const now = new Date();
  return usePayrolls({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });
}

/**
 * Hook to get employee's payslips
 */
export function useEmployeePayslips(employeeId: string | undefined) {
  return usePayslips({
    employeeId: employeeId || '',
    limit: 12, // Last 12 months
  });
}
