/**
 * Customer Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/customer-settings-api';
import type { CustomerType, CustomerGroup, CustomerSource, PaymentTerm, CreditRating, LifecycleStage, CustomerSlaSetting } from '@/lib/types/prisma-extended';

export const customerSettingsKeys = {
  all: ['customer-settings'] as const,
  types: () => [...customerSettingsKeys.all, 'types'] as const,
  groups: () => [...customerSettingsKeys.all, 'groups'] as const,
  sources: () => [...customerSettingsKeys.all, 'sources'] as const,
  paymentTerms: () => [...customerSettingsKeys.all, 'payment-terms'] as const,
  creditRatings: () => [...customerSettingsKeys.all, 'credit-ratings'] as const,
  lifecycleStages: () => [...customerSettingsKeys.all, 'lifecycle-stages'] as const,
  slaSettings: () => [...customerSettingsKeys.all, 'sla-settings'] as const,
};

// Customer Types
export function useCustomerTypes() {
  return useQuery({ queryKey: customerSettingsKeys.types(), queryFn: api.fetchCustomerTypes, staleTime: 1000 * 60 * 10 });
}

export function useCustomerTypeMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.types() });
  return {
    create: useMutation({ mutationFn: api.createCustomerType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerType> }) => api.updateCustomerType(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Customer Groups
export function useCustomerGroups() {
  return useQuery({ queryKey: customerSettingsKeys.groups(), queryFn: api.fetchCustomerGroups, staleTime: 1000 * 60 * 10 });
}

export function useCustomerGroupMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.groups() });
  return {
    create: useMutation({ mutationFn: api.createCustomerGroup, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerGroup> }) => api.updateCustomerGroup(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerGroup, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Customer Sources
export function useCustomerSources() {
  return useQuery({ queryKey: customerSettingsKeys.sources(), queryFn: api.fetchCustomerSources, staleTime: 1000 * 60 * 10 });
}

export function useCustomerSourceMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.sources() });
  return {
    create: useMutation({ mutationFn: api.createCustomerSource, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerSource> }) => api.updateCustomerSource(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerSource, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Payment Terms
export function usePaymentTerms() {
  return useQuery({ queryKey: customerSettingsKeys.paymentTerms(), queryFn: api.fetchPaymentTerms, staleTime: 1000 * 60 * 10 });
}

export function usePaymentTermMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.paymentTerms() });
  return {
    create: useMutation({ mutationFn: api.createPaymentTerm, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PaymentTerm> }) => api.updatePaymentTerm(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deletePaymentTerm, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Credit Ratings
export function useCreditRatings() {
  return useQuery({ queryKey: customerSettingsKeys.creditRatings(), queryFn: api.fetchCreditRatings, staleTime: 1000 * 60 * 10 });
}

export function useCreditRatingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.creditRatings() });
  return {
    create: useMutation({ mutationFn: api.createCreditRating, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CreditRating> }) => api.updateCreditRating(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCreditRating, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Lifecycle Stages
export function useLifecycleStages() {
  return useQuery({ queryKey: customerSettingsKeys.lifecycleStages(), queryFn: api.fetchLifecycleStages, staleTime: 1000 * 60 * 10 });
}

export function useLifecycleStageMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.lifecycleStages() });
  return {
    create: useMutation({ mutationFn: api.createLifecycleStage, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<LifecycleStage> }) => api.updateLifecycleStage(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteLifecycleStage, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// SLA Settings
export function useCustomerSlaSettings() {
  return useQuery({ queryKey: customerSettingsKeys.slaSettings(), queryFn: api.fetchCustomerSlaSettings, staleTime: 1000 * 60 * 10 });
}

export function useCustomerSlaSettingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: customerSettingsKeys.slaSettings() });
  return {
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerSlaSetting> }) => api.updateCustomerSlaSetting(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
