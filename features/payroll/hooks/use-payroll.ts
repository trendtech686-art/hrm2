/**
 * Payroll React Query Hooks
 * Provides data fetching and mutations for payroll management
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  fetchPayrolls,
  fetchPayrollById,
  fetchPayslips,
  fetchPayrollTemplates,
  createPayrollTemplate,
  updatePayrollTemplate,
  deletePayrollTemplate,
  type PayrollFilters,
  type PayslipFilters,
  type PayrollTemplateFilters,
  type PayrollTemplate,
} from '../api/payroll-api';
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
 * Hook providing template mutations
 */
export function usePayrollTemplateMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateTemplates = () => invalidateRelated(queryClient, 'payroll-templates');

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

// ============== Extended Mutations ==============

/**
 * Hook for complex payroll batch operations
 */
export function usePayrollBatchMutations(options: MutationCallbacks = {}) {
  const queryClient = useQueryClient();

  const invalidateAll = () => invalidateRelated(queryClient, 'payroll');

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

  const invalidateAll = () => invalidateRelated(queryClient, 'payslips');

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

  const invalidateTemplates = () => invalidateRelated(queryClient, 'payroll-templates');

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
 * Hook to fetch payroll batches with server-side pagination
 * Alias for usePayrolls with proper return structure
 */
export function usePayrollBatches(filters: PayrollFilters = {}) {
  return usePayrolls(filters);
}
