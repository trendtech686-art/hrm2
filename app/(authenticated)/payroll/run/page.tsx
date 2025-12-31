import type { Metadata } from 'next'
import { PayrollRunPage } from '@/features/payroll/run-page'

export const metadata: Metadata = {
  title: 'Chạy bảng lương',
  description: 'Tính toán và chạy bảng lương định kỳ',
}

export default function Page() {
  return <PayrollRunPage />
}
