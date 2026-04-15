/**
 * Customer Settings React Query Hooks
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as api from '../api/customer-settings-api';
import type { CustomerType, CustomerGroup, CustomerSource, PaymentTerm, CreditRating, LifecycleStage, CustomerSlaSetting } from '@/lib/types/prisma-extended';

export const customerSettingsKeys = {
  all: ['customer-settings'] as const,
  combined: () => [...customerSettingsKeys.all, 'combined'] as const,
  types: () => [...customerSettingsKeys.all, 'types'] as const,
  groups: () => [...customerSettingsKeys.all, 'groups'] as const,
  sources: () => [...customerSettingsKeys.all, 'sources'] as const,
  paymentTerms: () => [...customerSettingsKeys.all, 'payment-terms'] as const,
  creditRatings: () => [...customerSettingsKeys.all, 'credit-ratings'] as const,
  lifecycleStages: () => [...customerSettingsKeys.all, 'lifecycle-stages'] as const,
  slaSettings: () => [...customerSettingsKeys.all, 'sla-settings'] as const,
};

/**
 * Consolidated hook: fetches ALL customer settings in a single API call.
 * Use this in pages that need multiple settings types (e.g. detail page, form).
 */
export function useAllCustomerSettings() {
  return useQuery({
    queryKey: customerSettingsKeys.combined(),
    queryFn: api.fetchAllCustomerSettings,
    staleTime: 1000 * 60 * 10,
    gcTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

// Customer Types
export function useCustomerTypes() {
  return useQuery({ queryKey: customerSettingsKeys.types(), queryFn: api.fetchCustomerTypes, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useCustomerTypeMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createCustomerType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerType> }) => api.updateCustomerType(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerType, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Customer Groups
export function useCustomerGroups() {
  return useQuery({ queryKey: customerSettingsKeys.groups(), queryFn: api.fetchCustomerGroups, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useCustomerGroupMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createCustomerGroup, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerGroup> }) => api.updateCustomerGroup(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerGroup, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Customer Sources
export function useCustomerSources() {
  return useQuery({ queryKey: customerSettingsKeys.sources(), queryFn: api.fetchCustomerSources, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useCustomerSourceMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createCustomerSource, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerSource> }) => api.updateCustomerSource(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerSource, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Payment Terms
export function usePaymentTerms() {
  return useQuery({ queryKey: customerSettingsKeys.paymentTerms(), queryFn: api.fetchPaymentTerms, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function usePaymentTermMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createPaymentTerm, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<PaymentTerm> }) => api.updatePaymentTerm(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deletePaymentTerm, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Credit Ratings
export function useCreditRatings() {
  return useQuery({ queryKey: customerSettingsKeys.creditRatings(), queryFn: api.fetchCreditRatings, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useCreditRatingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createCreditRating, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CreditRating> }) => api.updateCreditRating(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCreditRating, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// Lifecycle Stages
export function useLifecycleStages() {
  return useQuery({ queryKey: customerSettingsKeys.lifecycleStages(), queryFn: api.fetchLifecycleStages, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useLifecycleStageMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createLifecycleStage, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<LifecycleStage> }) => api.updateLifecycleStage(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteLifecycleStage, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}

// SLA Settings
export function useCustomerSlaSettings() {
  return useQuery({ queryKey: customerSettingsKeys.slaSettings(), queryFn: api.fetchCustomerSlaSettings, staleTime: 1000 * 60 * 10, gcTime: 10 * 60 * 1000, placeholderData: keepPreviousData });
}

export function useCustomerSlaSettingMutations(opts?: { onSuccess?: () => void }) {
  const qc = useQueryClient();
  const invalidate = () => invalidateRelated(qc, 'customer-settings');
  return {
    create: useMutation({ mutationFn: api.createCustomerSlaSetting, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    update: useMutation({ mutationFn: ({ systemId, data }: { systemId: string; data: Partial<CustomerSlaSetting> }) => api.updateCustomerSlaSetting(systemId, data), onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
    remove: useMutation({ mutationFn: api.deleteCustomerSlaSetting, onSuccess: () => { invalidate(); opts?.onSuccess?.(); } }),
  };
}
