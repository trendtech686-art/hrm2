import type { Metadata } from 'next'
import { CashbookReportsPage } from '@/features/cashbook/reports-page'

export const metadata: Metadata = {
  title: 'Báo cáo sổ quỹ',
  description: 'Xem báo cáo sổ quỹ và thống kê tài chính',
}

export default function Page() {
  return <CashbookReportsPage />
}
