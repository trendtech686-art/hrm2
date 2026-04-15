import type { Metadata } from 'next'
import { LeaveCreatePage } from '@/features/leaves/components/create-page'

export const metadata: Metadata = {
  title: 'Tạo đơn nghỉ phép',
  description: 'Tạo đơn nghỉ phép mới',
}

export default function Page() {
  return <LeaveCreatePage />
}
