import type { Metadata } from 'next'
import { ReportsIndexPage } from '@/features/reports/index-page'

export const metadata: Metadata = {
  title: 'Báo cáo',
  description: 'Xem các báo cáo kinh doanh',
}

export default function Page() {
  return <ReportsIndexPage />
}
