import type { Metadata } from 'next'
import { PayrollTemplatePage } from '@/features/payroll/template-page'

export const metadata: Metadata = {
  title: 'Mẫu bảng lương',
  description: 'Quản lý các mẫu bảng lương',
}

export default function Page() {
  return <PayrollTemplatePage />
}
