import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { OrderDetailPage } from '@/features/orders/components/order-detail-page'

type Props = {
  params: Promise<{ systemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  
  try {
    const order = await prisma.order.findUnique({
      where: { systemId },
      select: { id: true, customerName: true },
    })
    
    if (!order) {
      return { title: 'Đơn hàng không tồn tại' }
    }

    return {
      title: `Đơn hàng ${order.id}`,
      description: `Chi tiết đơn hàng ${order.id} - Khách hàng: ${order.customerName}`,
    }
  } catch {
    return { title: 'Chi tiết đơn hàng' }
  }
}

export default function Page() {
  return <OrderDetailPage />
}
