import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { CustomerDetailPage } from '@/features/customers/detail-page'

type Props = {
  params: Promise<{ systemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  
  try {
    const customer = await prisma.customer.findUnique({
      where: { systemId },
      select: { id: true, name: true },
    })
    
    if (!customer) {
      return { title: 'Khách hàng không tồn tại' }
    }

    return {
      title: `${customer.name}`,
      description: `Thông tin khách hàng ${customer.name} - Mã: ${customer.id}`,
    }
  } catch {
    return { title: 'Chi tiết khách hàng' }
  }
}

export default function Page() {
  return <CustomerDetailPage />
}
