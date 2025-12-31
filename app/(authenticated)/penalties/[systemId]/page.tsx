import type { Metadata } from 'next'
import { PenaltyDetailPage } from '@/features/settings/penalties/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết phạt',
  description: 'Xem thông tin phiếu phạt',
}

export default function Page() {
  return <PenaltyDetailPage />
}
