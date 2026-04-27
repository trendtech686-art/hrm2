import { useQuery } from '@tanstack/react-query'
import { orderKeys } from './use-orders'

export interface UnpaidOrder {
  systemId: string
  id: string
  orderDate: string
  grandTotal: number
  paidAmount: number
  remainingAmount: number
  paymentStatus: string
  customerName: string
}

/**
 * Fetch unpaid/partially paid orders for a customer (for receipt allocation)
 */
export function useUnpaidOrders(customerSystemId: string | undefined) {
  return useQuery<UnpaidOrder[]>({
    queryKey: orderKeys.unpaid(customerSystemId ?? ''),
    queryFn: async () => {
      if (!customerSystemId) return []
      const res = await fetch(`/api/orders/unpaid?customerSystemId=${encodeURIComponent(customerSystemId)}`)
      if (!res.ok) throw new Error('Không thể tải đơn chưa thanh toán')
      const json = await res.json()
      return json.data ?? json
    },
    enabled: !!customerSystemId,
    staleTime: 30_000,
  })
}
