import type { Metadata } from 'next'
import { LeavesPage } from '@/features/leaves/page'

export const metadata: Metadata = {
  title: 'Nghỉ phép',
  description: 'Quản lý đơn nghỉ phép',
}

export default function Page() {
  return <LeavesPage />
}
