import type { Metadata } from 'next'
import { CostAdjustmentListPage } from '@/features/cost-adjustments/page'

export const metadata: Metadata = {
  title: 'Điều chỉnh chi phí',
  description: 'Quản lý và theo dõi các phiếu điều chỉnh chi phí',
}

export default function Page() {
  return <CostAdjustmentListPage />
}
