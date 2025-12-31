import type { Metadata } from 'next'
import { DepartmentFormPage } from '@/features/settings/departments/department-form-page'

export const metadata: Metadata = {
  title: 'Chỉnh sửa phòng ban',
  description: 'Chỉnh sửa thông tin phòng ban',
}

export default function Page() {
  return <DepartmentFormPage />
}
