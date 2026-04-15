import type { Metadata } from 'next'
import { ReceiptDetailPage } from '@/features/receipts/detail-page'

type Props = { params: Promise<{ systemId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { systemId } = await params
  return {
    title: `Phiếu thu ${systemId}`,
    description: 'Xem thông tin phiếu thu',
  }
}

export default async function Page({ params }: Props) {
  const { systemId } = await params
  return <ReceiptDetailPage systemId={systemId} />
}
