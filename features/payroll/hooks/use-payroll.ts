/**
 * Payroll React Query Hooks
 * Provides data fetching and mutations for payroll management
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import {
  fetchPayrolls,
  fetchPayrollById,
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
import {
  createPayrollAction,
  updatePayrollAction,
  deletePayrollAction,
} from '@/app/actions/payroll';
import {
  createBatchWithPayslips,
  updateBatchStatus as updateBatchStatusAPI,
  updatePayslipWithAudit,
  removePayslipFromBatch as removePayslipAPI,
  cancelBatch as cancelBatchAPI,
  ensureDefaultTemplate as ensureDefaultTemplateAPI,
  setDefaultTemplate as setDefaultTemplateAPI,
  type CreateBatchWithPayslipsInput,
  type UpdateBatchStatusInput,
  type UpdatePayslipInput as UpdatePayslipInputAPI,
  type CancelBatchInput,
} from '../api/payroll-mutations-api';

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
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: keepPreviousData,
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
    gcTime: 10 * 60 * 1000, // 10 minutes
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
    mutationFn: async (data: PayrollCreateInput) => {
      const result = await createPayrollAction(data as Parameters<typeof createPayrollAction>[0]);
      if (!result.success) throw new Error(result.error || 'Failed to create payroll');
      return result.data;
    },
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: PayrollUpdateInput }) => {
      const result = await updatePayrollAction({ systemId, ...data } as Parameters<typeof updatePayrollAction>[0]);
      if (!result.success) throw new Error(result.error || 'Failed to update payroll');
      return result.data;
    },
    onSuccess: () => {
      invalidatePayroll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deletePayrollAction(systemId);
      if (!result.success) throw new Error(result.error || 'Failed to delete payroll');
      return result.data;
    },
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
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch payslips for a specific batch
 */
export function usePayslipsByBatch(batchId: string | undefined) {
  return useQuery({
    queryKey: payslipKeys.byBatch(batchId!),
    queryFn: () => fetchPayslips({ batchId: batchId! }),
    enabled: !!batchId,
    staleTime: 1000 * 60,
    placeholderData: keepPreviousData,
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
    placeholderData: keepPreviousData,
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
  });
}

// ============== Extended Mutations ==============

/**
 * Hook for complex payroll batch operations
 */
export function usePayrollBatchMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: payrollKeys.all });
    queryClient.invalidateQueries({ queryKey: payslipKeys.all });
  };

  const createWithPayslips = useMutation({
    mutationFn: (data: CreateBatchWithPayslipsInput) => createBatchWithPayslips(data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const updateStatus = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: UpdateBatchStatusInput }) =>
      updateBatchStatusAPI(systemId, data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const cancel = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data?: CancelBatchInput }) =>
      cancelBatchAPI(systemId, data || {}),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    createWithPayslips,
    updateStatus,
    cancel,
    isLoading: createWithPayslips.isPending || updateStatus.isPending || cancel.isPending,
  };
}

/**
 * Hook for enhanced payslip operations
 */
export function usePayslipExtendedMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: payslipKeys.all });
    queryClient.invalidateQueries({ queryKey: payrollKeys.all });
  };

  const updateWithAudit = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: UpdatePayslipInputAPI }) =>
      updatePayslipWithAudit(systemId, data),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const removeFromBatch = useMutation({
    mutationFn: (payslipSystemId: string) => removePayslipAPI(payslipSystemId),
    onSuccess: () => {
      invalidateAll();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    updateWithAudit,
    removeFromBatch,
    isLoading: updateWithAudit.isPending || removeFromBatch.isPending,
  };
}

/**
 * Hook for template extended operations
 */
export function usePayrollTemplateExtended(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTemplates = () => {
    queryClient.invalidateQueries({ queryKey: payrollTemplateKeys.all });
  };

  const ensureDefault = useMutation({
    mutationFn: () => ensureDefaultTemplateAPI(),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  const setDefault = useMutation({
    mutationFn: (systemId: string) => setDefaultTemplateAPI(systemId),
    onSuccess: () => {
      invalidateTemplates();
      options.onSuccess?.();
    },
    onError: options.onError,
  });

  return {
    ensureDefault,
    setDefault,
    isLoading: ensureDefault.isPending || setDefault.isPending,
  };
}

// ============== Convenience Hooks ==============

/**
 * Hook for lightweight summary card data (server-side aggregation)
 * Replaces useAllPayrollBatches() for dashboard summary cards
 * Supports initialData from server-side prefetch for instant display
 */
export function usePayrollStats(initialData?: Record<string, unknown>) {
  return useQuery({
    queryKey: [...payrollKeys.all, 'stats'],
    queryFn: () => import('../api/payroll-api').then(m => m.fetchPayrollStats()),
    staleTime: 1000 * 60 * 2,
    gcTime: 10 * 60 * 1000,
    initialData: initialData as Awaited<ReturnType<typeof import('../api/payroll-api').fetchPayrollStats>> | undefined,
    initialDataUpdatedAt: initialData ? Date.now() : undefined,
  });
}

/**
 * Hook to fetch all batches as flat array
 * Uses auto-pagination to fetch ALL pages (§1.3 compliant)
 */
export function useAllPayrollBatches() {
  const query = useQuery({
    queryKey: [...payrollKeys.all, 'all-batches'],
    queryFn: () => fetchAllPages((p) => fetchPayrolls(p)),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return { ...query, data: query.data ?? [] };
}

/**
 * Hook to fetch payroll batches with server-side pagination
 * Alias for usePayrolls with proper return structure
 */
export function usePayrollBatches(filters: PayrollFilters = {}) {
  return usePayrolls(filters);
}

/**
 * Hook to fetch all payslips as flat array
 * Uses auto-pagination to fetch ALL pages (§1.3 compliant)
 */
export function useAllPayslips() {
  const query = useQuery({
    queryKey: [...payrollKeys.all, 'all-payslips'],
    queryFn: () => fetchAllPages((p) => fetchPayslips(p)),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return { ...query, data: query.data ?? [] };
}
