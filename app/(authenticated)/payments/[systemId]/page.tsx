import type { Metadata } from 'next'
import { PaymentDetailPage } from '@/features/payments/detail-page'

type Props = { params: Promise<{ systemId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  return {
    title: `Phiếu chi ${systemId}`,
    description: 'Xem thông tin phiếu chi',
  }
}

export default async function Page({ params }: Props) {
  const { systemId } = await params
  return <PaymentDetailPage systemId={systemId} />
}
