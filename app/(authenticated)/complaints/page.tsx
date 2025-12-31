import type { Metadata } from 'next'
import { ComplaintsPage } from '@/features/complaints/page'

export const metadata: Metadata = {
  title: 'Khiếu nại',
  description: 'Quản lý khiếu nại khách hàng',
}

export default function Page() {
  return <ComplaintsPage />
}
