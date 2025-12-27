/**
 * Print Templates React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/print-templates-api';
import type { PrintTemplate, TemplateType } from '@/lib/types/prisma-extended';

export const printTemplateKeys = {
  all: ['print-templates'] as const,
  lists: () => [...printTemplateKeys.all, 'list'] as const,
  list: (type?: TemplateType) => [...printTemplateKeys.lists(), type] as const,
  details: () => [...printTemplateKeys.all, 'detail'] as const,
  detail: (id: string) => [...printTemplateKeys.details(), id] as const,
};

export function usePrintTemplates(type?: TemplateType) {
  return useQuery({ queryKey: printTemplateKeys.list(type), queryFn: () => api.fetchPrintTemplates(type), staleTime: 1000 * 60 * 10 });
}

export function usePrintTemplateById(id: string | undefined) {
  return useQuery({ queryKey: printTemplateKeys.detail(id!), queryFn: () => api.fetchPrintTemplateById(id!), enabled: !!id });
}

export function usePrintTemplateMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: printTemplateKeys.all });
  return {
    create: useMutation({ mutationFn: api.createPrintTemplate, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<PrintTemplate> }) => api.updatePrintTemplate(id, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deletePrintTemplate, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    duplicate: useMutation({ mutationFn: api.duplicatePrintTemplate, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    reset: useMutation({ mutationFn: api.resetPrintTemplate, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
