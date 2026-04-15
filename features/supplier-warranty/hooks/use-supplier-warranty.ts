/**
 * React Query hooks for supplier-warranty module
 */
import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSupplierWarranties, fetchSupplierWarranty } from '../api/supplier-warranty-api';
import { fetchReceipts } from '@/features/receipts/api/receipts-api';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import {
  createSupplierWarrantyAction,
  updateSupplierWarrantyAction,
  deleteSupplierWarrantyAction,
  confirmSupplierWarrantyAction,
  cancelSupplierWarrantyAction,
  completeSupplierWarrantyAction,
  approveSupplierWarrantyAction,
  packSupplierWarrantyAction,
  cancelPackSupplierWarrantyAction,
  exportSupplierWarrantyAction,
  deliverSupplierWarrantyAction,
  createWarrantyReceiptAction,
} from '@/app/actions/supplier-warranty';
import type { SupplierWarrantyParams } from '../types';
import type { CreateSupplierWarrantyInput, UpdateSupplierWarrantyInput, ConfirmSupplierWarrantyInput, CompleteSupplierWarrantyInput, ApproveSupplierWarrantyInput, PackSupplierWarrantyInput, CancelPackSupplierWarrantyInput, ExportSupplierWarrantyInput, DeliverSupplierWarrantyInput, CreateWarrantyReceiptInput } from '../validation';
import type { Receipt } from '@/lib/types/prisma-extended';

// Query keys
export const supplierWarrantyKeys = {
  all: ['supplier-warranty'] as const,
  lists: () => [...supplierWarrantyKeys.all, 'list'] as const,
  list: (params: SupplierWarrantyParams) => [...supplierWarrantyKeys.lists(), params] as const,
  details: () => [...supplierWarrantyKeys.all, 'detail'] as const,
  detail: (id: string) => [...supplierWarrantyKeys.details(), id] as const,
};

// List hook
export function useSupplierWarranties(params: SupplierWarrantyParams = {}) {
  return useQuery({
    queryKey: supplierWarrantyKeys.list(params),
    queryFn: () => fetchSupplierWarranties(params),
  });
}

// Detail hook
export function useSupplierWarranty(systemId: string) {
  return useQuery({
    queryKey: supplierWarrantyKeys.detail(systemId),
    queryFn: () => fetchSupplierWarranty(systemId),
    enabled: !!systemId,
  });
}

// Stable empty array
const EMPTY_RECEIPTS: Receipt[] = [];

// Receipts linked to warranty
export function useWarrantyReceipts(warrantySystemId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['receipts', 'warranty', warrantySystemId],
    queryFn: async () => {
      const res = await fetchReceipts({ linkedWarrantySystemId: warrantySystemId! });
      return res.data;
    },
    enabled: !!warrantySystemId,
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
  });

  const data = React.useMemo(() =>
    query.data || EMPTY_RECEIPTS,
    [query.data]
  );

  return { data, isLoading: query.isLoading, refetch: query.refetch };
}

// Mutation hooks
export function useSupplierWarrantyMutations() {
  const queryClient = useQueryClient();

  const invalidateAll = () => invalidateRelated(queryClient, 'supplier-warranty');

  const create = useMutation({
    mutationFn: async (data: CreateSupplierWarrantyInput) => {
      const result = await createSupplierWarrantyAction(data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const update = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: UpdateSupplierWarrantyInput }) => {
      const result = await updateSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const remove = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await deleteSupplierWarrantyAction(systemId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const confirm = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: ConfirmSupplierWarrantyInput }) => {
      const result = await confirmSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const cancel = useMutation({
    mutationFn: async (systemId: string) => {
      const result = await cancelSupplierWarrantyAction(systemId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const complete = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: CompleteSupplierWarrantyInput }) => {
      const result = await completeSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const createReceipt = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: CreateWarrantyReceiptInput }) => {
      const result = await createWarrantyReceiptAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const approve = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: ApproveSupplierWarrantyInput }) => {
      const result = await approveSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const pack = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: PackSupplierWarrantyInput }) => {
      const result = await packSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const cancelPack = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: CancelPackSupplierWarrantyInput }) => {
      const result = await cancelPackSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const exportWarranty = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: ExportSupplierWarrantyInput }) => {
      const result = await exportSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  const deliver = useMutation({
    mutationFn: async ({ systemId, data }: { systemId: string; data: DeliverSupplierWarrantyInput }) => {
      const result = await deliverSupplierWarrantyAction(systemId, data);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: invalidateAll,
  });

  return { create, update, remove, confirm, cancel, complete, approve, pack, cancelPack, exportWarranty, deliver, createReceipt };
}
