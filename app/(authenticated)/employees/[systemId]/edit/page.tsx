import type { Metadata } from 'next'
import { EmployeeFormPage } from '@/features/employees/components/employee-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa nhân viên',
  description: 'Chỉnh sửa thông tin nhân viên',
}

export default function Page() {
  return <EmployeeFormPage />
}
