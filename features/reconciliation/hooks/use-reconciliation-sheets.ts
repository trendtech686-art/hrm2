/**
 * React Query hooks for Reconciliation Sheets
 * 
 * Uses API Routes for both reads and mutations (Hybrid pattern).
 */

import { useQuery, useInfiniteQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import * as api from '../api/reconciliation-sheets-api'
import type {
  ReconciliationSheetsParams,
  CreateSheetInput,
} from '../api/reconciliation-sheets-api'

// ─── Query Key Factory ─────────────────────────────────────

export const sheetKeys = {
  all: ['reconciliation-sheets'] as const,
  lists: () => [...sheetKeys.all, 'list'] as const,
  list: (params: ReconciliationSheetsParams) => [...sheetKeys.lists(), params] as const,
  details: () => [...sheetKeys.all, 'detail'] as const,
  detail: (id: string) => [...sheetKeys.details(), id] as const,
  available: (params?: { carrier?: string; search?: string }) => [...sheetKeys.all, 'available', params] as const,
  carriers: () => [...sheetKeys.all, 'carriers'] as const,
}

// ─── Queries ────────────────────────────────────────────────

export function useCarriers() {
  return useQuery({
    queryKey: sheetKeys.carriers(),
    queryFn: () => api.fetchCarriers(),
    staleTime: 1000 * 60 * 10, // 10 phút — carrier ít thay đổi
  })
}

export function useReconciliationSheets(params: ReconciliationSheetsParams = {}) {
  return useQuery({
    queryKey: sheetKeys.list(params),
    queryFn: () => api.fetchReconciliationSheets(params),
    staleTime: 1000 * 60 * 2,
    placeholderData: keepPreviousData,
  })
}

export function useReconciliationSheet(systemId: string | undefined) {
  return useQuery({
    queryKey: sheetKeys.detail(systemId!),
    queryFn: () => api.fetchReconciliationSheet(systemId!),
    enabled: !!systemId,
  })
}

const SHIPMENTS_PAGE_SIZE = 50

export function useInfiniteAvailableShipments(
  params: { carrier?: string; search?: string } = {},
  enabled = true,
) {
  return useInfiniteQuery({
    queryKey: [...sheetKeys.available(params), 'infinite'] as const,
    queryFn: ({ pageParam = 0 }) =>
      api.fetchAvailableShipments({ ...params, limit: SHIPMENTS_PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.hasMore ? lastPageParam + SHIPMENTS_PAGE_SIZE : undefined,
    staleTime: 1000 * 30,
    enabled,
  })
}

// ─── Mutations ──────────────────────────────────────────────

export function useCreateSheet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateSheetInput) => api.createReconciliationSheet(data),
    onSuccess: () => {
      invalidateRelated(qc, 'reconciliation-sheets')
    },
  })
}

export function useDeleteSheet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (systemId: string) => api.deleteReconciliationSheet(systemId),
    onSuccess: () => {
      invalidateRelated(qc, 'reconciliation-sheets')
    },
  })
}

export function useConfirmSheet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (systemId: string) => api.confirmReconciliationSheet(systemId),
    onSuccess: () => {
      invalidateRelated(qc, 'reconciliation-sheets')
    },
  })
}
