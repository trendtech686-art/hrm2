import type { Metadata } from 'next'
import { CostAdjustmentDetailPage } from '@/features/cost-adjustments/detail-page'

export const metadata: Metadata = {
  title: 'Chi tiết điều chỉnh giá',
  description: 'Xem thông tin phiếu điều chỉnh giá',
}

export default function Page() {
  return <CostAdjustmentDetailPage />
}
