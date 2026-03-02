import type { Metadata } from 'next'
import { EmployeeTrashPage } from '@/features/employees/trash-page'

export const metadata: Metadata = {
  title: 'Nhân viên đã xóa',
  description: 'Danh sách nhân viên đã xóa - có thể khôi phục',
}

export default function Page() {
  return <EmployeeTrashPage />
}
