import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tạo phiếu trả hàng',
  description: 'Tạo phiếu trả hàng từ đơn hàng',
}

interface PageProps {
  params: Promise<{ systemId: string }>
}

/**
 * Route: /orders/[systemId]/return
 * Redirects to: /sales-returns/new/[systemId]
 * 
 * This is a convenience route that allows creating a sales return
 * directly from an order detail page.
 */
export default async function OrderReturnPage({ params }: PageProps) {
  const { systemId } = await params
  
  // Redirect to sales-returns/new/[orderSystemId] 
  redirect(`/sales-returns/new/${systemId}`)
}
