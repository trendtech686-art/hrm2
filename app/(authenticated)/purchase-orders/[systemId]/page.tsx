import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { PurchaseOrderDetailPage } from '@/features/purchase-orders/detail-page'

type Props = {
  params: Promise<{ systemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  
  try {
    const po = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      select: { id: true, supplierName: true },
    })
    
    if (!po) {
      return { title: 'Đơn nhập hàng không tồn tại' }
    }

    return {
      title: `Đơn nhập hàng ${po.id}`,
      description: `Chi tiết đơn nhập hàng ${po.id} - NCC: ${po.supplierName || 'N/A'}`,
    }
  } catch {
    return { title: 'Chi tiết đơn nhập hàng' }
  }
}

export default function Page() {
  return <PurchaseOrderDetailPage />
}
