import type { Metadata } from 'next'
import { LeaveEditPage } from '@/features/leaves/components/edit-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa đơn nghỉ phép',
  description: 'Chỉnh sửa thông tin đơn nghỉ phép',
}

export default function Page() {
  return <LeaveEditPage />
}
