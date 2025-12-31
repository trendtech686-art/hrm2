import type { Metadata } from 'next'
import { EmployeesPage } from '@/features/employees/page'

export const metadata: Metadata = {
  title: 'Nhân viên',
  description: 'Quản lý thông tin nhân viên',
}

export default function Page() {
  return <EmployeesPage />
}
