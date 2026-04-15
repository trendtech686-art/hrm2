/**
 * useSupplierStats hook — Unified supplier profile + aggregated stats
 * 
 * ⚡ PERFORMANCE: Single API call returning:
 * - Full supplier profile
 * - Purchase order counts by status
 * - Purchase return counts
 * - Server-side debt calculation
 * 
 * Used by PO detail page to replace multiple API calls.
 */

import { useQuery } from '@tanstack/react-query'
import type { Supplier } from '@/lib/types/prisma-extended'

export interface SupplierStats {
  supplier: Supplier | null
  purchaseOrders: {
    total: number
    draft: number
    pending: number
    confirmed: number
    receiving: number
    completed: number
    cancelled: number
    // Vietnamese-friendly groupings
    ordered: number       // DRAFT + PENDING ("Đặt hàng")
    inProgress: number    // CONFIRMED + RECEIVING ("Đang giao dịch")
    lastOrderDate: string | null
  }
  purchaseReturns: {
    total: number
    pending: number
  }
  products: {
    orderedCount: number
    returnedCount: number
    totalQuantityOrdered: number
    totalQuantityReturned: number
  }
  financial: {
    totalPurchases: number
    totalPayments: number
    totalReturns: number
    debtBalance: number
  }
  warranties: {
    total: number
    sent: number        // Đang gửi BH (chưa trả)
    confirmed: number   // Đã xác nhận
    completed: number   // Hoàn thành (đã trả)
    totalSentQty: number             // Tổng SL gửi đi
    totalWarrantyProductQty: number  // Tổng SL SP được bảo hành
    totalWarrantyDeduction: number   // Tổng tiền trừ bảo hành
    totalNonWarrantyQty: number      // Tổng SL không được bảo hành
  }
}

const EMPTY_STATS: SupplierStats = {
  supplier: null,
  purchaseOrders: { 
    total: 0, 
    draft: 0, 
    pending: 0, 
    confirmed: 0, 
    receiving: 0, 
    completed: 0, 
    cancelled: 0,
    ordered: 0,
    inProgress: 0,
    lastOrderDate: null 
  },
  purchaseReturns: { total: 0, pending: 0 },
  products: { orderedCount: 0, returnedCount: 0, totalQuantityOrdered: 0, totalQuantityReturned: 0 },
  financial: { totalPurchases: 0, totalPayments: 0, totalReturns: 0, debtBalance: 0 },
  warranties: { total: 0, sent: 0, confirmed: 0, completed: 0, totalSentQty: 0, totalWarrantyProductQty: 0, totalWarrantyDeduction: 0, totalNonWarrantyQty: 0 },
}

async function fetchSupplierStats(systemId: string): Promise<SupplierStats> {
  const res = await fetch(`/api/suppliers/${systemId}/stats`)
  if (!res.ok) throw new Error('Failed to fetch supplier stats')
  return res.json()
}

export function useSupplierStats(supplierId: string | undefined | null) {
  const query = useQuery({
    queryKey: ['suppliers', 'stats', supplierId],
    queryFn: () => fetchSupplierStats(supplierId!),
    enabled: !!supplierId,
    staleTime: 60_000,
    gcTime: 5 * 60 * 1000,
  })

  return {
    data: query.data ?? EMPTY_STATS,
    isLoaded: !!query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}
