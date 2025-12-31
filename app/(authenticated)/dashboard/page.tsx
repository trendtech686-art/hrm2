import type { Metadata } from 'next'
import { DashboardPageLite } from '@/features/dashboard/page-lite'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tổng quan hoạt động kinh doanh và các chỉ số quan trọng',
}

// Use lightweight dashboard that fetches aggregated data from API
// instead of loading all orders/customers/employees into memory
export default function Page() {
  return <DashboardPageLite />
}
