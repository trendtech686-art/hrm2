import type { Metadata } from 'next'
import { DepartmentsPage } from '@/features/settings/departments/page'

export const metadata: Metadata = {
  title: 'Phòng ban',
  description: 'Quản lý cơ cấu phòng ban',
}

export default function Page() {
  return <DepartmentsPage />
}
