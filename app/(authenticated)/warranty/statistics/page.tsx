import type { Metadata } from 'next'
import { WarrantyStatisticsPage } from '@/features/warranty/warranty-statistics-page'

export const metadata: Metadata = {
  title: 'Thống kê bảo hành',
  description: 'Xem thống kê và báo cáo bảo hành',
}

export default function Page() {
  return <WarrantyStatisticsPage />
}
