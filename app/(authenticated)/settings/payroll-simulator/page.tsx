import type { Metadata } from 'next'
import { PayrollSimulatorPage } from '@/features/settings/payroll/payroll-simulator-page'

export const metadata: Metadata = {
  title: 'Tính thử công thức lương',
  description: 'Công cụ kiểm tra công thức lương trước khi áp dụng chính thức',
}

export default function Page() {
  return <PayrollSimulatorPage />
}
