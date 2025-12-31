import type { Metadata } from 'next'
import { LeaveDetailPage } from '@/features/leaves/components/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết nghỉ phép',
  description: 'Xem thông tin đơn nghỉ phép',
}

export default function Page() {
  return <LeaveDetailPage />
}
