import type { Metadata } from 'next'
import { SalesReturnFormPage } from '@/features/sales-returns/form-page'

export const metadata: Metadata = {
  title: 'Tạo phiếu trả hàng',
  description: 'Tạo phiếu trả hàng từ đơn hàng',
}

/**
 * Route: /sales-returns/new/[orderSystemId]
 * 
 * Creates a new sales return from an existing order.
 * The orderSystemId is used to fetch the order details.
 */
export default function NewSalesReturnPage() {
  return <SalesReturnFormPage />
}
