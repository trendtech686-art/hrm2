import { useQuery } from '@tanstack/react-query'

export interface UnpaidPurchaseOrder {
  systemId: string
  id: string
  orderDate: string
  grandTotal: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: string
  supplierName: string
}

/**
 * Fetch unpaid/partially paid purchase orders for a supplier (for payment allocation)
 */
export function useUnpaidPurchaseOrders(supplierSystemId: string | undefined) {
  return useQuery<UnpaidPurchaseOrder[]>({
    queryKey: ['purchase-orders', 'unpaid', supplierSystemId],
    queryFn: async () => {
      if (!supplierSystemId) return []
      const res = await fetch(`/api/purchase-orders/unpaid?supplierSystemId=${encodeURIComponent(supplierSystemId)}`)
      if (!res.ok) throw new Error('Không thể tải danh sách đơn chưa thanh toán')
      const json = await res.json()
      return json.data ?? json
    },
    enabled: !!supplierSystemId,
    staleTime: 30_000,
  })
}
