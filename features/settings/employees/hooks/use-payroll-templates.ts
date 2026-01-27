/**
 * Payroll Templates React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import * as api from '../api/payroll-templates-api';
import type { PayrollTemplate } from '@/lib/payroll-types';

export const payrollTemplatesKeys = {
  all: ['payroll-templates'] as const,
  list: () => [...payrollTemplatesKeys.all, 'list'] as const,
};

// ========================================
// Main Hook - Fetch all templates
// ========================================
export function usePayrollTemplates() {
  return useQuery({
    queryKey: payrollTemplatesKeys.list(),
    queryFn: api.fetchPayrollTemplates,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: keepPreviousData,
  });
}

// ========================================
// Mutations
// ========================================
export function usePayrollTemplatesMutations(opts?: { onSuccess?: () => void; onError?: (error: Error) => void }) {
  const qc = useQueryClient();

  const handleError = (error: Error) => {
    opts?.onError?.(error);
  };

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (input: { 
      templates: PayrollTemplate[]; 
      newTemplate: Omit<PayrollTemplate, 'systemId' | 'id' | 'createdAt' | 'updatedAt'> 
    }) => {
      return api.createPayrollTemplate(input.templates, input.newTemplate);
    },
    onSuccess: (data) => {
      qc.setQueryData(payrollTemplatesKeys.list(), data);
      opts?.onSuccess?.();
    },
    onError: handleError,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (input: { 
      templates: PayrollTemplate[]; 
      systemId: string; 
      updates: Partial<PayrollTemplate> 
    }) => {
      return api.updatePayrollTemplate(input.templates, input.systemId, input.updates);
    },
    onSuccess: (data) => {
      qc.setQueryData(payrollTemplatesKeys.list(), data);
      opts?.onSuccess?.();
    },
    onError: handleError,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (input: { templates: PayrollTemplate[]; systemId: string }) => {
      return api.deletePayrollTemplate(input.templates, input.systemId);
    },
    onSuccess: (data) => {
      qc.setQueryData(payrollTemplatesKeys.list(), data);
      opts?.onSuccess?.();
    },
    onError: handleError,
  });

  // Save all mutation (for bulk updates)
  const saveMutation = useMutation({
    mutationFn: api.savePayrollTemplates,
    onSuccess: (data) => {
      qc.setQueryData(payrollTemplatesKeys.list(), data);
      opts?.onSuccess?.();
    },
    onError: handleError,
  });

  return {
    create: createMutation,
    update: updateMutation,
    remove: deleteMutation,
    saveAll: saveMutation,
  };
}

// ========================================
// Helper hooks
// ========================================
export function useDefaultPayrollTemplate() {
  const { data: templates } = usePayrollTemplates();
  return templates?.find(t => t.isDefault) ?? templates?.[0] ?? null;
}
