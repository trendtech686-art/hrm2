import type { Metadata } from 'next'
import { PayrollListPage } from '@/features/payroll/list-page'

export const metadata: Metadata = {
  title: 'Bảng lương',
  description: 'Quản lý bảng lương nhân viên',
}

export default function Page() {
  return <PayrollListPage />
}
