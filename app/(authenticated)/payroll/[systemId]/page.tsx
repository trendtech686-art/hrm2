import type { Metadata } from 'next'
import { PayrollDetailPage } from '@/features/payroll/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết bảng lương',
  description: 'Xem thông tin bảng lương',
}

export default function Page() {
  return <PayrollDetailPage />
}
