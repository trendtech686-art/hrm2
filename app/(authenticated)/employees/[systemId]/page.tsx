import type { Metadata } from 'next'
import { EmployeeDetailPage } from '@/features/employees/components/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết nhân viên',
  description: 'Xem thông tin nhân viên',
}

export default function Page() {
  return <EmployeeDetailPage />
}
