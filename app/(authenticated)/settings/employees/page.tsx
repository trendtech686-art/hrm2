import type { Metadata } from 'next'
import { EmployeeSettingsPage } from '@/features/settings/employees/employee-settings-page'

export const metadata: Metadata = {
  title: 'Cài đặt nhân viên',
  description: 'Quản lý cài đặt nhân viên',
}

export default function Page() {
  return <EmployeeSettingsPage />
}
