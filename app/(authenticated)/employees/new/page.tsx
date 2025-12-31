import type { Metadata } from 'next'
import { EmployeeFormPage } from '@/features/employees/components/employee-form-page'

export const metadata: Metadata = {
  title: 'Thêm nhân viên mới',
  description: 'Tạo nhân viên mới',
}

export default function Page() {
  return <EmployeeFormPage />
}
