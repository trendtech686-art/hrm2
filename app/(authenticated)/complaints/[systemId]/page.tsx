import type { Metadata } from 'next'
import { ComplaintDetailPage } from '@/features/complaints/components/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết khiếu nại',
  description: 'Xem thông tin khiếu nại',
}

export default function Page() {
  return <ComplaintDetailPage />
}
