import type { Metadata } from 'next'
import { DepartmentFormPage } from '@/features/settings/departments/department-form-page'

export const metadata: Metadata = {
  title: 'Tạo phòng ban mới',
  description: 'Tạo phòng ban mới',
}

export default function Page() {
  return <DepartmentFormPage />
}
