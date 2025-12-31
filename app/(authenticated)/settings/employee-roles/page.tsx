import type { Metadata } from 'next'
import { EmployeeRolesPage } from '@/features/settings/employees/employee-roles-page'

export const metadata: Metadata = {
  title: 'Vai trò nhân viên',
  description: 'Quản lý vai trò và quyền hạn',
}

export default function Page() {
  return <EmployeeRolesPage />
}
