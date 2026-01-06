import type { Metadata } from 'next'
import { DynamicCashbookReportsPage } from '@/features/cashbook/dynamic-reports-page'

export const metadata: Metadata = {
  title: 'Báo cáo sổ quỹ',
  description: 'Xem báo cáo sổ quỹ và thống kê tài chính',
}

export default function Page() {
  return <DynamicCashbookReportsPage />
}
